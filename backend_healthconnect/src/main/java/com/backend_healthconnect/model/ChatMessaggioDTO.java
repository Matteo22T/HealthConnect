package com.backend_healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessaggioDTO {
    private Long id;
    private Long mittente_id;
    private Long destinatario_id;
    private String testo;
    private LocalDateTime data_invio;
    private boolean letto;
}