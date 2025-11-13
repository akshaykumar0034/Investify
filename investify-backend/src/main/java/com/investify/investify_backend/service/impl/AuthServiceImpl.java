package com.investify.investify_backend.service.impl;

import com.investify.investify_backend.dto.auth.JwtAuthResponse;
import com.investify.investify_backend.dto.auth.LoginRequest;
import com.investify.investify_backend.dto.auth.RegisterRequest;
import com.investify.investify_backend.entity.User;
import com.investify.investify_backend.repository.UserRepository;
import com.investify.investify_backend.security.JwtTokenProvider;
import com.investify.investify_backend.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.investify.investify_backend.entity.Portfolio;
import com.investify.investify_backend.repository.PortfolioRepository;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    // --- FIELDS ---
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PortfolioRepository portfolioRepository;

    // --- CONSTRUCTOR ---
    // This is the single, 5-argument constructor you need
    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider jwtTokenProvider,
                           PortfolioRepository portfolioRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.portfolioRepository = portfolioRepository;
    }

    // --- METHODS ---

    @Override
    public void register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already registered");
        }

        // Create and save the user
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRoles(Set.of("ROLE_INVESTOR"));
        user.setWalletBalance(10000.00);
        User savedUser = userRepository.save(user);

        // --- CREATE THE PORTFOLIO ---
        Portfolio newPortfolio = new Portfolio();
        newPortfolio.setUser(savedUser);
        newPortfolio.setName(savedUser.getName() + "'s Portfolio");
        newPortfolio.setTotalInvested(0);
        portfolioRepository.save(newPortfolio);
    }

    @Override
    public JwtAuthResponse login(LoginRequest loginRequest) {
        // 1. Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // 2. Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Generate the token
        String token = jwtTokenProvider.generateToken(authentication);

        return new JwtAuthResponse(token, "Bearer");
    }
}