package com.backend_healthconnect.service;


import com.backend_healthconnect.dao.messaggioDAO;
import com.backend_healthconnect.dao.prenotazioneDAO;
import com.backend_healthconnect.dao.visitaDAO;
import com.backend_healthconnect.model.prenotazioneDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrenotazioneService {

    @Autowired
    private prenotazioneDAO prenotazioneDAO;

    @Autowired
    private visitaDAO visitaDAO;

    @Autowired
    private messaggioDAO messaggioDAO;

    @Autowired
    private NotificaService notificaService;

    @Autowired
    public PrenotazioneService(prenotazioneDAO prenotazioneRepository, NotificaService notificaService) {
        this.prenotazioneDAO = prenotazioneRepository;
        this.notificaService = notificaService;
    }

    public List<prenotazioneDTO> getPrenotazioniInAttesaByMedico(Long id){
        System.out.println(id);
        return prenotazioneDAO.getPrenotazioniInAttesaByMedico(id);
    }

    public boolean accettaPrenotazione(Long id){
        prenotazioneDTO pren = prenotazioneDAO.accettaPrenotazione(id);
        if (pren != null) return visitaDAO.creaVisita(pren) && messaggioDAO.inviaMessaggio(pren.getMedico().getId(), pren.getPaziente().getId(), "Grazie per avermi scelto, per qualsiasi dubbio sono a sua completa disposizione!");
        return false;
    }

    public boolean rifiutaPrenotazione(Long id) { return prenotazioneDAO.rifiutaPrenotazione(id);
    }
}
