package com.investify.investify_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference // Breaks the JSON infinite loop
    private User user;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    private String title;

    @Column(length = 2000) // Set a large-ish size for the report content
    private String content;
}