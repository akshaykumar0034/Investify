package com.investify.investify_backend.service;

import com.investify.investify_backend.entity.User;

public interface WalletService {
    double getWalletBalance(String userEmail);
    User addFunds(String userEmail, double amount);
}