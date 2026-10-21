package com.flowtask.backend.service;

import com.flowtask.backend.dto.Request.ProjectRequest;
import com.flowtask.backend.dto.Response.ProjectView;
import com.flowtask.backend.entity.Project;
import com.flowtask.backend.entity.TaskStatus;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.repository.ProjectRepository;
import com.flowtask.backend.repository.TeamGroupRepository;
import com.flowtask.backend.repository.TaskRepository;
import com.flowtask.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.flowtask.backend.dto.Response.ProjectMemberView;
import com.flowtask.backend.repository.GroupMemberRepository;
import java.util.List;
import java.util.Objects;
import com.flowtask.backend.entity.Notification;
import com.flowtask.backend.entity.NotificationType;
import com.flowtask.backend.repository.NotificationRepository;
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projects;
    private final TeamGroupRepository groups;
    private final WorkspaceRepository workspaces;
    private final TaskRepository tasks;
    private final GroupMemberRepository groupMembers;
    private final NotificationRepository notifications;
    @Transactional(readOnly = true)
    public List<ProjectView> getAll(User user) {
        checkUser(user);

        List<Long> groupIds = groupMembers.findByUserId(user.getId())
                .stream()
                .map(member -> member.getGroup().getId())
                .distinct()
                .toList();

        return projects.findDistinctByGroupIdInOrderByCreatedAtDesc(groupIds)
                .stream()
                .map(this::view)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectView getOne(Long id, User user) {
        checkUser(user);
        return view(accessible(id, user));
    }



    @Transactional
    public ProjectView create(User user, ProjectRequest request) {
        checkUser(user);

        var group = groups.findById(request.groupId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Nhóm không hợp lệ"
                ));

        boolean isLeader =
                groupMembers.existsByGroupIdAndUserIdAndRoleIgnoreCase(
                        group.getId(),
                        user.getId(),
                        "Team Lead"
                );

        if (!isLeader) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Chỉ Leader mới được thêm dự án!"
            );
        }

        Project project = new Project();
        project.setGroup(group);
        project.setWorkspace(group.getWorkspace());
        project.setName(request.name());
        project.setDescription(request.description());
        project.setStatus(request.status());
        project.setPriority(request.priority());
        project.setDeadline(request.deadline());
        project.setColor(
                request.color() == null || request.color().isBlank()
                        ? "#6366F1"
                        : request.color()
        );

        Project savedProject = projects.save(project);

        var members = groupMembers.findByGroupId(group.getId());

        for (var member : members) {
            if (member.getUser() == null
                    || member.getUser().getId() == null
                    || member.getUser().getId().equals(user.getId())) {
                continue;
            }

            Notification notification = new Notification();
            notification.setRecipient(member.getUser());
            notification.setProject(savedProject);
            notification.setMessage(
                    "Leader vừa tạo dự án \""
                            + savedProject.getName()
                            + "\" trong nhóm \""
                            + group.getName()
                            + "\"."
            );
            notification.setRead(false);
            notification.setType(NotificationType.PROJECT_CREATED);

            notifications.save(notification);
        }

        return view(savedProject);
    }


    @Transactional
    public ProjectView update(
            Long id,
            User user,
            ProjectRequest request) {
        checkUser(user);

        Project project = owned(id, user);
        apply(project, request, user);

        return view(projects.save(project));
    }

    @Transactional
    public void delete(Long id, User user) {
        checkUser(user);
        projects.delete(owned(id, user));
    }

    private void checkUser(User user) {
        if (user == null || user.getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }
    }

    private void apply(
            Project project,
            ProjectRequest request,
            User user) {

        var group = groups.findById(request.groupId())
                .filter(item -> item.getWorkspace() != null)
                .filter(item -> item.getWorkspace().getOwner() != null)
                .filter(item -> Objects.equals(
                        item.getWorkspace().getOwner().getId(),
                        user.getId()
                ))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid group"
                ));

        project.setGroup(group);
        project.setName(request.name());
        project.setDescription(request.description());
        project.setStatus(request.status());
        project.setPriority(request.priority());
        project.setDeadline(request.deadline());

        project.setColor(
                request.color() == null || request.color().isBlank()
                        ? "#6366F1"
                        : request.color()
        );
    }

    private Project owned(Long id, User user) {
        return projects.findById(id)
                .filter(project -> project.getWorkspace() != null)
                .filter(project -> project.getWorkspace().getOwner() != null)
                .filter(project -> Objects.equals(
                        project.getWorkspace().getOwner().getId(),
                        user.getId()
                ))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Project not found"
                ));
    }

    private ProjectView view(Project project) {
        return new ProjectView(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getGroup().getId(),
                project.getGroup().getName(),
                project.getStatus(),
                project.getPriority(),
                project.getColor(),
                project.getDeadline(),
                tasks.countByProjectId(project.getId()),
                tasks.countByProjectIdAndStatus(
                        project.getId(),
                        TaskStatus.DONE
                )
        );
    }

    @Transactional(readOnly = true)
    public List<ProjectMemberView> getMembers(Long id, User user) {
        checkUser(user);

        Project project = accessible(id, user);
        Long groupId = project.getGroup().getId();

        return groupMembers.findByGroupId(groupId)
                .stream()
                .map(member -> new ProjectMemberView(
                        member.getUser().getId(),
                        member.getUser().fullName(),
                        member.getUser().getEmail(),
                        member.getUser().initials()
                ))
                .toList();
    }
    private Project accessible(Long id, User user) {
        Project project = projects.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Project not found"
                ));

        if (project.getWorkspace() != null
                && project.getWorkspace().getOwner() != null
                && Objects.equals(
                project.getWorkspace().getOwner().getId(),
                user.getId()
        )) {
            return project;
        }

        Long groupId = project.getGroup().getId();

        if (groupMembers.existsByGroupIdAndUserId(
                groupId, user.getId())) {
            return project;
        }

        throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Project not found"
        );
    }

}