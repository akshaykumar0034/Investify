package com.investify.investify_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "portfolio_history")
@Data
@NoArgsConstructor
public class PortfolioValueHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id")
    @JsonBackReference
    private Portfolio portfolio;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private double totalInvestedValue;

    // We add this field now so we can add "Market Value" in the future
    @Column(nullable = false)
    private double marketValue;
}