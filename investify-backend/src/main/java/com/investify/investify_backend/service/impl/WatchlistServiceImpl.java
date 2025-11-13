package com.investify.investify_backend.service.impl;

import com.investify.investify_backend.entity.User;
import com.investify.investify_backend.entity.Watchlist;
import com.investify.investify_backend.repository.UserRepository;
import com.investify.investify_backend.repository.WatchlistRepository;
import com.investify.investify_backend.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WatchlistServiceImpl implements WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Watchlist> getWatchlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return watchlistRepository.findByUser(user);
    }

    @Override
    @Transactional
    public Watchlist addToWatchlist(String userEmail, String ticker) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Check if it's already on the watchlist
        if (watchlistRepository.findByUserAndTicker(user, ticker).isPresent()) {
            throw new IllegalStateException("Ticker already on watchlist");
        }

        Watchlist newItem = new Watchlist();
        newItem.setUser(user);
        newItem.setTicker(ticker.toUpperCase());
        return watchlistRepository.save(newItem);
    }

    @Override
    @Transactional
    public void removeFromWatchlist(String userEmail, String ticker) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        Watchlist item = watchlistRepository.findByUserAndTicker(user, ticker)
                .orElseThrow(() -> new IllegalStateException("Ticker not found on watchlist"));

        watchlistRepository.delete(item);
    }
}