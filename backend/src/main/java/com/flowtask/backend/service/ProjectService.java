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

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projects;
    private final TeamGroupRepository groups;
    private final WorkspaceRepository workspaces;
    private final TaskRepository tasks;
    private final GroupMemberRepository groupMembers;

    @Transactional(readOnly = true)
    public List<ProjectView> getAll(User user) {
        checkUser(user);

        return projects
                .findByWorkspaceOwnerIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::view)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectView getOne(Long id, User user) {
        checkUser(user);
        return view(owned(id, user));
    }

    @Transactional
    public ProjectView create(User user, ProjectRequest request) {
        checkUser(user);

        Project project = new Project();

        project.setWorkspace(
                workspaces.findFirstByOwnerId(user.getId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Workspace not found"
                        ))
        );

        apply(project, request, user);

        return view(projects.save(project));
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

        Project project = owned(id, user);
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

}