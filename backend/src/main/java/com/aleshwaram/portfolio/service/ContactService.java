package com.aleshwaram.portfolio.service;

import com.aleshwaram.portfolio.dto.ContactRequest;
import com.aleshwaram.portfolio.dto.ContactResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);
    private final Map<String, SavedMessage> messageStore = new ConcurrentHashMap<>();

    public record SavedMessage(
            String id,
            String name,
            String email,
            String subject,
            String message,
            Instant receivedAt
    ) {}

    public ContactResponse processInquiry(ContactRequest request) {
        String referenceId = "INQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        SavedMessage saved = new SavedMessage(
                referenceId,
                request.name().trim(),
                request.email().trim(),
                request.subject() != null ? request.subject().trim() : "General Inquiry",
                request.message().trim(),
                Instant.now()
        );

        messageStore.put(referenceId, saved);
        log.info("Received new portfolio inquiry [Ref: {}] from {} <{}>", referenceId, saved.name(), saved.email());

        return ContactResponse.ok("Message received successfully. Thank you for reaching out!", referenceId);
    }

    public int getTotalInquiries() {
        return messageStore.size();
    }
}
