package com.flowtask.backend.entity;

import com.flowtask.backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "projects")
public class Project extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id")
    private TeamGroup group;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProjectStatus status = ProjectStatus.PLANNING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Priority priority = Priority.MEDIUM;

    @Column(nullable = false, length = 20)
    private String color = "#6366F1";

    private LocalDate deadline;
}