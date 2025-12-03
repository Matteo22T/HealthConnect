package com.backend_healthconnect.model;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class utenteDTO {
    private Long id;
    private String nome;
    private String cognome;
    private String email;
    private String password;
    private Long telefono;
    private LocalDate dataNascita;
    private Ruolo ruolo;
    private LocalDate dataCreazione;
}
