package com.flowtask.backend.service;

import com.flowtask.backend.dto.Request.StatusRequest;
import com.flowtask.backend.dto.Request.TaskRequest;
import com.flowtask.backend.dto.Response.TaskView;
import com.flowtask.backend.entity.Notification;
import com.flowtask.backend.entity.Task;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.repository.NotificationRepository;
import com.flowtask.backend.repository.ProjectRepository;
import com.flowtask.backend.repository.TaskRepository;
import com.flowtask.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository tasks;
    private final ProjectRepository projects;
    private final UserRepository users;
    private final NotificationRepository notifications;

    @Transactional(readOnly = true)
    public List<TaskView> all(User user) {
        return tasks.findByProjectWorkspaceOwnerIdOrderByStatusAscPositionAsc(user.getId())
                .stream()
                .map(this::view)
                .toList();
    }

    @Transactional
    public TaskView create(TaskRequest request, User user) {
        var task = new Task();
        task.setReporter(user);

        apply(task, request, user);

        var saved = tasks.save(task);
        notifyAssignee(saved, user);

        return view(saved);
    }

    @Transactional
    public TaskView update(Long id, TaskRequest request, User user) {
        var task = owned(id, user);
        apply(task, request, user);

        return view(tasks.save(task));
    }

    @Transactional
    public TaskView updateStatus(Long id, StatusRequest request, User user) {
        var task = owned(id, user);
        task.setStatus(request.status());
        task.setPosition(request.position());

        return view(tasks.save(task));
    }

    @Transactional
    public void delete(Long id, User user) {
        tasks.delete(owned(id, user));
    }

    private void apply(Task task, TaskRequest request, User user) {
        var project = projects.findById(request.projectId())
                .filter(item -> item.getWorkspace().getOwner().getId()
                        .equals(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid project"));

        var assignee = request.assigneeId() == null
                ? null
                : users.findById(request.assigneeId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid assignee"));

        task.setProject(project);
        task.setAssignee(assignee);
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setTags(String.join(",", request.tags() == null
                ? List.of()
                : request.tags()));
        task.setDueDate(request.dueDate());
        task.setPosition(request.position());
    }

    private Task owned(Long id, User user) {
        return tasks.findById(id)
                .filter(task -> task.getProject().getWorkspace()
                        .getOwner().getId().equals(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"));
    }

    private void notifyAssignee(Task task, User actor) {
        if (task.getAssignee() == null
                || task.getAssignee().getId().equals(actor.getId())) {
            return;
        }

        var notification = new Notification();
        notification.setRecipient(task.getAssignee());
        notification.setMessage(
                actor.fullName() + " assigned you to \"" + task.getTitle() + "\"");

        notifications.save(notification);
    }
    private TaskView view(Task task) {
        var tagList = task.getTags() == null || task.getTags().isBlank()
                ? List.<String>of()
                : Arrays.stream(task.getTags().split(",")).toList();

        var project = task.getProject();
        var workspace = project.getWorkspace();
        var group = project.getGroup();

        return new TaskView(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                project.getId(),
                project.getName(),
                workspace.getId(),
                workspace.getName(),
                group == null ? null : group.getName(),
                task.getAssignee() == null ? null : task.getAssignee().getId(),
                task.getAssignee() == null ? null : task.getAssignee().fullName(),
                task.getAssignee() == null ? "—" : task.getAssignee().initials(),
                task.getStatus(),
                task.getPriority(),
                tagList,
                task.getDueDate(),
                task.getPosition(),
                project.getColor()
        );
    }
}
