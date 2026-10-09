package com.flowtask.backend.service;

import com.flowtask.backend.dto.ProjectRequest;
import com.flowtask.backend.entity.Project;
import com.flowtask.backend.repository.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class ProjectService {

    private static final String[] COLORS = {
            "#6366F1", "#A78BFA", "#34D399", "#38BDF8", "#FBBF24", "#F87171"
    };
    private static final Pattern HEX_COLOR = Pattern.compile("^#[0-9a-fA-F]{6}$");

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Lọc theo status và/hoặc từ khóa tên (trước đây khi gửi cả hai thì search bị bỏ qua)
    public List<Project> getProjects(Project.ProjectStatus status, String search) {
        boolean hasSearch = search != null && !search.isBlank();
        if (status != null && hasSearch) {
            return projectRepository.findByStatusAndNameContainingIgnoreCase(status, search.trim());
        }
        if (status != null) {
            return projectRepository.findByStatus(status);
        }
        if (hasSearch) {
            return projectRepository.findByNameContainingIgnoreCase(search.trim());
        }
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Project not found with id: " + id));
    }

    public List<Project> getProjectsByStatus(Project.ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    public List<Project> searchProjects(String keyword) {
        return projectRepository.findByNameContainingIgnoreCase(keyword);
    }

    @Transactional
    public Project createProject(ProjectRequest request) {
        Project project = new Project();
        applyRequest(project, request);
        if (project.getColor() == null) {
            project.setColor(COLORS[(int) (projectRepository.count() % COLORS.length)]);
        }
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long id, ProjectRequest request) {
        Project project = getProjectById(id);
        applyRequest(project, request);
        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    @Transactional
    public Project addMilestone(Long id, String title) {
        String clean = title == null ? "" : title.trim();
        if (clean.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Milestone title is required");
        }
        if (clean.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Milestone title is too long (max 255)");
        }
        Project project = getProjectById(id);
        project.getMilestones().add(new Project.Milestone(clean, false));
        return projectRepository.save(project);
    }

    @Transactional
    public Project toggleMilestone(Long id, int milestoneIndex) {
        Project project = getProjectById(id);
        List<Project.Milestone> milestones = project.getMilestones();

        if (milestoneIndex < 0 || milestoneIndex >= milestones.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid milestone index");
        }

        Project.Milestone milestone = milestones.get(milestoneIndex);
        milestone.setDone(!milestone.isDone());
        return projectRepository.save(project);
    }

    @Transactional
    public Project addComment(Long id, String author, String content) {
        String text = content == null ? "" : content.trim();
        if (text.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment content is required");
        }
        if (text.length() > 1000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment is too long (max 1000)");
        }
        String name = author == null ? "" : author.trim();
        if (name.isEmpty()) {
            name = "Anonymous";
        } else if (name.length() > 255) {
            name = name.substring(0, 255);
        }

        Project project = getProjectById(id);
        project.getComments().add(new Project.Comment(name, text));
        return projectRepository.save(project);
    }

    private void applyRequest(Project project, ProjectRequest request) {
        String name = request.getName() == null ? "" : request.getName().trim();
        if (name.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project name is required");
        }
        if (name.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project name is too long (max 255)");
        }
        String description = request.getDescription() == null ? "" : request.getDescription().trim();
        if (description.length() > 1000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description is too long (max 1000)");
        }

        project.setName(name);
        project.setDescription(description);
        project.setGroupName(request.getGroupName() == null ? "" : request.getGroupName().trim());
        project.setStatus(request.getStatus() != null ? request.getStatus() : Project.ProjectStatus.PLANNING);
        project.setPriority(request.getPriority() != null ? request.getPriority() : Project.ProjectPriority.MEDIUM);
        project.setDeadline(request.getDeadline());

        if (request.getColor() != null && HEX_COLOR.matcher(request.getColor()).matches()) {
            project.setColor(request.getColor().toUpperCase());
        }

        // Task breakdown: client không gửi thì giữ nguyên
        if (request.getTaskDone() != null) project.setTaskDone(Math.max(0, request.getTaskDone()));
        if (request.getTaskInProgress() != null) project.setTaskInProgress(Math.max(0, request.getTaskInProgress()));
        if (request.getTaskReview() != null) project.setTaskReview(Math.max(0, request.getTaskReview()));
        if (request.getTaskTodo() != null) project.setTaskTodo(Math.max(0, request.getTaskTodo()));

        // Progress: nhập tay (0-100) khi chưa có task; có task thì tính theo Figma = done / tổng
        if (request.getProgress() != null) {
            project.setProgress(Math.min(100, Math.max(0, request.getProgress())));
        }
        int total = project.getTaskDone() + project.getTaskInProgress()
                + project.getTaskReview() + project.getTaskTodo();
        if (total > 0) {
            project.setProgress(Math.round(project.getTaskDone() * 100f / total));
        }

        if (request.getTeamMembers() != null) {
            List<Project.TeamMember> members = new ArrayList<>();
            for (Project.TeamMember m : request.getTeamMembers()) {
                Project.TeamMember clean = normalizeMember(m);
                if (clean != null) {
                    members.add(clean);
                }
            }
            project.getTeamMembers().clear();
            project.getTeamMembers().addAll(members);
        }
    }

    private Project.TeamMember normalizeMember(Project.TeamMember m) {
        if (m == null) {
            return null;
        }
        String name = m.getName() == null ? "" : m.getName().trim();
        String initials = m.getInitials() == null ? "" : m.getInitials().trim();
        String role = m.getRole() == null ? "" : m.getRole().trim();
        if (initials.isEmpty()) {
            initials = initialsOf(name);
        }
        if (initials.isEmpty() && name.isEmpty()) {
            return null;
        }
        return new Project.TeamMember(initials, name, role);
    }

    // "Linh Tran" -> "LT", "Khoa" -> "KH"
    private String initialsOf(String name) {
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 0 || parts[0].isEmpty()) {
            return "";
        }
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        }
        return ("" + parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
}
