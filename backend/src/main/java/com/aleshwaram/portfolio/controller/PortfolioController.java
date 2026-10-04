package com.aleshwaram.portfolio.controller;

import com.aleshwaram.portfolio.dto.TelemetryDto;
import com.aleshwaram.portfolio.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<TelemetryDto> getTelemetry() {
        return ResponseEntity.ok(portfolioService.getTelemetry());
    }
}
