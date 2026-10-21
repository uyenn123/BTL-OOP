package com.flowtask.backend.repository;

import com.flowtask.backend.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMemberRepository
        extends JpaRepository<GroupMember, Long> {

    boolean existsByGroupIdAndUserIdAndRoleIgnoreCase(
            Long groupId,
            Long userId,
            String role
    );

    List<GroupMember> findByGroupIdAndRoleIgnoreCase(
            Long groupId,
            String role
    );


    List<GroupMember> findByGroupId(Long groupId);


    List<GroupMember> findByUserId(Long userId);


    boolean existsByGroupIdAndUserId(
            Long groupId,
            Long userId
    );
}