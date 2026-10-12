package com.flowtask.backend.service;

import com.flowtask.backend.dto.Response.NotificationView;
import com.flowtask.backend.entity.Notification;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notifications;

    @Transactional(readOnly = true)
    public List<NotificationView> getAll(User user) {
        return notifications
                .findTop20ByRecipientIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toView)
                .toList();
    }

    @Transactional
    public void read(Long id, User user) {
        Notification notification = notifications.findById(id)
                .filter(n -> n.getRecipient().getId().equals(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Notification not found"
                ));

        notification.setRead(true);
    }

    private NotificationView toView(Notification notification) {
        return new NotificationView(
                notification.getId(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}