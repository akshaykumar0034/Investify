package com.investify.investify_backend.service.impl;

import com.investify.investify_backend.entity.User;
import com.investify.investify_backend.repository.UserRepository;
import com.investify.investify_backend.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public double getWalletBalance(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return user.getWalletBalance();
    }

    @Override
    @Transactional
    public User addFunds(String userEmail, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        user.setWalletBalance(user.getWalletBalance() + amount);
        return userRepository.save(user);
    }
}