package com.backend_healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class visitaDTO {
    Long id;
    prenotazioneDTO prenotazione;
    utenteDTO paziente;
    utenteDTO medico;
    String diagnosi;
    String noteMedico;
    LocalDateTime dataVisita;

}
