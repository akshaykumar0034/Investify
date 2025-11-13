package com.investify.investify_backend.service;

import com.investify.investify_backend.dto.TransactionRequest;

public interface TransactionService {
    void addTransaction(String userEmail, TransactionRequest transactionRequest);
}
