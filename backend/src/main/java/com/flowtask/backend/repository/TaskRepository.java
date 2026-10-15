package com.flowtask.backend.repository;

import com.flowtask.backend.entity.Task;
import com.flowtask.backend.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectWorkspaceOwnerIdOrderByStatusAscPositionAsc(Long ownerId);

    long countByProjectId(Long projectId);

    long countByProjectIdAndStatus(Long projectId, TaskStatus status);
    List<Task> findByProjectWorkspaceOwnerIdOrAssigneeIdOrReporterIdOrderByStatusAscPositionAsc(
            Long ownerId,
            Long assigneeId,
            Long reporterId
    );
}