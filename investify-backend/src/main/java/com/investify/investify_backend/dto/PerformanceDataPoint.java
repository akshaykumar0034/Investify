package com.investify.investify_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class PerformanceDataPoint {
    private LocalDate date;
    private double value;
}