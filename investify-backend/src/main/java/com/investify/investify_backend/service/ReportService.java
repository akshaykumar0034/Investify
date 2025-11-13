package com.investify.investify_backend.service;

import java.io.ByteArrayInputStream;

public interface ReportService {
    // This will return the raw bytes of the PDF file
    ByteArrayInputStream generatePortfolioReport(String userEmail);

    void generateWeeklyReportForUser(Long userId);
}