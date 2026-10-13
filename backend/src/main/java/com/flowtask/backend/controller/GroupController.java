package com.flowtask.backend.controller;

import com.flowtask.backend.dto.Request.GroupRequest;
import com.flowtask.backend.dto.Response.GroupDetail;
import com.flowtask.backend.dto.Response.GroupView;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.flowtask.backend.dto.Request.AddGroupMemberRequest;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping
    public List<GroupView> all(
            @AuthenticationPrincipal User user
    ) {
        return groupService.getAll(user);
    }

    @GetMapping("/{id}")
    public GroupDetail detail(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return groupService.getDetail(id, user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GroupView create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GroupRequest request
    ) {
        return groupService.create(user, request);
    }

    @PutMapping("/{id}")
    public GroupView update(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GroupRequest request
    ) {
        return groupService.update(id, user, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        groupService.delete(id, user);
    }

    @PostMapping("/{id}/members")
    @ResponseStatus(HttpStatus.CREATED)
    public void addMember(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddGroupMemberRequest request
    ) {
        groupService.addMember(id, user, request);
    }

}