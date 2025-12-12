package com.backend_healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class rispostaAiDTO {
    private String risposta;
    private String azioneSuggerita;
}
