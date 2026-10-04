package com.aleshwaram.portfolio.service;

import com.aleshwaram.portfolio.dto.TelemetryDto;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {

    public TelemetryDto getTelemetry() {
        long uptimeSeconds = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;

        Map<String, List<String>> skills = Map.of(
                "Core Languages", List.of("Java", "JavaScript ES6", "TypeScript", "SQL", "HTML5", "CSS3"),
                "Server & Automation", List.of("Spring Boot", "Spring MVC", "Node.js", "Express.js", "Hibernate", "RESTful APIs", "Gemini API"),
                "UI Engineering", List.of("React 18/19", "Next.js", "Vite", "Tailwind CSS", "Lucide React"),
                "Databases & Media", List.of("PostgreSQL", "MySQL", "SQLite", "Supabase", "Sharp", "Node Canvas"),
                "Developer Tools", List.of("Git / GitHub", "Postman", "Maven", "IntelliJ IDEA", "VS Code", "Antigravity"),
                "Architecture", List.of("OOP", "DSA", "System Design", "SDLC", "RBAC", "Microservices")
        );

        List<TelemetryDto.ProjectDto> projects = List.of(
                new TelemetryDto.ProjectDto(
                        "Project_01",
                        "NexusHR WorkforceOS",
                        "Enterprise workforce management platform featuring Role-Based Access Control with Admin and Employee portals.",
                        List.of("React 18", "TypeScript", "Supabase", "PostgreSQL", "Edge Functions")
                ),
                new TelemetryDto.ProjectDto(
                        "Project_02",
                        "Glowora Skincare",
                        "Modern responsive e-commerce SPA for botanical skincare brand with lightweight static HTTP server in Java 25.",
                        List.of("Java 25", "React 18", "Vite 5", "Tailwind CSS")
                ),
                new TelemetryDto.ProjectDto(
                        "Project_03",
                        "JoyBoyJutsu — AI Media Engine",
                        "Fully autonomous multi-agent media pipeline scraping viral content, synthesizing via Gemini AI, and auto-publishing to Instagram.",
                        List.of("Next.js 16", "Gemini API", "Node Canvas", "Instagram API")
                ),
                new TelemetryDto.ProjectDto(
                        "Project_04",
                        "Library Management System",
                        "Full-stack library management system with React UI and Spring Boot backend with Spring Security/JWT.",
                        List.of("Spring Boot", "React", "MySQL", "Spring Security")
                )
        );

        return new TelemetryDto(
                "HYD-001",
                "ONLINE",
                "v2.1.0",
                "FULL-STACK (JAVA + REACT)",
                "DARK",
                "Hyderabad, Telangana, India",
                Instant.now(),
                uptimeSeconds,
                skills,
                projects
        );
    }
}
