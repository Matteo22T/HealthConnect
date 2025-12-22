package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.prenotazioneDTO;
import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.model.visitaDTO;
import com.backend_healthconnect.model.visitaDettaglioDTO;

import java.util.List;

public interface visitaDAO {
    List<visitaDTO> getVisiteOdierneByMedico(Long id);
    List<visitaDTO> getVisiteByMedico(Long id);

    visitaDettaglioDTO getVisitaById(Long id);

    List<visitaDTO> getVisiteFutureByPaziente(Long id);

    List<utenteDTO> getListaPazientiMedico(Long id);
    List<visitaDTO> getListaVisiteMedicoSenzaDiagnosi(Long id);
    int getNumeroPazientiMedico(Long id);
    boolean creaVisita(prenotazioneDTO prenotazione);

    List<utenteDTO> getListaMediciPaziente(Long id);

    List<visitaDettaglioDTO> getVisitePassatePazienteByMedico(Long idPaziente, Long idMedico);

    Boolean salvaVisita(Long id, visitaDettaglioDTO visita);
    List<visitaDTO> getStoricoVisitePaziente(Long id);
    int getNumeroVisiteOdierne();
}
