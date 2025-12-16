package com.backend_healthconnect.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class rispostaParseDTO {
    private List<Mention> mentions;


    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Mention {
        private String id;          // es: "s_13"
        private String name;        // es: "Abdominal pain"

        @JsonProperty("common_name")
        private String commonName;  // es: "Stomach pain"

        @JsonProperty("choice_id")
        private String choiceId;    // IMPORTANTE: "present" o "absent"

        private String type;        // es: "symptom"
    }
}
