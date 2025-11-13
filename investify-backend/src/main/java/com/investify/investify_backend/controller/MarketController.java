package com.investify.investify_backend.controller;

import com.investify.investify_backend.dto.*;
import com.investify.investify_backend.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketController {

    private final MarketService marketService;

    // --- THIS IS THE CORRECT getQuote ENDPOINT ---
    @GetMapping("/quote/{symbol}")
    public ResponseEntity<QuoteDto> getQuote(@PathVariable String symbol) {
        try {
            // This now correctly returns QuoteDto from Finnhub
            QuoteDto quote = marketService.getQuote(symbol.toUpperCase());
            return ResponseEntity.ok(quote);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // --- (All other working endpoints) ---
    @GetMapping("/search/{query}")
    public ResponseEntity<FinnhubSearch> search(@PathVariable String query) {
        try {
            FinnhubSearch results = marketService.searchSymbols(query);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/news/{symbol}")
    public ResponseEntity<List<FinnhubNews>> getNews(@PathVariable String symbol) {
        try {
            List<FinnhubNews> news = marketService.getCompanyNews(symbol.toUpperCase());
            return ResponseEntity.ok(news);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/candles/{symbol}")
    public ResponseEntity<StockCandleDto> getCandles(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "D") String resolution,
            @RequestParam(required = false) Long from,
            @RequestParam(required = false) Long to
    ) {
        try {
            long now = Instant.now().getEpochSecond();
            long fromTime = (from != null) ? from : Instant.now().minusSeconds(365 * 24 * 60 * 60).getEpochSecond();
            long toTime = (to != null) ? to : now;

            StockCandleDto candles = marketService.getStockCandles(symbol.toUpperCase(), resolution, fromTime, toTime);
            return ResponseEntity.ok(candles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/status")
    public ResponseEntity<MarketStatusDto> getMarketStatus() {
        try {
            // We default to the US market, but you could change "US" to "IND"
            return ResponseEntity.ok(marketService.getMarketStatus("US"));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/indices")
    public ResponseEntity<List<FmpMoverDto>> getMarketIndices() {
        try {
            return ResponseEntity.ok(marketService.getMarketIndices());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

}