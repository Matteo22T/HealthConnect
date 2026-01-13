package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.prenotazioneDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface prenotazioneDAO {
    List<prenotazioneDTO> getPrenotazioniInAttesaByMedico(Long id);
    prenotazioneDTO getPrenotazioneById(Long id);
    prenotazioneDTO accettaPrenotazione(Long id);
    boolean rifiutaPrenotazione(Long id);
    boolean salvaPrenotazione(prenotazioneDTO prenotazione);
    boolean orarioNonValido(LocalDateTime dataVisita, Long idPaziente);
    boolean orarioNonValidoMedico(Long id);
    List<prenotazioneDTO> getPrenotazioniInAttesaByPaziente(Long id);
    List<prenotazioneDTO> getPrenotazioniRifiutateByPaziente(Long id);
}
