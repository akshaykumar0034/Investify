package com.investify.investify_backend.controller;

import com.investify.investify_backend.entity.User;
import com.investify.investify_backend.service.WalletService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/balance")
    public ResponseEntity<Map<String, Double>> getBalance(Principal principal) {
        double balance = walletService.getWalletBalance(principal.getName());
        return ResponseEntity.ok(Map.of("balance", balance));
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Double>> addFunds(@RequestBody AddFundsRequest request, Principal principal) {
        try {
            User updatedUser = walletService.addFunds(principal.getName(), request.getAmount());
            return ResponseEntity.ok(Map.of("newBalance", updatedUser.getWalletBalance()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Data
    static class AddFundsRequest {
        private double amount;
    }
}