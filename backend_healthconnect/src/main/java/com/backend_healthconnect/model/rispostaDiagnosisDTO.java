package com.backend_healthconnect.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class rispostaDiagnosisDTO {
    private Question question;
    private List<Condition> conditions;

    @JsonProperty("has_emergency_evidence")
    private boolean hasEmergencyEvidence;

    @JsonProperty("should_stop")
    private boolean shouldStop;  // true = basta domande, false = continua

    private Map<String, Object> extras;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Condition {
        private String id;
        private String name;
        @JsonProperty("common_name")
        private String commonName;
        private double probability;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Question {
        private String type;        // es: "group_multiple" o "single"
        private String text;        // es: "Which of the following worsen the headache?"
        private List<Item> items;   // La lista delle opzioni specifiche
        private Map<String, Object> extras;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        private String id;      // es: "s_799"
        private String name;    // es: "It is worse in the morning"
        private List<Choice> choices;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {
        private String id;      // es: "present", "absent", "unknown"
        private String label;   // es: "Yes", "No", "Don't know"
    }
}
