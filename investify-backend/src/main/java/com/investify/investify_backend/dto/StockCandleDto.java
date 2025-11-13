package com.investify.investify_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class StockCandleDto {

    @JsonProperty("c")
    private List<Double> close; // List of closing prices

    @JsonProperty("h")
    private List<Double> high; // List of high prices

    @JsonProperty("l")
    private List<Double> low; // List of low prices

    @JsonProperty("o")
    private List<Double> open; // List of open prices

    @JsonProperty("t")
    private List<Long> timestamp; // List of UNIX timestamps

    @JsonProperty("s")
    private String status; // "ok" or "no_data"
}