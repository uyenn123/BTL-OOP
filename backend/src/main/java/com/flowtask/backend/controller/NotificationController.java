package com.flowtask.backend.controller;

import com.flowtask.backend.dto.Response.NotificationView;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationView> all(
            @AuthenticationPrincipal User user) {
        return notificationService.getAll(user);
    }

    @PatchMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void read(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        notificationService.read(id, user);
    }

    @GetMapping("/unread-count")
    public long unreadCount(@AuthenticationPrincipal User user) {
        return notificationService.getUnreadCount(user);
    }

    @PatchMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void readAll(@AuthenticationPrincipal User user) {
        notificationService.readAll(user);
    }

    @GetMapping("/project/{projectId}")
    public List<NotificationView> byProject(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user) {
        return notificationService.getByProject(user, projectId);
    }

    @GetMapping("/project/{projectId}/unread-count")
    public long projectUnreadCount(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user) {
        return notificationService.getProjectUnreadCount(user, projectId);
    }
}
