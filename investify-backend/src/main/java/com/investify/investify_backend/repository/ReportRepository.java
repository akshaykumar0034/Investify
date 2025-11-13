package com.investify.investify_backend.repository;

import com.investify.investify_backend.entity.Report;
import com.investify.investify_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // Find all reports for a user, ordered by most recent first
    List<Report> findByUserOrderByGeneratedAtDesc(User user);
}