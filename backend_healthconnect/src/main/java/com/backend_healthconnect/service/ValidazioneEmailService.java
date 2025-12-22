package com.backend_healthconnect.service;

import com.backend_healthconnect.model.ValidazioneEmail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class ValidazioneEmailService {

    @Value("${email.reputation.api.url}")
    private String apiUrl;

    @Value("${email.reputation.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public ValidazioneEmail reputazione(String email) {
        String url = UriComponentsBuilder
                .fromUriString(apiUrl)
                .queryParam("api_key", apiKey)
                .queryParam("email", email)
                .build(true)
                .toUriString();

        return restTemplate.getForObject(url, ValidazioneEmail.class);
    }

    public boolean emailReale(String email) {
        try {
            ValidazioneEmail r = reputazione(email);

            if (r == null || r.getEmailDeliverability() == null) return false;

            String status = r.getEmailDeliverability().getStatus();
            if (!"deliverable".equalsIgnoreCase(status)) {
                return false;
            }

            var q = r.getEmailQuality();
            if (q == null) return false;

            if (Boolean.TRUE.equals(q.getIsDisposable())) return false;

            if (q.getScore() != null && q.getScore() < 0.50) return false;

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false; // meglio fail-closed
        }
    }
}