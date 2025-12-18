package com.backend_healthconnect.model; // Nota: package model

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicoCardDTO {
    private Long id;
    private String nome;
    private String cognome;
    private String specializzazione; // Per ora passiamo l'ID o la stringa se fai la join
    private String indirizzo;
}