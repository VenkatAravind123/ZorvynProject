package com.zorvyn.ZorvynBackend.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");

        Map<String , Object> body = Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status",403,
                "error","FORBIDDEN",
                "message","You do not have permission to access this resource",
                "path",request.getRequestURI()
        );

        response.getWriter().write(new ObjectMapper().writeValueAsString(body));
    }
}
