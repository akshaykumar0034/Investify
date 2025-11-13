package com.investify.investify_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

// This DTO is for the *main* search response
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FinnhubSearch {
    private Integer count;
    private List<SearchResult> result;
}

// This DTO is for one item in the search result list
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
class SearchResult {
    private String description;
    private String displaySymbol;
    private String symbol;
    private String type;
}