package com.investify.investify_backend.service;

import com.investify.investify_backend.dto.TransactionRequest;
import com.investify.investify_backend.entity.Order;
import java.util.List;

public interface OrderService {
    // Places a new Market or Limit order
    void placeOrder(String userEmail, TransactionRequest orderRequest);

    // Gets all orders for the user
    List<Order> getOrderHistory(String userEmail);

    void processPendingOrders();
}