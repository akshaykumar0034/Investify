package com.investify.investify_backend.scheduler;

import com.investify.investify_backend.entity.User;
import com.investify.investify_backend.repository.UserRepository;
import com.investify.investify_backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReportSchedulerJob implements Job {

    private static final Logger logger = LoggerFactory.getLogger(ReportSchedulerJob.class);
    private final ReportService reportService;
    private final UserRepository userRepository;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        logger.info("--- 🚀 QUARTZ JOB 'WeeklyReportJob' STARTING ---"); // Changed log for clarity
        try {
            // Get all users in the system
            List<User> users = userRepository.findAll();

            if (users.isEmpty()) {
                logger.info("No users found. Skipping report generation.");
                return;
            }

            // Generate a report for each user
            for (User user : users) {
                logger.info("Generating report for user: {}", user.getEmail());

                // --- THIS IS THE FIX ---
                // Change the method name to match your service
                reportService.generateWeeklyReportForUser(user.getId());
                // --- END OF FIX ---
            }
            logger.info("--- 🏁 QUARTZ JOB 'WeeklyReportJob' FINISHED ---");
        } catch (Exception e) {
            logger.error("Error executing weekly report job", e);
            // Throwing the exception tells Quartz to retry if configured
            throw new JobExecutionException(e);
        }
    }
}