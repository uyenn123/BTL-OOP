package com.flowtask.backend.service;

import com.flowtask.backend.dto.Request.GroupRequest;
import com.flowtask.backend.dto.Response.*;
import com.flowtask.backend.entity.*;
import com.flowtask.backend.repository.*;
import com.flowtask.backend.entity.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.flowtask.backend.dto.Request.AddGroupMemberRequest;
import java.util.List;
import java.util.Objects;
@Service
@RequiredArgsConstructor
public class GroupService {

    private final TeamGroupRepository groups;
    private final GroupMemberRepository members;
    private final ProjectRepository projects;
    private final TaskRepository tasks;
    private final WorkspaceRepository workspaces;
    private final UserRepository users;
    @Transactional(readOnly = true)
    public List<GroupView> getAll(User user) {
        return groups.findByWorkspaceOwnerIdOrderByName(user.getId())
                .stream()
                .map(this::toView)
                .toList();
    }

    @Transactional(readOnly = true)
    public GroupDetail getDetail(Long id, User user) {
        TeamGroup group = owned(id, user);

        List<MemberView> memberViews = members.findByGroupId(id)
                .stream()
                .map(member -> new MemberView(
                        member.getUser().getId(),
                        member.getUser().fullName(),
                        member.getUser().initials(),
                        member.getRole(),
                        member.getUser().getEmail()
                ))
                .toList();

        List<ProjectSummary> projectViews =
                projects.findByWorkspaceOwnerIdOrderByCreatedAtDesc(user.getId())
                        .stream()
                        .filter(project -> project.getGroup() != null
                                && project.getGroup().getId().equals(id))
                        .map(project -> new ProjectSummary(
                                project.getId(),
                                project.getName(),
                                project.getColor(),
                                tasks.countByProjectId(project.getId()),
                                tasks.countByProjectIdAndStatus(
                                        project.getId(), TaskStatus.DONE)
                        ))
                        .toList();

        return new GroupDetail(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getColor(),
                memberViews,
                projectViews
        );
    }

    @Transactional
    public GroupView create(User user, GroupRequest request) {
        var workspace = workspaces.findFirstByOwnerId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Workspace not found"));

        TeamGroup group = new TeamGroup();
        group.setWorkspace(workspace);
        apply(group, request);
        group = groups.save(group);

        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(user);
        member.setRole("Team Lead");
        members.save(member);

        return toView(group);
    }
    @Transactional
    public void addMember(Long id, User user, AddGroupMemberRequest request) {
        TeamGroup group = owned(id, user);

        String email = request.getEmail().trim();

        String currentEmail = user.getEmail() == null
                ? ""
                : user.getEmail().trim();

        if (!currentEmail.isEmpty()
                && currentEmail.equalsIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Bạn không thể tự thêm chính mình vào nhóm"
            );
        }

        User newUser = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy tài khoản với email này"
                ));

        if (Objects.equals(user.getId(), newUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Bạn không thể tự thêm chính mình vào nhóm"
            );
        }

        if (members.existsByGroupIdAndUserId(id, newUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Người dùng đã là thành viên của nhóm"
            );
        }

        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(newUser);
        member.setRole("Member");

        members.save(member);
    }
    @Transactional
    public GroupView update(Long id, User user, GroupRequest request) {
        TeamGroup group = owned(id, user);
        apply(group, request);
        return toView(groups.save(group));
    }

    @Transactional
    public void delete(Long id, User user) {
        groups.delete(owned(id, user));
    }

    private TeamGroup owned(Long id, User user) {
        return groups.findById(id)
                .filter(group -> group.getWorkspace().getOwner()
                        .getId().equals(user.getId()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Group not found"));
    }

    private GroupView toView(TeamGroup group) {
        List<GroupMember> groupMembers =
                members.findByGroupId(group.getId());

        return new GroupView(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getColor(),
                groupMembers.size(),
                projects.countByGroupId(group.getId()),
                groupMembers.stream()
                        .limit(4)
                        .map(member -> member.getUser().initials())
                        .toList()
        );
    }

    private void apply(TeamGroup group, GroupRequest request) {
        group.setName(request.name());
        group.setDescription(request.description());
        group.setColor(
                request.color() == null || request.color().isBlank()
                        ? "#6366F1"
                        : request.color()
        );
    }
}