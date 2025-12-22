package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.specializzazioneDTO;

import java.util.List;

public interface specializzazioneDAO {
    specializzazioneDTO getSpecializzazioneById(Long id);

    List<specializzazioneDTO> getSpecializzazioniAll();

    boolean salvaSpecializzazione(String nome);
}
