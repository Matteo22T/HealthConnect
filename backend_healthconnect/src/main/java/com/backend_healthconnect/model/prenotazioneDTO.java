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
public class prenotazioneDTO {
    private Long id;
    private utenteDTO paziente;
    private utenteDTO medico;
    private LocalDateTime dataVisita;
    private StatoPrenotazione stato;
    private String motivo;
}
