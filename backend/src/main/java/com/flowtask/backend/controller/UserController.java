package com.flowtask.backend.controller;

import com.flowtask.backend.dto.Request.ChangePasswordRequest;
import com.flowtask.backend.dto.Request.UpdateProfile;
import com.flowtask.backend.dto.Response.UserView;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserView me(
            @AuthenticationPrincipal User user
    ) {
        return userService.getMe(user);
    }

    @PutMapping("/me")
    public UserView update(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfile request
    ) {
        return userService.update(user, request);
    }

    @PutMapping("/me/password")
    public void changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(user, request);
    }
}