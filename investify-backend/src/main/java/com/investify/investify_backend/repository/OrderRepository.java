package com.investify.investify_backend.repository;

import com.investify.investify_backend.entity.Order;
import com.investify.investify_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find all orders for a user, sorted by date
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    // Find all orders that are waiting to be executed
    List<Order> findByStatus(String status);
}