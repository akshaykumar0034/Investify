package com.investify.investify_backend.service.impl;

import com.investify.investify_backend.dto.TransactionRequest;
import com.investify.investify_backend.entity.Order;
import com.investify.investify_backend.entity.User;
import com.investify.investify_backend.repository.OrderRepository;
import com.investify.investify_backend.repository.UserRepository;
import com.investify.investify_backend.service.OrderService;
import com.investify.investify_backend.service.TransactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.investify.investify_backend.dto.QuoteDto;
import com.investify.investify_backend.service.MarketService;
import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final TransactionService transactionService;
    private final MarketService marketService;
    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

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
            // We'll also check if they have enough funds/shares to place it
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
            // In a real system, we would "hold" these funds.
        }
        // We'll skip SELL validation for now to keep it simpler
    }

    @Override
    public List<Order> getOrderHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Override
    public void processPendingOrders() {
        logger.info("--- 🤖 Order Execution Job STARTING ---");
        // 1. Find all pending orders
        List<Order> pendingOrders = orderRepository.findByStatus("PENDING");

        if (pendingOrders.isEmpty()) {
            logger.info("No pending orders found.");
            return;
        }

        logger.info("Found {} pending orders. Checking prices...", pendingOrders.size());

        for (Order order : pendingOrders) {
            try {
                // 2. Get live price for the order's ticker
                QuoteDto quote = marketService.getQuote(order.getTicker());
                double livePrice = quote.getCurrentPrice();

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

                    // We call addTransaction, which already handles wallet/holding logic!
                    // This needs to be @Transactional
                    executeTrade(order, txRequest);
                }

            } catch (Exception e) {
                // If one order fails (e.g., API limit, insufficient funds), log it and continue
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