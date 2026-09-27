package com.verifyid.dto;

public record LoginRequest(
        String email,
        String password
) {
}
