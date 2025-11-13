package com.investify.investify_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AlphaVantageMoverDto {
    private String ticker;
    private String price;

    @JsonProperty("change_amount")
    private String changeAmount;

    @JsonProperty("change_percentage")
    private String changePercentage;

    private String volume;

    // Helper method to get a clean percentage number
    public double getChangePercentageAsDouble() {
        try {
            // "0.91%" -> 0.91
            return Double.parseDouble(this.changePercentage.replace("%", ""));
        } catch (Exception e) {
            return 0.0;
        }
    }
}