package com.backend_healthconnect.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class richiestaDiagnosisDTO {
    private String sex;
    private richiestaParseDTO.Age age;
    private List<Evidence> evidence;
    private Object extras;

    public richiestaDiagnosisDTO(String sex, richiestaParseDTO.Age age, List<Evidence> evidence) {
        this.sex = sex;
        this.age = age;
        this.evidence = evidence;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Evidence {
        @JsonProperty("id")
        private String id;        // Es: "s_21"

        @JsonProperty("choice_id")
        private String choiceId;  // Es: "present"

        @JsonProperty("source")
        private String source;    // Es: "initial"
    }

    @Data
    public static class Extras {
        @JsonProperty("disable_groups")
        private boolean disableGroups = true;
    }
}
