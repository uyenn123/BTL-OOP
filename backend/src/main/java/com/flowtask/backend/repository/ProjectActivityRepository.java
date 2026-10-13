package com.flowtask.backend.repository;

import com.flowtask.backend.entity.ProjectActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectActivityRepository
        extends JpaRepository<ProjectActivity, Long> {

    List<ProjectActivity> findByProjectIdOrderByCreatedAtDesc(Long projectId);
}