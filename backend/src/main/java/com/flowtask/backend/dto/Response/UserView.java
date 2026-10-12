package com.flowtask.backend.dto.Response;

import com.flowtask.backend.entity.User;

public record UserView(
        Long id,
        String email,
        String firstName,
        String lastName,
        String fullName,
        String initials,
        String jobTitle,
        String organization,
        String bio,
        String avatarUrl
) {
    public static UserView from(User user) {
        return new UserView(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.fullName(),
                user.initials(),
                user.getJobTitle(),
                user.getOrganization(),
                user.getBio(),
                user.getAvatarUrl()
        );
    }
}
