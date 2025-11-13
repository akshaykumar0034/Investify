package com.investify.investify_backend.service.impl;

import com.investify.investify_backend.dto.*;
import com.investify.investify_backend.service.MarketService;
import com.investify.investify_backend.dto.MarketStatusDto;
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

    @Value("${finnhub.api.key}")
    private String apiKey; // Finnhub key

    @Value("${finnhub.api.baseurl}")
    private String baseUrl; // Finnhub URL

    @Value("${fmp.api.key}")
    private String fmpApiKey;
    @Value("${fmp.api.baseurl}")
    private String fmpBaseUrl;

    @Value("${alphavantage.api.key}")
    private String alphaVantageApiKey; // Alpha Vantage Key
    @Value("${alphavantage.api.baseurl}")
    private String alphaVantageBaseUrl; // Alpha Vantage URL

    @Override
    @Cacheable("quotes-v3")
    public QuoteDto getQuote(String symbol) {
        String url = String.format("%s/quote?symbol=%s&token=%s", baseUrl, symbol, apiKey);
        logger.info("Calling Finnhub API: {}", url);
        try {
            QuoteDto quote = restTemplate.getForObject(url, QuoteDto.class);
            logger.info("Finnhub response for {}: {}", symbol, quote);
            return quote;
        } catch (Exception e) {
            logger.error("Error calling Finnhub for symbol: {}", symbol, e);
            throw e;
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
            logger.error("Error calling Finnhub news: {}", symbol, e);
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

    // --- THIS IS THE FIX ---
    @Cacheable("av-movers") // Only one '@'
    public AlphaVantageMoversResponse getAlphaVantageMovers() {
        // --- END OF FIX ---
        String url = String.format("%s/query?function=TOP_GAINERS_LOSERS&apikey=%s",
                alphaVantageBaseUrl, alphaVantageApiKey);
        logger.info("Calling Alpha Vantage API for movers: {}", url);
        try {
            return restTemplate.getForObject(url, AlphaVantageMoversResponse.class);
        } catch (Exception e) {
            logger.error("Error calling Alpha Vantage movers", e);
            return new AlphaVantageMoversResponse(); // Return empty object on error
        }
    }

    @Override
    public List<AlphaVantageMoverDto> getTopGainers() {
        AlphaVantageMoversResponse response = getAlphaVantageMovers();
        return (response != null && response.getTopGainers() != null) ?
                response.getTopGainers() : Collections.emptyList();
    }

    @Override
    public List<AlphaVantageMoverDto> getTopLosers() {
        AlphaVantageMoversResponse response = getAlphaVantageMovers();
        return (response != null && response.getTopLosers() != null) ?
                response.getTopLosers() : Collections.emptyList();
    }

    @Override
    @Cacheable("market-status")
    public MarketStatusDto getMarketStatus(String exchange) {
        // We use Finnhub's 'market-status' endpoint. 'US' for US Market.
        String url = String.format("%s/stock/market-status?exchange=%s&token=%s",
                baseUrl, exchange, apiKey);
        logger.info("Calling Finnhub API for market status: {}", url);
        try {
            return restTemplate.getForObject(url, MarketStatusDto.class);
        } catch (Exception e) {
            logger.error("Error calling Finnhub market status", e);
            // Return a default "closed" status on error
            MarketStatusDto errorStatus = new MarketStatusDto();
            errorStatus.setIsOpen(false);
            errorStatus.setExchange(exchange);
            return errorStatus;
        }
    }
}