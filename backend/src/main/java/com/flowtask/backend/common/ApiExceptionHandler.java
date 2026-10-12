package com.flowtask.backend.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validation(
            MethodArgumentNotValidException exception) {

        var message = exception.getBindingResult().getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getField() + ": "
                        + error.getDefaultMessage())
                .orElse("Invalid request");

        return error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> credentials() {
        return error(
                HttpStatus.UNAUTHORIZED,
                "Email or password is incorrect"
        );
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> status(
            ResponseStatusException exception) {

        return error(
                HttpStatus.valueOf(exception.getStatusCode().value()),
                exception.getReason()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> unexpected(Exception exception) {
        return error(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred"
        );
    }

    private ResponseEntity<?> error(
            HttpStatus status,
            String message) {

        return ResponseEntity.status(status).body(Map.of(
                "status", status.value(),
                "message", message == null
                        ? status.getReasonPhrase()
                        : message,
                "timestamp", Instant.now().toString()
        ));
    }
}
