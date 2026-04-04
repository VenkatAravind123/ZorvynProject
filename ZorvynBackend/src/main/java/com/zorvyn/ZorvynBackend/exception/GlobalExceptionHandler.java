package com.zorvyn.ZorvynBackend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    public ResponseEntity<Map<String,Object>> handleAccessDenied(AccessDeniedException ex , HttpServletRequest req){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("timestamp", LocalDateTime.now().toString(),
                "status",403,
                "error","FORBIDDEN",
                "message","You do not have permission to access this resource",
                "path",req.getRequestURI()
        ));
    }
}
