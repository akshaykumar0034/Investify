package com.investify.investify_backend.service.impl;

import com.investify.investify_backend.dto.*;
import com.investify.investify_backend.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketServiceImpl implements MarketService {

    private static final Logger logger = LoggerFactory.getLogger(MarketServiceImpl.class);
    private final RestTemplate restTemplate;

    // Finnhub
    @Value("${finnhub.api.key}")
    private String apiKey;
    @Value("${finnhub.api.baseurl}")
    private String baseUrl;

    // Financial Modeling Prep
    @Value("${fmp.api.key}")
    private String fmpApiKey;
    @Value("${fmp.api.baseurl}")
    private String fmpBaseUrl;

    // Alpha Vantage (unused, but fine to keep)
    @Value("${alphavantage.api.key}")
    private String alphaVantageApiKey;
    @Value("${alphavantage.api.baseurl}")
    private String alphaVantageBaseUrl;

    // --- THIS IS THE CORRECT, FIXED getQuote METHOD ---
    @Override
    @Cacheable("quotes-v3")
    public QuoteDto getQuote(String symbol) {
        // This now matches the interface and uses Finnhub
        String url = String.format("%s/quote?symbol=%s&token=%s", baseUrl, symbol, apiKey);
        logger.info("Calling Finnhub API: {}", url);
        try {
            QuoteDto quote = restTemplate.getForObject(url, QuoteDto.class);
            logger.info("Finnhub response for {}: {}", symbol, quote);
            return quote;
        } catch (Exception e) {
            logger.error("Error calling Finnhub for symbol: {}", symbol, e);
            throw new RuntimeException("Could not fetch quote", e); // Throw exception
        }
    }

    @Override
    @Cacheable("search")
    public FinnhubSearch searchSymbols(String query) {
        String url = String.format("%s/search?q=%s&token=%s", baseUrl, query, apiKey);
        logger.info("Calling Finnhub API: {}", url);
        try {
            return restTemplate.getForObject(url, FinnhubSearch.class);
        } catch (Exception e) {
            logger.error("Error calling Finnhub search: {}", query, e);
            throw e;
        }
    }

    @Override
    @Cacheable("news")
    public List<FinnhubNews> getCompanyNews(String symbol) {
        String today = java.time.LocalDate.now().toString();
        String oneWeekAgo = java.time.LocalDate.now().minusDays(7).toString();

        String url = String.format("%s/company-news?symbol=%s&from=%s&to=%s&token=%s",
                baseUrl, symbol, oneWeekAgo, today, apiKey);
        logger.info("Calling Finnhub API: {}", url);
        try {
            FinnhubNews[] newsArray = restTemplate.getForObject(url, FinnhubNews[].class);
            return (newsArray != null) ? Arrays.asList(newsArray) : Collections.emptyList();
        } catch (Exception e) {
            logger.error("Error calling Finnhub news: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    @Cacheable(value = "candles", unless = "#result == null || #result.status != 'ok'")
    public StockCandleDto getStockCandles(String symbol, String resolution, long from, long to) {
        String url = String.format("%s/stock/candle?symbol=%s&resolution=%s&from=%d&to=%d&token=%s",
                baseUrl, symbol, resolution, from, to, apiKey);

        logger.info("Calling Finnhub API for candles: {}", url);
        try {
            StockCandleDto response = restTemplate.getForObject(url, StockCandleDto.class);

            if (response == null || !"ok".equals(response.getStatus())) {
                logger.warn("Finnhub returned no candle data for {}: {}", symbol, response != null ? response.getStatus() : "null");
                StockCandleDto noDataDto = new StockCandleDto();
                noDataDto.setStatus("no_data");
                return noDataDto;
            }
            return response;
        } catch (Exception e) {
            logger.error("Error calling Finnhub candles: {}", symbol, e);
            StockCandleDto errorDto = new StockCandleDto();
            errorDto.setStatus("error");
            return errorDto;
        }
    }

    @Override
    @Cacheable("market-status")
    public MarketStatusDto getMarketStatus(String exchange) {
        String url = String.format("%s/stock/market-status?exchange=%s&token=%s",
                baseUrl, exchange, apiKey);
        logger.info("Calling Finnhub API for market status: {}", url);
        try {
            return restTemplate.getForObject(url, MarketStatusDto.class);
        } catch (Exception e) {
            logger.error("Error calling Finnhub market status", e);
            MarketStatusDto errorStatus = new MarketStatusDto();
            errorStatus.setIsOpen(false);
            errorStatus.setExchange(exchange);
            return errorStatus;
        }
    }

    @Override
    @Cacheable("indices")
    public List<FmpMoverDto> getMarketIndices() {
        String url = String.format("%s/quote/%%5ENSEI,%%5EBSESN?apikey=%s", fmpBaseUrl, fmpApiKey);
        logger.info("Calling FMP API for market indices: {}", url);
        try {
            FmpMoverDto[] response = restTemplate.getForObject(url, FmpMoverDto[].class);
            return (response != null) ? Arrays.asList(response) : Collections.emptyList();
        } catch (Exception e) {
            logger.error("Error calling FMP indices", e);
            return Collections.emptyList();
        }
    }
}