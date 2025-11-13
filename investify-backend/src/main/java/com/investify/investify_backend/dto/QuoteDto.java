package com.investify.investify_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // Ignores fields we don't care about (like 'h', 'l', 'o')
public class QuoteDto {

    @JsonProperty("c") // Maps the JSON field "c" to our "currentPrice" field
    private Double currentPrice;

    // Finnhub also sends "d" (change) and "dp" (percent change)
    @JsonProperty("d")
    private Double change;

    @JsonProperty("dp")
    private Double percentChange;
}
