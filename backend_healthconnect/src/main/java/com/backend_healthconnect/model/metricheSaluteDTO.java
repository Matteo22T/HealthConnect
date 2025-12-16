package com.backend_healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class metricheSaluteDTO {
    private Long id;
    private utenteDTO paziente;
    private utenteDTO medico;
    private TipoMetrica tipoMetrica;
    private Double valore;
    private String unità_misura;
    private LocalDate data;
}
