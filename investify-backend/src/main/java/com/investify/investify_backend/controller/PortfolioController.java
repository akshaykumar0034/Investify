package com.investify.investify_backend.controller;

import com.investify.investify_backend.entity.Portfolio;
import com.investify.investify_backend.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.investify.investify_backend.dto.PerformanceDataPoint;
import java.util.List;

import java.security.Principal;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    public ResponseEntity<?> getMyPortfolio(Principal principal) {
        try {
            String userEmail = principal.getName();

            // Use the service to get the portfolio
            Portfolio portfolio = portfolioService.getPortfolioByUserEmail(userEmail);

            return ResponseEntity.ok(portfolio);
        } catch (IllegalStateException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/performance")
    public ResponseEntity<List<PerformanceDataPoint>> getPerformance(Principal principal) {
        try {
            List<PerformanceDataPoint> history = portfolioService.getPerformanceHistory(principal.getName());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
