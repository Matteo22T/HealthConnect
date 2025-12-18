package com.backend_healthconnect.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Collections;
import java.util.List;

@Getter
@Setter
public class richiestaParseDTO {
    private String text;
    private Age age;
    private String sex;

    @JsonProperty("include_tokens")
    private boolean includeTokens = true;

    @JsonProperty("correct_spelling")
    private boolean correctSpelling = true;

    @JsonProperty("concept_types")
    private List<String> conceptTypes = Collections.singletonList("symptom");

    public richiestaParseDTO(String text, int ageValue, String sex) {
        this.text = text;
        this.age = new Age(ageValue);
        this.sex = sex;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Age {
        private int value;
        private String unit = "year";

        public Age(int value) { this.value = value; }
    }
}
