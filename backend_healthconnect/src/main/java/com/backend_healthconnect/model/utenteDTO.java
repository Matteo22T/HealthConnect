package com.backend_healthconnect.model;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private String sesso;

    //attributi dettaglio medico
    private Long specializzazione_id;
    private String numero_albo;
    private String biografia;
    private String indirizzo_studio;
    private StatoApprovazione stato_approvazione;
}
