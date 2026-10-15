package com.flowtask.backend.service;

import com.flowtask.backend.dto.Request.StatusRequest;
import com.flowtask.backend.dto.Request.TaskRequest;
import com.flowtask.backend.dto.Response.TaskView;
import com.flowtask.backend.entity.*;
import com.flowtask.backend.repository.NotificationRepository;
import com.flowtask.backend.repository.ProjectRepository;
import com.flowtask.backend.repository.TaskRepository;
import com.flowtask.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.flowtask.backend.repository.ProjectActivityRepository;
import com.flowtask.backend.dto.Request.ChecklistRequest;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository tasks;
    private final ProjectRepository projects;
    private final UserRepository users;
    private final NotificationRepository notifications;
    private final ProjectActivityRepository activities;
    @Transactional(readOnly = true)
    public List<TaskView> all(User user) {
        return tasks
                .findByProjectWorkspaceOwnerIdOrAssigneeIdOrReporterIdOrderByStatusAscPositionAsc(
                        user.getId(),
                        user.getId(),
                        user.getId()
                )
                .stream()
                .map(this::view)
                .toList();
    }
    @Transactional(readOnly = true)
    public TaskView getById(Long id, User user) {
        return view(accessible(id, user));
    }
    @Transactional
    public TaskView create(TaskRequest request, User user) {
        var task = new Task();
        task.setReporter(user);

        apply(task, request, user);

        var saved = tasks.save(task);

        if (saved.getAssignee() == null) {
            recordActivity(
                    saved,
                    user,
                    ActivityType.TASK_CREATED,
                    user.fullName() + " đã tạo task \"" + saved.getTitle() + "\""
            );
        } else {
            recordActivity(
                    saved,
                    user,
                    ActivityType.TASK_ASSIGNED,
                    user.fullName() + " đã giao task \"" + saved.getTitle()
                            + "\" cho " + saved.getAssignee().fullName()
            );
        }

        notifyAssignee(saved, user);

        return view(saved);
    }
    @Transactional
    public TaskView update(Long id, TaskRequest request, User user) {
        var task = accessible(id, user);
        boolean isLeader = isLeader(task, user);

        if (!isLeader) {
            if (task.getReporter() == null
                    || !task.getReporter().getId().equals(user.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You cannot edit this task"
                );
            }

            if (task.getAssignee() != null
                    && !task.getAssignee().getId().equals(user.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You cannot edit a task assigned to another user"
                );
            }

            if (request.assigneeId() != null
                    && !request.assigneeId().equals(user.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You can only assign a personal task to yourself"
                );
            }
        }

        apply(task, request, user);

        return view(tasks.save(task));
    }

    @Transactional
    public TaskView updateStatus(
            Long id,
            StatusRequest request,
            User user) {

        var task = accessible(id, user);

        if (request.status() == TaskStatus.DONE
                && !isLeader(task, user)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Chỉ Leader mới được xác nhận hoàn thành nhiệm vụ"
            );
        }

        var oldStatus = task.getStatus();

        task.setStatus(request.status());
        task.setPosition(request.position());

        var saved = tasks.save(task);

        if (oldStatus != TaskStatus.DONE
                && saved.getStatus() == TaskStatus.DONE) {
            recordActivity(
                    saved,
                    user,
                    ActivityType.TASK_COMPLETED,
                    user.fullName() + " đã hoàn thành task \""
                            + saved.getTitle() + "\""
            );
        }

        return view(saved);
    }
    @Transactional
    public void delete(Long id, User user) {
        var task = tasks.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"));

        if (!task.getReporter().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only delete tasks you created");
        }

        tasks.delete(task);
    }
    @Transactional
    public TaskView updateChecklist(
            Long id,
            ChecklistRequest request,
            User user) {

        var task = accessible(id, user);

        task.setMainTaskDone(request.mainTaskDone());
        task.setResultChecked(request.resultChecked());
        task.setTaskFinished(request.taskFinished());

        return view(tasks.save(task));
    }
    private void apply(Task task, TaskRequest request, User user) {
        var project = projects.findById(request.projectId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid project"));

        boolean isLeader = project.getWorkspace()
                .getOwner().getId().equals(user.getId());

        if (!isLeader) {
            if (request.assigneeId() != null
                    && !request.assigneeId().equals(user.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Only the leader can assign tasks to other users"
                );
            }

            if (task.getId() != null
                    && (task.getProject() == null
                    || !task.getProject().getId().equals(project.getId()))) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You cannot move a personal task to another project"
                );
            }
        }

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

        Notification notification = new Notification();
        notification.setRecipient(task.getAssignee());
        notification.setMessage(
                actor.fullName() + " assigned you to \"" + task.getTitle() + "\""
        );
        notification.setProject(task.getProject());
        notification.setTaskId(task.getId());
        notification.setType(NotificationType.TASK_ASSIGNED);

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
                project.getColor(),
                task.getReporter() == null ? null : task.getReporter().getId(), task.getReporter() == null ? null : task.getReporter().fullName(),
              //  task.getReporter() == null ? null : task.getReporter().fullName(),
                task.isMainTaskDone(),
                task.isResultChecked(),
                task.isTaskFinished()
        );
    }
    private void recordActivity(
            Task task,
            User actor,
            ActivityType eventType,
            String content) {

        var activity = new ProjectActivity();
        activity.setProject(task.getProject());
        activity.setActor(actor);
        activity.setEventType(eventType);
        activity.setContent(content);
        activity.setEntityId(task.getId());

        activities.save(activity);
    }
    private boolean isLeader(Task task, User user) {
        return task.getProject().getWorkspace()
                .getOwner().getId().equals(user.getId());
    }

    private Task accessible(Long id, User user) {
        return tasks.findById(id)
                .filter(task ->
                        isLeader(task, user)
                                || (task.getAssignee() != null
                                && task.getAssignee().getId().equals(user.getId()))
                                || (task.getReporter() != null
                                && task.getReporter().getId().equals(user.getId())
                                && (task.getAssignee() == null
                                || task.getAssignee().getId().equals(user.getId())))
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"));
    }
}
