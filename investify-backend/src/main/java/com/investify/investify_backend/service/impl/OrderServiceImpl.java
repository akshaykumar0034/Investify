package com.investify.investify_backend.service.impl;

// --- 1. UPDATE IMPORTS ---
import com.investify.investify_backend.dto.QuoteDto; // <-- Use Finnhub's QuoteDto
import com.investify.investify_backend.dto.TransactionRequest;
import com.investify.investify_backend.entity.Order;
import com.investify.investify_backend.entity.User;
import com.investify.investify_backend.repository.OrderRepository;
import com.investify.investify_backend.repository.UserRepository;
import com.investify.investify_backend.service.MarketService;
import com.investify.investify_backend.service.OrderService;
import com.investify.investify_backend.service.TransactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final TransactionService transactionService;
    private final MarketService marketService;

    @Override
    @Transactional
    public void placeOrder(String userEmail, TransactionRequest orderRequest) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setTicker(orderRequest.getTicker().toUpperCase());
        order.setType(orderRequest.getType());
        order.setOrderType(orderRequest.getOrderType());
        order.setQuantity(orderRequest.getQuantity());
        order.setLimitPrice(orderRequest.getPrice()); // For both market and limit
        order.setCreatedAt(LocalDateTime.now());

        if ("MARKET".equalsIgnoreCase(orderRequest.getOrderType())) {
            // If it's a Market order, execute it immediately
            transactionService.addTransaction(userEmail, orderRequest);
            order.setStatus("COMPLETED");
            order.setExecutedAt(LocalDateTime.now());
        } else {
            // If it's a Limit order, just save it as "PENDING"
            validateLimitOrder(user, order);
            order.setStatus("PENDING");
        }

        orderRepository.save(order);
    }

    private void validateLimitOrder(User user, Order order) {
        if ("BUY".equalsIgnoreCase(order.getType())) {
            double cost = order.getLimitPrice() * order.getQuantity();
            if (user.getWalletBalance() < cost) {
                throw new IllegalStateException("Insufficient funds to place limit order.");
            }
        }
    }

    @Override
    public List<Order> getOrderHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // --- THIS IS THE UPDATED METHOD ---
    @Override
    public void processPendingOrders() {
        logger.info("--- 🤖 Order Execution Job STARTING ---");
        List<Order> pendingOrders = orderRepository.findByStatus("PENDING");

        if (pendingOrders.isEmpty()) {
            logger.info("No pending orders found.");
            return;
        }

        logger.info("Found {} pending orders. Checking prices...", pendingOrders.size());

        for (Order order : pendingOrders) {
            try {
                // --- 2. THIS IS THE FIX ---
                // getQuote now returns a single Finnhub DTO
                QuoteDto quote = marketService.getQuote(order.getTicker());
                if (quote == null || quote.getCurrentPrice() == null || quote.getCurrentPrice() == 0) {
                    logger.warn("Could not find valid quote for ticker: {}", order.getTicker());
                    continue; // Skip to the next order
                }

                // Get the current price
                double livePrice = quote.getCurrentPrice();
                // --- END OF FIX ---

                boolean shouldExecute = false;

                // 3. Check if the order should be executed
                if ("BUY".equalsIgnoreCase(order.getType())) {
                    if (livePrice <= order.getLimitPrice()) {
                        logger.info("BUY order {} for {} can be executed. Live price: {}, Limit: {}",
                                order.getId(), order.getTicker(), livePrice, order.getLimitPrice());
                        shouldExecute = true;
                    }
                } else if ("SELL".equalsIgnoreCase(order.getType())) {
                    if (livePrice >= order.getLimitPrice()) {
                        logger.info("SELL order {} for {} can be executed. Live price: {}, Limit: {}",
                                order.getId(), order.getTicker(), livePrice, order.getLimitPrice());
                        shouldExecute = true;
                    }
                }

                // 4. If it executes, call the TransactionService
                if (shouldExecute) {
                    TransactionRequest txRequest = new TransactionRequest();
                    txRequest.setTicker(order.getTicker());
                    txRequest.setType(order.getType());
                    txRequest.setQuantity(order.getQuantity());
                    txRequest.setPrice(livePrice); // Execute at the *live* price
                    txRequest.setDate(LocalDateTime.now());
                    txRequest.setOrderType("MARKET"); // It's now a market execution

                    executeTrade(order, txRequest);
                }

            } catch (Exception e) {
                logger.error("Failed to process order {}: {}", order.getId(), e.getMessage());
            }
        }
        logger.info("--- 🤖 Order Execution Job FINISHED ---");
    }

    @Transactional
    public void executeTrade(Order order, TransactionRequest txRequest) {
        // Call the existing transaction logic
        transactionService.addTransaction(order.getUser().getEmail(), txRequest);

        // Update the order status
        order.setStatus("COMPLETED");
        order.setExecutedAt(LocalDateTime.now());
        orderRepository.save(order);
    }
}