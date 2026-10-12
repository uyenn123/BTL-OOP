
package com.flowtask.backend.service;

import com.flowtask.backend.dto.Request.CommentRequest;
import com.flowtask.backend.dto.Response.CommentView;
import com.flowtask.backend.entity.Project;
import com.flowtask.backend.entity.ProjectComment;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.repository.ProjectCommentRepository;
import com.flowtask.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final ProjectRepository projects;
    private final ProjectCommentRepository comments;

    public List<CommentView> getComments(Long projectId, User user) {
        verify(projectId, user);

        return comments.findByProjectIdOrderByCreatedAtAsc(projectId)
                .stream()
                .map(CommentView::from)
                .toList();
    }

    public CommentView createComment(
            Long projectId,
            User user,
            CommentRequest request
    ) {
        var project = verify(projectId, user);

        var comment = new ProjectComment();
        comment.setProject(project);
        comment.setAuthor(user);
        comment.setContent(request.content());

        return CommentView.from(comments.save(comment));
    }

    private Project verify(Long projectId, User user) {
        return projects.findById(projectId)
                .filter(project ->
                        project.getWorkspace().getOwner().getId()
                                .equals(user.getId()))
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Project not found"
                        ));
    }
}
