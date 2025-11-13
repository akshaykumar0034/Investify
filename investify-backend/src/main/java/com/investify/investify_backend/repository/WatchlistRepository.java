package com.investify.investify_backend.repository;

import com.investify.investify_backend.entity.User;
import com.investify.investify_backend.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    // Find all watchlist items for a specific user
    List<Watchlist> findByUser(User user);

    // Find a specific item to prevent duplicates or for deletion
    Optional<Watchlist> findByUserAndTicker(User user, String ticker);
}