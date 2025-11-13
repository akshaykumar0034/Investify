package com.investify.investify_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AlphaVantageMoversResponse {

    @JsonProperty("top_gainers")
    private List<AlphaVantageMoverDto> topGainers;

    @JsonProperty("top_losers")
    private List<AlphaVantageMoverDto> topLosers;

    @JsonProperty("most_actively_traded")
    private List<AlphaVantageMoverDto> mostActive;
}