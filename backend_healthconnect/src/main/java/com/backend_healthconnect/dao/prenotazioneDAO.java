package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.prenotazioneDTO;

import java.util.List;

public interface prenotazioneDAO {
    List<prenotazioneDTO> getPrenotazioniInAttesaByMedico(Long id);
    prenotazioneDTO getPrenotazioneById(Long id);
}
