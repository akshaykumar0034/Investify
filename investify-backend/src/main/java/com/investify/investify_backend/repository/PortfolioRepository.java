package com.investify.investify_backend.repository;

import com.investify.investify_backend.entity.Portfolio;
import com.investify.investify_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    // Find a portfolio by the User object
    Optional<Portfolio> findByUser(User user);

    // Find a portfolio by the user's email
    Optional<Portfolio> findByUserEmail(String email);
}