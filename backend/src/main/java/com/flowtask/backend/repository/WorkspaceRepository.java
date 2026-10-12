package com.flowtask.backend.repository;

import com.flowtask.backend.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    Optional<Workspace> findFirstByOwnerId(Long ownerId);
}