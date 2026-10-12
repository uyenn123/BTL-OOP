package com.flowtask.backend.entity;
import com.flowtask.backend.common.BaseEntity;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "workspaces")
public class Workspace extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id")
    private User owner;
}