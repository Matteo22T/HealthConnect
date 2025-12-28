package com.backend_healthconnect.service;


import com.backend_healthconnect.dao.messaggioDAO;
import com.backend_healthconnect.dao.prenotazioneDAO;
import com.backend_healthconnect.dao.visitaDAO;
import com.backend_healthconnect.model.prenotazioneDTO;
import com.backend_healthconnect.model.utenteDTO;
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
    private UtenteService utenteService;

    @Autowired
    public PrenotazioneService(prenotazioneDAO prenotazioneRepository, NotificaService notificaService, UtenteService utenteService) {
        this.prenotazioneDAO = prenotazioneRepository;
        this.notificaService = notificaService;
        this.utenteService = utenteService;
    }

    public List<prenotazioneDTO> getPrenotazioniInAttesaByMedico(Long id){
        System.out.println(id);
        return prenotazioneDAO.getPrenotazioniInAttesaByMedico(id);
    }

    public List<prenotazioneDTO> getPrenotazioniInAttesaByPaziente(Long id){
        return prenotazioneDAO.getPrenotazioniInAttesaByPaziente(id);
    }

    public List<prenotazioneDTO> getPrenotazioniRifiutateByPaziente(Long id){
        return prenotazioneDAO.getPrenotazioniRifiutateByPaziente(id);
    }

    public boolean accettaPrenotazione(Long id){
        prenotazioneDTO pren = prenotazioneDAO.accettaPrenotazione(id);
        if (notificaService.getImpostazioniNotifiche(pren.getPaziente().getId()).isNotificheEmail()){
            String oggetto = "Richiesta Prenotazione - HealthConnect";
            String testo = "Salve, la sua richiesta di appuntamento per il " + "Dott." + pren.getMedico().getCognome() + "\n\n" +
                    "in data" + pren.getDataVisita() + "è stata accettata."+
                    "\n\n" +
                    "Accedi alla piattaforma per gestire la richiesta.";

            notificaService.inviaEmail(pren.getPaziente().getEmail(), oggetto, testo);
        }
        return visitaDAO.creaVisita(pren) && messaggioDAO.inviaMessaggio(pren.getMedico().getId(), pren.getPaziente().getId(), "Grazie per avermi scelto, per qualsiasi dubbio sono a sua completa disposizione!");
    }

    public boolean rifiutaPrenotazione(Long id) { return prenotazioneDAO.rifiutaPrenotazione(id);
    }

    public boolean creaPrenotazione(prenotazioneDTO prenotazione) {
        boolean salvato = prenotazioneDAO.salvaPrenotazione(prenotazione);
        if (salvato) {
            try {
                utenteDTO medico = utenteService.getUtenteById(prenotazione.getMedico().getId());
                utenteDTO paziente = utenteService.getUtenteById(prenotazione.getPaziente().getId());
                if (notificaService.getImpostazioniNotifiche(medico.getId()).isNotificheEmail() && paziente != null) {
                    String oggetto = "Nuova Richiesta Appuntamento - HealthConnect";
                    String testo = "Ciao Dott. " + medico.getCognome() + ",\n\n" + "Hai ricevuto una richiesta da: " +
                            paziente.getNome() + " " + paziente.getCognome() + ".\n" + "Motivo: " + prenotazione.getMotivo() +
                            "\n\n" +
                            "Accedi alla piattaforma per gestire la richiesta.";

                        notificaService.inviaEmail(medico.getEmail(), oggetto, testo);
                }
            } catch (Exception e) {
                System.err.println("Errore nell'invio della notifica (ma la prenotazione è salvata): " + e.getMessage());
            }
        }
        return salvato;
    }
}
