package com.flowtask.backend.service;

import com.flowtask.backend.dto.Request.LoginRequest;
import com.flowtask.backend.dto.Request.RegisterRequest;
import com.flowtask.backend.dto.Response.AuthResponse;
import com.flowtask.backend.dto.Response.UserView;
import com.flowtask.backend.entity.GroupMember;
import com.flowtask.backend.entity.TeamGroup;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.entity.Workspace;
import com.flowtask.backend.repository.GroupMemberRepository;
import com.flowtask.backend.repository.TeamGroupRepository;
import com.flowtask.backend.repository.UserRepository;
import com.flowtask.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository users;
    private final WorkspaceRepository workspaces;
    private final TeamGroupRepository groups;
    private final GroupMemberRepository groupMembers;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        var user = users.findByEmailIgnoreCase(request.email().trim())
                .filter(User::isActive)
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(
                request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return response(user);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        if (users.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        var names = request.name().trim().split("\\s+", 2);

        var user = new User();
        user.setFirstName(names[0]);
        user.setLastName(names.length == 2 ? names[1] : "");
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        users.save(user);

        var workspace = new Workspace();
        workspace.setName(user.fullName() + "'s workspace");
        workspace.setOwner(user);
        workspaces.save(workspace);

        var group = new TeamGroup();
        group.setName("General");
        group.setDescription("Your first FlowTask team");
        group.setWorkspace(workspace);
        groups.save(group);

        var membership = new GroupMember();
        membership.setGroup(group);
        membership.setUser(user);
        membership.setRole("Team Lead");
        groupMembers.save(membership);

        return response(user);
    }

    private AuthResponse response(User user) {
        return new AuthResponse(
                jwtService.issue(user.getEmail()),
                UserView.from(user)
        );
    }
}