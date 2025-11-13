package com.investify.investify_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FmpMoverDto {
    private String symbol;
    private String name;
    private Double change;
    private Double price;
    private Double changesPercentage;
}