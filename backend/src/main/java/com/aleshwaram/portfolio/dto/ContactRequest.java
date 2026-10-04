package com.aleshwaram.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be under 100 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email address format")
        String email,

        @Size(max = 150, message = "Subject must be under 150 characters")
        String subject,

        @NotBlank(message = "Message content is required")
        @Size(max = 2000, message = "Message must be under 2000 characters")
        String message
) {}
