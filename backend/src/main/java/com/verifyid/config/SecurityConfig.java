package com.verifyid.config;

import com.verifyid.security.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${cors.allowed-origin:http://localhost:5173}")
    private String allowedOrigin;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors ->
                cors.configurationSource(
                    corsConfigurationSource()
                )
            )

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // ===============================
                // Public endpoints
                // ===============================

                .requestMatchers(
                    "/api/health",
                    "/api/auth/**",
                    "/api/verify/**",
                    "/api/qr/**",
                    "/api/documents/types",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()

                // ===============================
                // Credential revocation
                // ===============================

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/credentials/*/revoke"
                ).hasAnyAuthority(
                    "ROLE_STAFF",
                    "ROLE_ADMIN"
                )

                // ===============================
                // Staff / Admin operations
                // ===============================

                .requestMatchers(
                    "/api/staff/**"
                ).hasAnyAuthority(
                    "ROLE_STAFF",
                    "ROLE_ADMIN"
                )

                // ===============================
                // Admin-only operations
                // ===============================

                .requestMatchers(
                    "/api/admin/**"
                ).hasAuthority(
                    "ROLE_ADMIN"
                )

                // ===============================
                // Student-only operations
                // ===============================

                .requestMatchers(
                    "/api/student/**",
                    "/api/requests/student/**"
                ).hasAuthority(
                    "ROLE_STUDENT"
                )

                // ===============================
                // Staff/Admin pending requests
                // ===============================

                .requestMatchers(
                    "/api/requests/pending"
                ).hasAnyAuthority(
                    "ROLE_STAFF",
                    "ROLE_ADMIN"
                )

                // ===============================
                // Everything else
                // ===============================

                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(allowedOrigin)
        );

        configuration.setAllowedMethods(
                List.of(
                    "GET",
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE",
                    "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}