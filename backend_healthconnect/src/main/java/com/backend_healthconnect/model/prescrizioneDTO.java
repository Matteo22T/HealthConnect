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
public class prescrizioneDTO {
    private Long id;
    private visitaDTO visita;
    private String nome_farmaco;
    private String dosaggio;
    private LocalDate dataEmissione;
    private LocalDate dataFine;

}
