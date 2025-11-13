package com.investify.investify_backend.service.impl;

import com.investify.investify_backend.entity.Holding;
import com.investify.investify_backend.entity.Portfolio;
import com.investify.investify_backend.entity.User; // <-- 1. ADD IMPORT
import com.investify.investify_backend.repository.PortfolioRepository;
import com.investify.investify_backend.repository.UserRepository; // <-- 2. ADD IMPORT
import com.investify.investify_backend.service.ReportService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger; // <-- 3. ADD IMPORT
import org.slf4j.LoggerFactory; // <-- 4. ADD IMPORT
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository; // <-- 5. ADD REPOSITORY

    // --- ADD A LOGGER ---
    private static final Logger logger = LoggerFactory.getLogger(ReportServiceImpl.class);

    // Define some fonts for our report
    private static final Font TITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
    private static final Font SUBTITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA, 14);
    private static final Font TABLE_HEADER_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
    private static final Font BODY_FONT = FontFactory.getFont(FontFactory.HELVETICA, 10);

    @Override
    @Transactional(readOnly = true)
    public ByteArrayInputStream generatePortfolioReport(String userEmail) {
        // 1. Fetch the data
        Portfolio portfolio = portfolioRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("Portfolio not found"));
        portfolio.getHoldings().size(); // Eagerly load holdings

        // 2. Create an in-memory output stream
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            // 3. Create the PDF document
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // --- Title ---
            Paragraph title = new Paragraph("Investify Portfolio Report", TITLE_FONT);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // --- Subtitle (User and Date) ---
            String date = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
            Paragraph subtitle = new Paragraph("Report for " + portfolio.getName() + " | Generated on " + date, SUBTITLE_FONT);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // --- Summary Section ---
            Paragraph summaryTitle = new Paragraph("Portfolio Summary", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
            summaryTitle.setSpacingAfter(10);
            document.add(summaryTitle);

            document.add(new Paragraph(String.format("Total Invested: $%.2f", portfolio.getTotalInvested()), BODY_FONT));
            document.add(new Paragraph(String.format("Total Holdings: %d", portfolio.getHoldings().size()), BODY_FONT));
            document.add(Chunk.NEWLINE);

            // --- Holdings Table ---
            Paragraph tableTitle = new Paragraph("Holdings Details", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
            tableTitle.setSpacingAfter(10);
            document.add(tableTitle);

            PdfPTable table = new PdfPTable(4); // 4 columns
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3f, 3f, 3f, 3f});

            // --- Add Table Headers ---
            Stream.of("Ticker Symbol", "Quantity", "Average Buy Price", "Total Cost")
                    .forEach(headerTitle -> {
                        PdfPCell header = new PdfPCell();
                        header.setPhrase(new Phrase(headerTitle, TABLE_HEADER_FONT));
                        header.setHorizontalAlignment(Element.ALIGN_CENTER);
                        header.setPadding(5);
                        table.addCell(header);
                    });

            // --- Add Table Rows ---
            for (Holding holding : portfolio.getHoldings()) {
                table.addCell(new Phrase(holding.getTicker(), BODY_FONT));
                table.addCell(new Phrase(String.format("%.4f", holding.getQuantity()), BODY_FONT));
                table.addCell(new Phrase(String.format("$%.2f", holding.getAvgBuyPrice()), BODY_FONT));
                table.addCell(new Phrase(String.format("$%.2f", holding.getAvgBuyPrice() * holding.getQuantity()), BODY_FONT));
            }
            document.add(table);

            // 4. Close the document
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace(); // Handle error
        }

        // 5. Return the byte stream
        return new ByteArrayInputStream(out.toByteArray());
    }

    // --- 6. ADD THE NEW METHOD FOR THE SCHEDULER ---
    @Override
    @Transactional(readOnly = true)
    public void generateWeeklyReportForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found for report generation"));

        logger.info("--- 🤖 SCHEDULER JOB RUNNING ---");
        logger.info("Generating weekly report for: {}", user.getEmail());

        // 1. Fetch portfolio data
        Portfolio portfolio = portfolioRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Portfolio not found"));

        // 2. In a real app, you would generate the PDF and email it or save it.
        //    For now, we just log that the job was successful.

        logger.info("Successfully generated weekly report for user: {}", user.getEmail());
        logger.info("--- 🤖 SCHEDULER JOB FINISHED ---");
    }
}