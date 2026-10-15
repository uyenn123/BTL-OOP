package com.flowtask.backend.repository;

import com.flowtask.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findTop20ByRecipientIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByRecipientIdAndReadFalse(Long userId);

    long countByRecipientIdAndReadFalse(Long userId);

    List<Notification> findTop20ByRecipientIdAndProjectIdOrderByCreatedAtDesc(
            Long userId, Long projectId);

    long countByRecipientIdAndProjectIdAndReadFalse(
            Long userId, Long projectId);
}