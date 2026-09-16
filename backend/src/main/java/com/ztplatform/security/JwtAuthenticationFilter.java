package com.ztplatform.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthenticationFilter(
            JwtUtil jwtUtil,
            UserDetailsServiceImpl userDetailsService) {

        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {

                // Extract email from JWT
                String email = jwtUtil.extractEmail(token);

                System.out.println("=================================");
                System.out.println("JWT EMAIL: " + email);

                // Check if user is not already authenticated
                if (email != null &&
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication() == null) {

                    // Load user from database
                    UserDetails userDetails =
                            userDetailsService
                                    .loadUserByUsername(email);

                    System.out.println(
                            "USER AUTHORITIES: "
                                    + userDetails.getAuthorities()
                    );

                    // Validate JWT
                    if (jwtUtil.isTokenValid(token)) {

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        // Set authenticated user
                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);

                        System.out.println(
                                "JWT AUTHENTICATION SET: "
                                        + SecurityContextHolder
                                        .getContext()
                                        .getAuthentication()
                        );
                    }
                }

                System.out.println("=================================");

            } catch (Exception e) {

                System.out.println(
                        "JWT Authentication failed: "
                                + e.getMessage()
                );
            }
        }

        filterChain.doFilter(request, response);
    }
}