package com.verifyid.dto;

public record RegisterRequest(
        String fullName,
        String email,
        String password
) {
}