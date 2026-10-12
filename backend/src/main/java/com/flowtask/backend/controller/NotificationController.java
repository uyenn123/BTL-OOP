
package com.flowtask.backend.controller;

import com.flowtask.backend.dto.Response.NotificationView;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationView> all(
            @AuthenticationPrincipal User user
    ) {
        return notificationService.getAll(user);
    }

    @PatchMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void read(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        notificationService.read(id, user);
    }
}
