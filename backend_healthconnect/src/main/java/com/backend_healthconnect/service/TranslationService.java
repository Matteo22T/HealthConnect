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

    public String translateToEnglish(String text) {
        return callMyMemory(text, "it|en");
    }

    public String translateToItalian(String text) {
        return callMyMemory(text, "en|it");
    }

    private String callMyMemory(String text, String langPair) {
        if (text == null || text.trim().isEmpty()) return text;

        String url = String.format("%s?q=%s&langpair=%s&de=%s",
                myMemoryUrl, text, langPair, myMemoryEmail);

        try {
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("responseData")) {
                Map responseData = (Map) response.get("responseData");
                String translated = (String) responseData.get("translatedText");

                // Pulizia minima per apostrofi codificati male da MyMemory
                return translated.replace("&#39;", "'").replace("&quot;", "\"");
            }
        } catch (Exception e) {
            System.err.println("Errore traduzione (" + langPair + "): " + e.getMessage());
        }

        return text;
    }

}
