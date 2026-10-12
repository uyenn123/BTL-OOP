package com.flowtask.backend.dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
public record RegisterRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @Pattern(
                regexp = "^(?=.*\\d)(?=.*[^a-zA-Z0-9\\s])\\S+$",
                message = "Password must contain at least 8 characters, a number and a special character"
        )
        @NotBlank @Size(min = 8) String password
) {}