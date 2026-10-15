package com.flowtask.backend.dto.Request;

public record ChecklistRequest(
        boolean mainTaskDone,
        boolean resultChecked,
        boolean taskFinished
) {}