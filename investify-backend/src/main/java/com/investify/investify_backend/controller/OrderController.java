package com.investify.investify_backend.controller;

import com.investify.investify_backend.dto.TransactionRequest;
import com.investify.investify_backend.entity.Order;
import com.investify.investify_backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@Valid @RequestBody TransactionRequest orderRequest, Principal principal) {
        try {
            orderService.placeOrder(principal.getName(), orderRequest);
            return ResponseEntity.ok("Order placed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<Order>> getHistory(Principal principal) {
        try {
            List<Order> history = orderService.getOrderHistory(principal.getName());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}