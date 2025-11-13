package com.investify.investify_backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransactionRequest {
    @NotEmpty
    private String ticker;

    private String type;

    @NotNull
    @Positive
    private Double quantity;

    @NotNull
    @Positive
    private Double price;

    @NotNull
    private LocalDateTime date;

    @NotEmpty
    private String orderType;
}