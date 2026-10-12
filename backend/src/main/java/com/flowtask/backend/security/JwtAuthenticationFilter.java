package com.flowtask.backend.security;

import com.flowtask.backend.entity.User;
import com.flowtask.backend.repository.UserRepository;
import com.flowtask.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository users;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        var header = request.getHeader("Authorization");

        if (header != null
                && header.startsWith("Bearer ")
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                var email = jwtService.subject(header.substring(7));

                users.findByEmailIgnoreCase(email)
                        .filter(User::isActive)
                        .ifPresent(user -> {
                            var authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            user, null, List.of()
                                    );

                            SecurityContextHolder.getContext()
                                    .setAuthentication(authentication);
                        });

            } catch (RuntimeException ignored) {
                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(request, response);
    }
}
