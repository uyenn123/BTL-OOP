package com.flowtask.backend.controller;

import com.flowtask.backend.dto.Request.LoginRequest;
import com.flowtask.backend.dto.Request.RegisterRequest;
import com.flowtask.backend.dto.Response.AuthResponse;
import com.flowtask.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }
}