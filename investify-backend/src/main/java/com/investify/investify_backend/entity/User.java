package com.investify.investify_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    @Column(nullable = false)
    private String name;

    @Email
    @NotEmpty
    @Column(unique = true, nullable = false)
    private String email;

    @NotEmpty
    @Column(nullable = false)
    private String password;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    @Builder.Default
    private Set<String> roles = Set.of("ROLE_INVESTOR");

    @Builder.Default
    @Column(nullable = false)
    private Double walletBalance = 0.0;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Converts our Set<String> of roles into Spring's required format
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        // We will use the email as the username for login
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // You could add logic for this later
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // You could add logic for this later
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // You could add logic for this later
    }

    @Override
    public boolean isEnabled() {
        return true; // You could add a 'is_enabled' column for email verification
    }
}
