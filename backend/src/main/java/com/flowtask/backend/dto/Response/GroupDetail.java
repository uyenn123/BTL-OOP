package com.flowtask.backend.dto.Response;

import java.util.List;

public record GroupDetail(
        Long id,
        String name,
        String description,
        String color,
        List<MemberView> members,
        List<ProjectSummary> projects
) {}