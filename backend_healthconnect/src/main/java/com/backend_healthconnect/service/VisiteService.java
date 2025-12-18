package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.specializzazioneDAO;
import com.backend_healthconnect.dao.visitaDAO;
import com.backend_healthconnect.model.specializzazioneDTO;
import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.model.visitaDTO;
import com.backend_healthconnect.model.visitaDettaglioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisiteService {

    @Autowired
    private visitaDAO visitaDAO;

    public List<visitaDTO> getListaVisiteOdierne(Long id){
        return visitaDAO.getVisiteOdierneByMedico(id);
    }

    public List<utenteDTO> getListaPazientiVisiteMedico(Long id){ return visitaDAO.getListaPazientiMedico(id); }

    public int getNumeroPazientiMedico(Long id){ return visitaDAO.getNumeroPazientiMedico(id); }

    public List<utenteDTO> getListaMediciPaziente(Long id){
        return visitaDAO.getListaMediciPaziente(id);
    }

    public List<visitaDTO> getVisiteFutureByPaziente(Long id){ return visitaDAO.getVisiteFutureByPaziente(id); }

    public List<visitaDettaglioDTO> getVisitePassatePazienteByMedico(Long idPaziente, Long idMedico){ return visitaDAO.getVisitePassatePazienteByMedico(idPaziente,idMedico); }

    public visitaDettaglioDTO getVisitaById(Long id){
        return this.visitaDAO.getVisitaById(id);
    }

    public Boolean salvaVisita(Long id, visitaDettaglioDTO visita){
        return this.visitaDAO.salvaVisita(id,visita);
    }

    public List<visitaDTO> getStoricoVisite(Long id){
        return visitaDAO.getStoricoVisitePaziente(id);
    }

    public List<visitaDTO> getVisiteByMedico(Long id){ return visitaDAO.getVisiteByMedico(id); }
}
