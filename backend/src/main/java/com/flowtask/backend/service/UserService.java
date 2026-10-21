package com.flowtask.backend.service;

import com.flowtask.backend.dto.Request.ChangePasswordRequest;
import com.flowtask.backend.dto.Request.UpdateProfile;
import com.flowtask.backend.dto.Response.UserView;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserView getMe(User user) {
        checkUser(user);

        User currentUser = findUser(user);
        return UserView.from(currentUser);
    }

    @Transactional
    public UserView update(User user, UpdateProfile request) {
        checkUser(user);

        User currentUser = findUser(user);

        String email = request.email().trim().toLowerCase();

        if (users.existsByEmailIgnoreCase(email)
                && !currentUser.getEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        currentUser.setFirstName(request.firstName().trim());
        currentUser.setLastName(request.lastName().trim());
        currentUser.setEmail(email);

        return UserView.from(users.save(currentUser));
    }

    @Transactional
    public void changePassword(
            User user,
            ChangePasswordRequest request
    ) {
        checkUser(user);

        User currentUser = findUser(user);

        if (!passwordEncoder.matches(
                request.currentPassword(),
                currentUser.getPasswordHash()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current password is incorrect"
            );
        }

        if (passwordEncoder.matches(
                request.newPassword(),
                currentUser.getPasswordHash()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must be different"
            );
        }

        currentUser.setPasswordHash(
                passwordEncoder.encode(request.newPassword())
        );

        users.save(currentUser);
    }

    private User findUser(User user) {
        return users.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
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