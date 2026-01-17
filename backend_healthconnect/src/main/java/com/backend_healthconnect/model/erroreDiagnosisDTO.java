package com.backend_healthconnect.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

// DTO per rappresentare un errore di diagnosi con dettagli specifici sull'errore
public class erroreDiagnosisDTO {
    private List<Detail> detail;

    @Getter
    @Setter
    public static class Detail {
        private List<Object> loc;
        private String msg;
        private String type;
    }
}
