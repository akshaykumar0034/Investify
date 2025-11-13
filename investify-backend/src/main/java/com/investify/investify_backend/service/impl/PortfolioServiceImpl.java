package com.investify.investify_backend.service.impl;

import com.investify.investify_backend.entity.Portfolio;
import com.investify.investify_backend.repository.PortfolioRepository;
import com.investify.investify_backend.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.investify.investify_backend.dto.PerformanceDataPoint;
import com.investify.investify_backend.entity.PortfolioValueHistory;
import com.investify.investify_backend.repository.PortfolioValueHistoryRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final PortfolioValueHistoryRepository historyRepository;

    @Override
    @Transactional(readOnly = true) // <-- This is the magic!
    public Portfolio getPortfolioByUserEmail(String email) {
        // 1. Find the portfolio
        Portfolio portfolio = portfolioRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalStateException("Portfolio not found"));

        // 2. Because of @Transactional, the session is still open.
        //    We can now "wake up" the lazy-loaded holdings.
        portfolio.getHoldings().size(); // This forces Hibernate to load the holdings

        return portfolio;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PerformanceDataPoint> getPerformanceHistory(String userEmail) {
        // 1. Find the portfolio
        Portfolio portfolio = portfolioRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("Portfolio not found"));

        // 2. Get its history
        List<PortfolioValueHistory> history = historyRepository.findByPortfolioOrderByDateAsc(portfolio);

        // 3. Convert to DTOs
        return history.stream()
                .map(h -> new PerformanceDataPoint(h.getDate(), h.getTotalInvestedValue()))
                .collect(Collectors.toList());
    }
}
