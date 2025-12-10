package com.backend_healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class messaggioDTO {
    private Long id;
    private utenteDTO mittente;
    private utenteDTO destinatario;
    private String testo;
    private Boolean letto;
    private LocalDateTime dataInvio;
}
