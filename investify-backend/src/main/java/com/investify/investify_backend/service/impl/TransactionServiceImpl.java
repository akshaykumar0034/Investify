package com.investify.investify_backend.service.impl;

import com.investify.investify_backend.dto.TransactionRequest;
import com.investify.investify_backend.entity.Holding;
import com.investify.investify_backend.entity.Portfolio;
import com.investify.investify_backend.entity.Transaction;
import com.investify.investify_backend.entity.User;
import com.investify.investify_backend.repository.HoldingRepository;
import com.investify.investify_backend.repository.PortfolioRepository;
import com.investify.investify_backend.repository.TransactionRepository;
import com.investify.investify_backend.repository.UserRepository;
import com.investify.investify_backend.service.TransactionService;
import com.investify.investify_backend.entity.PortfolioValueHistory;
import com.investify.investify_backend.repository.PortfolioValueHistoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final PortfolioValueHistoryRepository historyRepository;

    @Override
    @Transactional
    public void addTransaction(String userEmail, TransactionRequest txRequest) {
        // --- 1. Get User & Portfolio ---
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        Portfolio portfolio = portfolioRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Portfolio not found for user"));
        portfolio.getHoldings().size(); // Force load holdings

        // --- 2. Create and Save Transaction Record (for both BUY and SELL) ---
        Transaction transaction = new Transaction();
        transaction.setPortfolio(portfolio);
        transaction.setTicker(txRequest.getTicker());
        transaction.setType(txRequest.getType());
        transaction.setQuantity(txRequest.getQuantity());
        transaction.setPrice(txRequest.getPrice());
        transaction.setDate(txRequest.getDate());
        transactionRepository.save(transaction);

        double transactionValue = txRequest.getPrice() * txRequest.getQuantity();

        // --- 3. Handle Business Logic (BUY or SELL) ---
        if ("BUY".equalsIgnoreCase(txRequest.getType())) {
            handleBuyLogic(user, portfolio, txRequest, transactionValue);
        } else if ("SELL".equalsIgnoreCase(txRequest.getType())) {
            handleSellLogic(user, portfolio, txRequest, transactionValue);
        } else {
            throw new IllegalArgumentException("Invalid transaction type");
        }
        savePortfolioHistory(portfolio);
    }


    private void handleBuyLogic(User user, Portfolio portfolio, TransactionRequest txRequest, double transactionCost) {

        if (user.getWalletBalance() < transactionCost) {
            throw new IllegalStateException("Insufficient funds. Transaction declined.");
        }

        Holding holding = holdingRepository.findByPortfolioAndTicker(portfolio, txRequest.getTicker())
                .orElse(new Holding());

        if (holding.getId() != null) {
            double oldQuantity = holding.getQuantity();
            double oldAvgPrice = holding.getAvgBuyPrice();
            double newQuantity = txRequest.getQuantity();
            double newPrice = txRequest.getPrice();
            double newAvgPrice = ((oldQuantity * oldAvgPrice) + (newQuantity * newPrice)) / (oldQuantity + newQuantity);

            holding.setQuantity(oldQuantity + newQuantity);
            holding.setAvgBuyPrice(newAvgPrice);
        } else {
            holding.setPortfolio(portfolio);
            holding.setTicker(txRequest.getTicker());
            holding.setQuantity(txRequest.getQuantity());
            holding.setAvgBuyPrice(txRequest.getPrice());
        }
        holdingRepository.save(holding);
        portfolio.getHoldings().add(holding);

        portfolio.setTotalInvested(portfolio.getTotalInvested() + transactionCost);
        portfolioRepository.save(portfolio);

        user.setWalletBalance(user.getWalletBalance() - transactionCost);
        userRepository.save(user);
    }

    private void handleSellLogic(User user, Portfolio portfolio, TransactionRequest txRequest, double transactionProceeds) {
        Holding holding = holdingRepository.findByPortfolioAndTicker(portfolio, txRequest.getTicker())
                .orElseThrow(() -> new IllegalStateException("You do not own any shares of " + txRequest.getTicker()));

        if (holding.getQuantity() < txRequest.getQuantity()) {
            throw new IllegalStateException(String.format("Insufficient shares. You only have %.2f shares of %s.",
                    holding.getQuantity(), txRequest.getTicker()));
        }

        double newQuantity = holding.getQuantity() - txRequest.getQuantity();
        if (newQuantity > 0.0001) {
            holding.setQuantity(newQuantity);
            holdingRepository.save(holding);
        } else {
            portfolio.getHoldings().remove(holding);
            holdingRepository.delete(holding);
        }

        double costOfSharesSold = holding.getAvgBuyPrice() * txRequest.getQuantity();
        portfolio.setTotalInvested(portfolio.getTotalInvested() - costOfSharesSold);
        portfolioRepository.save(portfolio);

        user.setWalletBalance(user.getWalletBalance() + transactionProceeds);
        userRepository.save(user);
    }

    private void savePortfolioHistory(Portfolio portfolio) {
        PortfolioValueHistory history = new PortfolioValueHistory();
        history.setPortfolio(portfolio);
        history.setDate(LocalDate.now());
        history.setTotalInvestedValue(portfolio.getTotalInvested());

        history.setMarketValue(portfolio.getTotalInvested());

        historyRepository.save(history);
    }
}