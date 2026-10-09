package com.flowtask.backend.repository;

import com.flowtask.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByStatus(Project.ProjectStatus status);

    List<Project> findByNameContainingIgnoreCase(String keyword);

    List<Project> findByStatusAndNameContainingIgnoreCase(Project.ProjectStatus status, String keyword);
}
