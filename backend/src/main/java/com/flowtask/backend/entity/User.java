package com.flowtask.backend.entity;

import com.flowtask.backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(length = 100)
    private String jobTitle;

    @Column(length = 150)
    private String organization;

    @Column(length = 500)
    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(nullable = false)
    private boolean active = true;

    public String fullName() {
        return (firstName + " " + lastName).trim();
    }

    public String initials() {
        return ((firstName.isBlank() ? "" : firstName.substring(0, 1))
                + (lastName.isBlank() ? "" : lastName.substring(0, 1)))
                .toUpperCase();
    }
}