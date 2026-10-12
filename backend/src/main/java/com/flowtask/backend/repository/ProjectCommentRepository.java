
package com.flowtask.backend.repository;

import com.flowtask.backend.entity.ProjectComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectCommentRepository
        extends JpaRepository<ProjectComment, Long> {

    List<ProjectComment> findByProjectIdOrderByCreatedAtAsc(Long projectId);
}
