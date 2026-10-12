
package com.flowtask.backend.dto.Response;

public record ProjectMemberView(
        Long id,
        String name,
        String email,
        String initials
) {}
