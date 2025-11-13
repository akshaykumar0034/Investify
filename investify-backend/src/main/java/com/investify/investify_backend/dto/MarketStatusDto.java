package com.investify.investify_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MarketStatusDto {
    private String exchange;
    private String holiday;
    private Boolean isOpen;
    private String session;
    private String t; // Timestamp
}