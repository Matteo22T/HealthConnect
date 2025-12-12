package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.prenotazioneDTO;
import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.model.visitaDTO;
import com.backend_healthconnect.model.visitaDettaglioDTO;

import java.util.List;

public interface visitaDAO {
    List<visitaDTO> getVisiteOdierneByMedico(Long id);

    visitaDTO getVisitaById(Long id);

    List<visitaDTO> getVisiteFutureByPaziente(Long id);

    List<utenteDTO> getListaPazientiMedico(Long id);
    boolean creaVisita(prenotazioneDTO prenotazione);

    List<utenteDTO> getListaMediciPaziente(Long id);

    List<visitaDettaglioDTO> getVisitePassatePazienteByMedico(Long idPaziente, Long idMedico);
}
