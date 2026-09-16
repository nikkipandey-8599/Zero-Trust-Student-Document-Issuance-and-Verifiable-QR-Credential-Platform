package com.ztplatform.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                // Public endpoints
                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login",
                    "/api/verify/**",
                    "/api/credentials/*/qr",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()

                // Student profile endpoint - accessible by STUDENT and ADMIN
                .requestMatchers("/api/students/me")
                .hasAnyRole("STUDENT", "ADMIN")

                // Admin endpoints
                .requestMatchers("/api/students")
                .hasRole("ADMIN")

                .requestMatchers("/api/students/**")
                .hasRole("ADMIN")

                // Request approval/rejection requires ADMIN
                .requestMatchers("/api/requests/*/approve", "/api/requests/*/reject")
                .hasRole("ADMIN")

                // Document endpoints require ADMIN
                .requestMatchers("/api/documents")
                .hasRole("ADMIN")

                .requestMatchers("/api/documents/**")
                .hasRole("ADMIN")

                // Everything else requires authentication
                .anyRequest()
                .authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}