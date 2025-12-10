package com.backend_healthconnect.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class recensioneDTO {
    private Long id;
    private utenteDTO medico;
    private utenteDTO paziente;
    private Integer voto;
    private String commento;
    private LocalDateTime data;
}
