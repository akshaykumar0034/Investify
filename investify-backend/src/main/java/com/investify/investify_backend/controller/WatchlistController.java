package com.investify.investify_backend.controller;

import com.investify.investify_backend.entity.Watchlist;
import com.investify.investify_backend.service.WatchlistService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<List<Watchlist>> getWatchlist(Principal principal) {
        List<Watchlist> watchlist = watchlistService.getWatchlist(principal.getName());
        return ResponseEntity.ok(watchlist);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToWatchlist(@RequestBody TickerRequest request, Principal principal) {
        try {
            Watchlist newItem = watchlistService.addToWatchlist(principal.getName(), request.getTicker());
            return ResponseEntity.ok(newItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/remove/{ticker}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable String ticker, Principal principal) {
        try {
            watchlistService.removeFromWatchlist(principal.getName(), ticker);
            return ResponseEntity.ok("Ticker removed from watchlist");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // A simple DTO for the request body
    @Data
    static class TickerRequest {
        private String ticker;
    }
}
