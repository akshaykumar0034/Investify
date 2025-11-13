package com.investify.investify_backend.repository;

import com.investify.investify_backend.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;
import com.investify.investify_backend.entity.Portfolio;
import java.util.Optional;

public interface HoldingRepository extends JpaRepository<Holding, Long> {

    Optional<Holding> findByPortfolioAndTicker(Portfolio portfolio, String ticker);
}