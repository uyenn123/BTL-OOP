package com.flowtask.backend.entity;
import com.flowtask.backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    @Column(nullable = false)
    private String message;

    @Column(name = "is_read", nullable = false)
    private boolean read;
}