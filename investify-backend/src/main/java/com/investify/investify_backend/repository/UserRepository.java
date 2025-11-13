package com.investify.investify_backend.repository;

import com.investify.investify_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // --- THIS IS THE FIX ---
    // This tells Hibernate: "Even though 'roles' is LAZY,
    // for this specific method, fetch it at the same time."
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = ?1")
    Optional<User> findByEmail(String email);
    // --- END OF FIX ---
}