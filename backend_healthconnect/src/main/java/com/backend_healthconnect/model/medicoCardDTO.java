package com.backend_healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class medicoCardDTO {
    private Long id;
    private String nome;
    private String cognome;
    private String specializzazione;
    private String indirizzo;
}