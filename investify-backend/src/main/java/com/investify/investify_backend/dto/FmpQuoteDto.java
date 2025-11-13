package com.investify.investify_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FmpQuoteDto {
    private String symbol;
    private String name;
    private double price; // This is the 'current price'
    private double change;
    private double changesPercentage;
}