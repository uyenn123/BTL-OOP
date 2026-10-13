
package com.flowtask.backend.dto.Response;

public record MemberView(
        Long id,
        String name,
        String initials,
        String role,
        String email
) {}
