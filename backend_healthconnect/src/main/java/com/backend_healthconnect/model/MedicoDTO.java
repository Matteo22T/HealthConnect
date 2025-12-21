package com.backend_healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicoDTO {
    private Long id;
    private String nome;
    private String cognome;
    private String specializzazione; // Al frontend mandiamo il testo (es. "Cardiologia")
}