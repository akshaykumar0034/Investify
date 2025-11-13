package com.investify.investify_backend.scheduler;

import com.investify.investify_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderExecutionJob implements Job {

    private static final Logger logger = LoggerFactory.getLogger(OrderExecutionJob.class);
    private final OrderService orderService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            orderService.processPendingOrders();
        } catch (Exception e) {
            logger.error("Error executing order processing job", e);
        }
    }
}