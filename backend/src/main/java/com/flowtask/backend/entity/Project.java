package com.flowtask.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 1000)
    private String description;

    private String groupName;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @Enumerated(EnumType.STRING)
    private ProjectPriority priority;

    // Màu đại diện của project (hex, VD "#6366F1") - dùng cho thanh màu trên card, progress bar, avatar (theo Figma)
    @Column(length = 7)
    private String color;

    // 0 - 100. Khi project đã có task thì được tính tự động = done / tổng task (xem ProjectService)
    private int progress;

    private LocalDate deadline;

    // Thành viên hiển thị avatar + tên + vai trò (VD: initials "NK", name "Nguyen Khoa", role "Lead")
    @ElementCollection
    @Fetch(FetchMode.SUBSELECT)
    @CollectionTable(name = "project_team_members", joinColumns = @JoinColumn(name = "project_id"))
    private List<TeamMember> teamMembers = new ArrayList<>();

    @ElementCollection
    @Fetch(FetchMode.SUBSELECT)
    @CollectionTable(name = "project_milestones", joinColumns = @JoinColumn(name = "project_id"))
    private List<Milestone> milestones = new ArrayList<>();

    @ElementCollection
    @Fetch(FetchMode.SUBSELECT)
    @CollectionTable(name = "project_comments", joinColumns = @JoinColumn(name = "project_id"))
    private List<Comment> comments = new ArrayList<>();

    // Task breakdown tạm thời (đến khi Task entity của nhóm hoàn thiện thì
    // thay bằng query đếm từ bảng tasks theo projectId)
    private int taskDone;
    private int taskInProgress;
    private int taskReview;
    private int taskTodo;

    public Project() {
    }

    // ===== Getters & Setters =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public ProjectPriority getPriority() {
        return priority;
    }

    public void setPriority(ProjectPriority priority) {
        this.priority = priority;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public List<TeamMember> getTeamMembers() {
        return teamMembers;
    }

    public void setTeamMembers(List<TeamMember> teamMembers) {
        this.teamMembers = teamMembers;
    }

    public List<Milestone> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<Milestone> milestones) {
        this.milestones = milestones;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public int getTaskDone() {
        return taskDone;
    }

    public void setTaskDone(int taskDone) {
        this.taskDone = taskDone;
    }

    public int getTaskInProgress() {
        return taskInProgress;
    }

    public void setTaskInProgress(int taskInProgress) {
        this.taskInProgress = taskInProgress;
    }

    public int getTaskReview() {
        return taskReview;
    }

    public void setTaskReview(int taskReview) {
        this.taskReview = taskReview;
    }

    public int getTaskTodo() {
        return taskTodo;
    }

    public void setTaskTodo(int taskTodo) {
        this.taskTodo = taskTodo;
    }

    // ===== Enums =====

    public enum ProjectStatus {
        ACTIVE, REVIEW, PLANNING, PAUSED
    }

    public enum ProjectPriority {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    // ===== Embeddable phụ =====

    @Embeddable
    public static class TeamMember {
        // Giữ nguyên tên cột cũ để dữ liệu "member_initials" đã có trong DB vẫn đọc được
        @Column(name = "member_initials")
        private String initials;

        @Column(name = "member_name")
        private String name;

        @Column(name = "member_role")
        private String role;

        public TeamMember() {
        }

        public TeamMember(String initials, String name, String role) {
            this.initials = initials;
            this.name = name;
            this.role = role;
        }

        public String getInitials() {
            return initials;
        }

        public void setInitials(String initials) {
            this.initials = initials;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    @Embeddable
    public static class Milestone {
        private String title;
        private boolean done;

        public Milestone() {
        }

        public Milestone(String title, boolean done) {
            this.title = title;
            this.done = done;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public boolean isDone() {
            return done;
        }

        public void setDone(boolean done) {
            this.done = done;
        }
    }

    @Embeddable
    public static class Comment {
        private String author;

        @Column(length = 1000)
        private String content;

        // Chỉ có ngày - giữ lại cho dữ liệu cũ
        private LocalDate createdAt;

        // Thời điểm đăng chính xác - để hiển thị "2h ago" như Figma (null với bình luận cũ)
        @Column(name = "posted_at")
        private Instant postedAt;

        public Comment() {
        }

        public Comment(String author, String content) {
            this.author = author;
            this.content = content;
            this.createdAt = LocalDate.now();
            this.postedAt = Instant.now();
        }

        public String getAuthor() {
            return author;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public LocalDate getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDate createdAt) {
            this.createdAt = createdAt;
        }

        public Instant getPostedAt() {
            return postedAt;
        }

        public void setPostedAt(Instant postedAt) {
            this.postedAt = postedAt;
        }
    }
}
