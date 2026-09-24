package com.flowtask.backend.service;

import com.flowtask.backend.dto.ProjectRequest;
import com.flowtask.backend.entity.Project;
import com.flowtask.backend.repository.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
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

    public Project createProject(ProjectRequest request) {
        Project project = new Project();
        applyRequest(project, request);
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, ProjectRequest request) {
        Project project = getProjectById(id);
        applyRequest(project, request);
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    public Project addMilestone(Long id, String title) {
        Project project = getProjectById(id);
        project.getMilestones().add(new Project.Milestone(title, false));
        return projectRepository.save(project);
    }

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

    public Project addComment(Long id, String author, String content) {
        Project project = getProjectById(id);
        project.getComments().add(new Project.Comment(author, content, LocalDate.now()));
        return projectRepository.save(project);
    }

    private void applyRequest(Project project, ProjectRequest request) {
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setGroupName(request.getGroupName());
        project.setStatus(request.getStatus());
        project.setPriority(request.getPriority());
        project.setProgress(request.getProgress());
        project.setDeadline(request.getDeadline());
        if (request.getTeamMembers() != null) {
            project.setTeamMembers(request.getTeamMembers());
        }
    }
}