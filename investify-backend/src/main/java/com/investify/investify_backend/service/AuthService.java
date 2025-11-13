package com.investify.investify_backend.service;

import com.investify.investify_backend.dto.auth.JwtAuthResponse;
import com.investify.investify_backend.dto.auth.LoginRequest;
import com.investify.investify_backend.dto.auth.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest registerRequest);

    // Add this new method
    JwtAuthResponse login(LoginRequest loginRequest);
}