package com.app.security;

import com.app.model.User;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        java.util.Set<org.springframework.security.core.GrantedAuthority> authorities = new java.util.HashSet<>();
        if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
            String roleRaw = user.getRole().trim();
            String roleUpper = roleRaw.toUpperCase();
            authorities.add(new SimpleGrantedAuthority(roleRaw));
            authorities.add(new SimpleGrantedAuthority(roleUpper));
            if (roleUpper.startsWith("ROLE_")) {
                authorities.add(new SimpleGrantedAuthority(roleUpper.substring(5)));
            } else {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + roleUpper));
            }
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities);
    }
}
