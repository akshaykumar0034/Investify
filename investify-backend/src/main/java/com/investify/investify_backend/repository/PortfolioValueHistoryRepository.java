package com.investify.investify_backend.repository;

import com.investify.investify_backend.entity.Portfolio;
import com.investify.investify_backend.entity.PortfolioValueHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PortfolioValueHistoryRepository extends JpaRepository<PortfolioValueHistory, Long> {

    // Find all history for a portfolio, sorted by date
    List<PortfolioValueHistory> findByPortfolioOrderByDateAsc(Portfolio portfolio);
}