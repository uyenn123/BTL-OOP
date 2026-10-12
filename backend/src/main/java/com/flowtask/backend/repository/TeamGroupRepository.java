package com.flowtask.backend.repository;

import com.flowtask.backend.entity.TeamGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamGroupRepository extends JpaRepository<TeamGroup, Long> {

    List<TeamGroup> findByWorkspaceOwnerIdOrderByName(Long ownerId);
}