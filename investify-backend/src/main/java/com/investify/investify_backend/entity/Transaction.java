package com.investify.investify_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference; // <-- ADD THIS IMPORT
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- THIS IS THE FIX ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference // <-- ADD THIS ANNOTATION
    private Portfolio portfolio;
    // --- END OF FIX ---

    private String ticker;
    private String type;
    private double quantity;
    private double price;
    private LocalDateTime date;
}