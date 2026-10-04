package com.aleshwaram.portfolio.controller;

import com.aleshwaram.portfolio.dto.ContactRequest;
import com.aleshwaram.portfolio.dto.ContactResponse;
import com.aleshwaram.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ContactResponse> submitInquiry(@Valid @RequestBody ContactRequest request) {
        ContactResponse response = contactService.processInquiry(request);
        return ResponseEntity.ok(response);
    }
}
