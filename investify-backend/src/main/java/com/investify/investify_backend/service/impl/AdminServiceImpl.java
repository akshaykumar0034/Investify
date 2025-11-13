package com.investify.investify_backend.service.impl;

import com.investify.investify_backend.entity.User;
import com.investify.investify_backend.repository.UserRepository;
import com.investify.investify_backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        // Find all users and return them
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public User promoteUserToAdmin(Long userId) {
        // Find the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Add the "ROLE_ADMIN" to their set of roles
        Set<String> roles = user.getRoles();
        roles.add("ROLE_ADMIN");
        user.setRoles(roles);

        // Save the updated user
        return userRepository.save(user);
    }
}