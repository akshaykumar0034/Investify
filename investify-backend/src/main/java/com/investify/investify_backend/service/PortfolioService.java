package com.investify.investify_backend.service;

import com.investify.investify_backend.entity.Portfolio;
import com.investify.investify_backend.dto.PerformanceDataPoint;
import java.util.List;

public interface PortfolioService {
    Portfolio getPortfolioByUserEmail(String email);

    List<PerformanceDataPoint> getPerformanceHistory(String userEmail);
}