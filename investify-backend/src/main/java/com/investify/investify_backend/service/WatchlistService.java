package com.investify.investify_backend.service;

import com.investify.investify_backend.entity.Watchlist;
import java.util.List;

public interface WatchlistService {
    List<Watchlist> getWatchlist(String userEmail);
    Watchlist addToWatchlist(String userEmail, String ticker);
    void removeFromWatchlist(String userEmail, String ticker);
}