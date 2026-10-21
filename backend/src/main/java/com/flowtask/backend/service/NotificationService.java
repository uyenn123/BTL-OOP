package com.flowtask.backend.service;

import com.flowtask.backend.dto.Response.NotificationView;
import com.flowtask.backend.entity.Notification;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.repository.GroupMemberRepository;
import com.flowtask.backend.repository.NotificationRepository;
import com.flowtask.backend.repository.ProjectRepository;
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
    private final ProjectRepository projects;
    private final GroupMemberRepository groupMembers;

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
                notification.getCreatedAt(),
                notification.getProject() == null
                        ? null : notification.getProject().getId(),
                notification.getTaskId(),
                notification.getType()
        );
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notifications.countByRecipientIdAndReadFalse(user.getId());
    }

    @Transactional
    public void readAll(User user) {
        List<Notification> list =
                notifications.findByRecipientIdAndReadFalse(user.getId());

        list.forEach(n -> n.setRead(true));
    }

    @Transactional(readOnly = true)
    public List<NotificationView> getByProject(User user, Long projectId) {
        checkProjectAccess(user, projectId);

        return notifications
                .findTop20ByRecipientIdAndProjectIdOrderByCreatedAtDesc(
                        user.getId(), projectId)
                .stream()
                .map(this::toView)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getProjectUnreadCount(User user, Long projectId) {
        checkProjectAccess(user, projectId);

        return notifications.countByRecipientIdAndProjectIdAndReadFalse(
                user.getId(), projectId);
    }

    private void checkProjectAccess(User user, Long projectId) {
        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        var project = projects.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Project not found"
                ));

        boolean isWorkspaceOwner = project.getWorkspace()
                .getOwner().getId().equals(user.getId());

        boolean isGroupMember = project.getGroup() != null
                && groupMembers.existsByGroupIdAndUserIdAndRoleIgnoreCase(
                project.getGroup().getId(),
                user.getId(),
                "Member"
        );

        boolean isLeader = project.getGroup() != null
                && groupMembers.existsByGroupIdAndUserIdAndRoleIgnoreCase(
                project.getGroup().getId(),
                user.getId(),
                "Team Lead"
        );

        if (!isWorkspaceOwner && !isGroupMember && !isLeader) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Project not found"
            );
        }
    }
}