package com.investify.investify_backend.service;

import com.investify.investify_backend.entity.User;
import java.util.List;

public interface AdminService {
    List<User> getAllUsers();
    User promoteUserToAdmin(Long userId);
}