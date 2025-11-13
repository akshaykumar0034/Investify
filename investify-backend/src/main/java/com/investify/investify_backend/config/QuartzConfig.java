package com.investify.investify_backend.config;

import com.investify.investify_backend.scheduler.ReportSchedulerJob;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.investify.investify_backend.scheduler.OrderExecutionJob;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail weeklyReportJobDetail() { // Changed name for clarity
        return JobBuilder.newJob(ReportSchedulerJob.class)
                .withIdentity("weeklyReportJob") // Changed identity
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger weeklyReportJobTrigger(JobDetail weeklyReportJobDetail) { // Changed name and parameter

        // --- FOR TESTING: Run every 5 minutes ---
        // This cron schedule is easier to read: "at 0 seconds, every 5 minutes"
        String cronSchedule = "0 0/5 * * * ?";

        // --- FOR PRODUCTION: Run every Sunday at 3 AM ---
        // String cronSchedule = "0 0 3 ? * SUN";

        return TriggerBuilder.newTrigger()
                .forJob(weeklyReportJobDetail) // Use the injected JobDetail
                .withIdentity("weeklyReportTrigger") // Changed identity
                .withSchedule(CronScheduleBuilder.cronSchedule(cronSchedule)) // Use cron
                .build();
    }

    @Bean
    public JobDetail orderExecutionJobDetail() {
        return JobBuilder.newJob(OrderExecutionJob.class)
                .withIdentity("orderExecutionJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger orderExecutionJobTrigger(JobDetail orderExecutionJobDetail) {
        // For testing, run every 1 minute
        String cronSchedule = "0 0/1 * * * ?";

        return TriggerBuilder.newTrigger()
                .forJob(orderExecutionJobDetail)
                .withIdentity("orderExecutionTrigger")
                .withSchedule(CronScheduleBuilder.cronSchedule(cronSchedule))
                .build();
    }
}