package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.prenotazioneDTO;
import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.model.visitaDTO;

import java.util.List;

public interface visitaDAO {
    List<visitaDTO> getVisiteOdierneByMedico(Long id);
    List<utenteDTO> getListaPazientiMedico(Long id);
    boolean creaVisita(prenotazioneDTO prenotazione);
}
