package com.investify.investify_backend.service;

import com.investify.investify_backend.dto.*;
import java.util.List;

public interface MarketService {

    QuoteDto getQuote(String symbol);
    FinnhubSearch searchSymbols(String query);
    List<FinnhubNews> getCompanyNews(String symbol);
    StockCandleDto getStockCandles(String symbol, String resolution, long from, long to);
    List<FmpMoverDto> getMarketIndices();
    MarketStatusDto getMarketStatus(String exchange);
}