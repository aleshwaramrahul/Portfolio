package com.aleshwaram.portfolio.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record TelemetryDto(
        String node,
        String status,
        String buildVersion,
        String stack,
        String mode,
        String location,
        Instant serverTime,
        long uptimeSeconds,
        Map<String, List<String>> skills,
        List<ProjectDto> projects
) {
    public record ProjectDto(
            String id,
            String title,
            String description,
            List<String> techStack
    ) {}
}
