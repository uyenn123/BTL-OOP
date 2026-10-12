
package com.flowtask.backend.dto.Request;
import com.flowtask.backend.dto.Request.CommentRequest;
import jakarta.validation.constraints.NotBlank;

public record CommentRequest(
        @NotBlank String content
) {}
