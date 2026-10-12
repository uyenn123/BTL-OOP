package com.flowtask.backend.dto.Response;

public record AuthResponse(
        String token,
        UserView user
) {}