package com.flowtask.backend.dto.Response;

import com.flowtask.backend.entity.ProjectComment;
import java.time.Instant;

public record CommentView(
        Long id,
        Long authorId,
        String authorName,
        String authorInitials,
        String content,
        Instant createdAt
) {
    public static CommentView from(ProjectComment comment) {
        return new CommentView(
                comment.getId(),
                comment.getUser().getId(),
                comment.getUser().fullName(),
                comment.getUser().initials(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}
