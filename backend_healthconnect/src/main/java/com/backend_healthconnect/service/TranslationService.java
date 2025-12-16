package com.backend_healthconnect.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class TranslationService {
    @Value("${api.mymemory.url}")
    private String myMemoryUrl;

    @Value("${api.mymemory.email}")
    private String myMemoryEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    public String translateToEnglish(String textInItalian) {
        String url = String.format("%s?q=%s&langpair=it|en&de=%s",
                myMemoryUrl, textInItalian, myMemoryEmail);

        try {
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("responseData")) {
                Map responseData = (Map) response.get("responseData");
                return (String) responseData.get("translatedText");
            }
        } catch (Exception e) {
            System.err.println("Errore traduzione: " + e.getMessage());
        }

        return textInItalian;
    }

}
