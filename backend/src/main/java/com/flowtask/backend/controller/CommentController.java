
package com.flowtask.backend.controller;
import com.flowtask.backend.dto.Response.CommentView;
import com.flowtask.backend.dto.Request.CommentRequest;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public List<CommentView> all(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user
    ) {
        return commentService.getComments(projectId, user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommentView create(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CommentRequest request
    ) {
        return commentService.createComment(projectId, user, request);
    }
}
