package com.aleshwaram.portfolio.dto;

import java.time.Instant;

public record ContactResponse(
        boolean success,
        String message,
        String referenceId,
        Instant timestamp
) {
    public static ContactResponse ok(String message, String referenceId) {
        return new ContactResponse(true, message, referenceId, Instant.now());
    }

    public static ContactResponse error(String message) {
        return new ContactResponse(false, message, null, Instant.now());
    }
}
