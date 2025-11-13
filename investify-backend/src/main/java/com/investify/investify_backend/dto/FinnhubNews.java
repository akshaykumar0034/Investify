package com.investify.investify_backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.time.Instant;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FinnhubNews {
    private String category;
    private Long datetime;
    private String headline;
    private Long id;
    private String image;
    private String related;
    private String source;
    private String summary;
    private String url;

    // Helper method to convert UNIX timestamp to Instant
    public Instant getDateTimeAsInstant() {
        return Instant.ofEpochSecond(this.datetime);
    }
}