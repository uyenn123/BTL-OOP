package com.flowtask.backend.service;

import com.flowtask.backend.dto.Request.StatusRequest;
import com.flowtask.backend.dto.Request.TaskRequest;
import com.flowtask.backend.dto.Response.TaskView;
import com.flowtask.backend.entity.*;
import com.flowtask.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
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
    private final GroupMemberRepository groupMembers;
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
        var task = tasks.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"));

        boolean isAssignee = task.getAssignee() != null
                && task.getAssignee().getId().equals(user.getId());

        boolean isReporter = task.getReporter() != null
                && task.getReporter().getId().equals(user.getId());

        if (!isLeader(task, user) && !isAssignee && !isReporter) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Task not found");
        }

        return view(task);
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

        Long oldAssigneeId = task.getAssignee() == null
                ? null : task.getAssignee().getId();

        apply(task, request, user);

        var saved = tasks.save(task);

        Long newAssigneeId = saved.getAssignee() == null
                ? null : saved.getAssignee().getId();

        if (newAssigneeId != null
                && !newAssigneeId.equals(user.getId())
                && !newAssigneeId.equals(oldAssigneeId)) {
            notifyAssignee(saved, user);
        }

        return view(saved);
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
            if (oldStatus != TaskStatus.DONE
                    && saved.getStatus() == TaskStatus.DONE
                    && saved.getAssignee() != null
                    && !saved.getAssignee().getId().equals(user.getId())) {

                Notification notification = new Notification();
                notification.setRecipient(saved.getAssignee());
                notification.setProject(saved.getProject());
                notification.setTaskId(saved.getId());
                notification.setMessage(
                        "Leader " + user.fullName()
                                + " đã xác nhận hoàn thành nhiệm vụ \""
                                + saved.getTitle() + "\"."
                );
                notification.setRead(false);
                notification.setType(NotificationType.TASK_COMPLETED);

                notifications.save(notification);
            }
        }

        if (oldStatus != TaskStatus.IN_PROGRESS
                && saved.getStatus() == TaskStatus.IN_PROGRESS) {
            notifyReporter(
                    saved,
                    user,
                    NotificationType.TASK_STARTED,
                    user.fullName() + " đã bắt đầu thực hiện nhiệm vụ \""
                            + saved.getTitle() + "\"."
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

        boolean wasCompleted = task.isMainTaskDone()
                && task.isResultChecked()
                && task.isTaskFinished();

        task.setMainTaskDone(request.mainTaskDone());
        task.setResultChecked(request.resultChecked());
        task.setTaskFinished(request.taskFinished());

        var saved = tasks.save(task);

        boolean isCompleted = saved.isMainTaskDone()
                && saved.isResultChecked()
                && saved.isTaskFinished();


        if (!wasCompleted && isCompleted) {
            notifyLeaders(
                    saved,
                    user,
                    NotificationType.TASK_COMPLETION_REQUEST,
                    user.fullName()
                            + " đã hoàn thành checklist của nhiệm vụ \""
                            + saved.getTitle()
                            + "\" và đang chờ Leader xác nhận."
            );
        }


        return view(saved);
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
                task.isMainTaskDone(),
                task.isResultChecked(),
                task.isTaskFinished(),
                task.getCreatedAt()
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
        var project = task.getProject();

        if (project == null) {
            return false;
        }

        // Chủ workspace được xem là Leader
        if (project.getWorkspace() != null
                && project.getWorkspace().getOwner() != null
                && project.getWorkspace().getOwner().getId()
                .equals(user.getId())) {
            return true;
        }

        // Giữ nguyên kiểm tra Leader trong nhóm
        var group = project.getGroup();

        if (group == null) {
            return false;
        }

        return groupMembers.existsByGroupIdAndUserIdAndRoleIgnoreCase(
                group.getId(),
                user.getId(),
                "Team Lead"
        );
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
    private void notifyReporter(
            Task task,
            User actor,
            NotificationType type,
            String message) {

        User reporter = task.getReporter();

        if (reporter == null
                || reporter.getId().equals(actor.getId())) {
            return;
        }

        Notification notification = new Notification();
        notification.setRecipient(reporter);
        notification.setMessage(message);
        notification.setProject(task.getProject());
        notification.setTaskId(task.getId());
        notification.setType(type);

        notifications.save(notification);
    }

    private void notifyLeaders(
            Task task,
            User actor,
            NotificationType type,
            String message) {

        var group = task.getProject().getGroup();

        if (group == null) {
            return;
        }

        var leaders = groupMembers.findByGroupIdAndRoleIgnoreCase(
                group.getId(),
                "Team Lead"
        );

        for (var member : leaders) {
            User leader = member.getUser();

            if (leader.getId().equals(actor.getId())) {
                continue;
            }

            Notification notification = new Notification();
            notification.setRecipient(leader);
            notification.setMessage(message);
            notification.setProject(task.getProject());
            notification.setTaskId(task.getId());
            notification.setType(type);

            notifications.save(notification);
        }
    }

}
