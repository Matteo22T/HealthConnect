package com.backend_healthconnect.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class metricheSaluteDTO {
    private Long id;
    private utenteDTO paziente;
    private utenteDTO medico;
    private TipoMetrica tipoMetrica;
    private Double valore;
    private String unità_misura;
    private LocalDateTime data;
}
