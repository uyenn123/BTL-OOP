package com.flowtask.backend.dto;

import com.flowtask.backend.entity.Project;

import java.time.LocalDate;
import java.util.List;

public class ProjectRequest {

    private String name;
    private String description;
    private String groupName;
    private Project.ProjectStatus status;
    private Project.ProjectPriority priority;
    private String color;
    // Dùng Integer (nullable): field nào client không gửi thì giữ nguyên giá trị cũ, không bị reset về 0
    private Integer progress;
    private LocalDate deadline;
    private List<Project.TeamMember> teamMembers;
    private Integer taskDone;
    private Integer taskInProgress;
    private Integer taskReview;
    private Integer taskTodo;

    public ProjectRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Project.ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(Project.ProjectStatus status) {
        this.status = status;
    }

    public Project.ProjectPriority getPriority() {
        return priority;
    }

    public void setPriority(Project.ProjectPriority priority) {
        this.priority = priority;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public List<Project.TeamMember> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(List<Project.TeamMember> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public Integer getTaskDone() {
        return taskDone;
    }

    public void setTaskDone(Integer taskDone) {
        this.taskDone = taskDone;
    }

    public Integer getTaskInProgress() {
        return taskInProgress;
    }

    public void setTaskInProgress(Integer taskInProgress) {
        this.taskInProgress = taskInProgress;
    }

    public Integer getTaskReview() {
        return taskReview;
    }

    public void setTaskReview(Integer taskReview) {
        this.taskReview = taskReview;
    }

    public Integer getTaskTodo() {
        return taskTodo;
    }

    public void setTaskTodo(Integer taskTodo) {
        this.taskTodo = taskTodo;
    }
}
