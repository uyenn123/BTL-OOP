package com.flowtask.backend.dto.Request;

import jakarta.validation.constraints.Email;

public record UpdateProfile(
        String firstName,
        String lastName,
        @Email String email,
        String jobTitle,
        String organization,
        String bio
) {}