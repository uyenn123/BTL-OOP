package com.flowtask.backend.service;

import com.flowtask.backend.dto.Request.UpdateProfile;
import com.flowtask.backend.dto.Response.UserView;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository users;

    @Transactional(readOnly = true)
    public UserView getMe(User user) {
        checkUser(user);
        return UserView.from(user);
    }

    @Transactional
    public UserView update(User user, UpdateProfile request) {
        checkUser(user);

        String email = request.email().trim().toLowerCase();

        if (users.existsByEmailIgnoreCase(email)
                && !user.getEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(email);
        user.setJobTitle(request.jobTitle());
        user.setOrganization(request.organization());
        user.setBio(request.bio());

        return UserView.from(users.save(user));
    }

    private void checkUser(User user) {
        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User not authenticated"
            );
        }
    }
}