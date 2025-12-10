package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.specializzazioneDAO;
import com.backend_healthconnect.dao.visitaDAO;
import com.backend_healthconnect.model.specializzazioneDTO;
import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.model.visitaDTO;
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

<<<<<<< HEAD
    public visitaDTO getVisitaById(Long id){
        return visitaDAO.getVisitaById(id);
    }

    public List<visitaDTO> getVisiteByPaziente(Long id){
        return visitaDAO.getVisiteByPaziente(id);
    }
=======
    public List<utenteDTO> getListaPazientiVisiteMedico(Long id){ return visitaDAO.getListaPazientiMedico(id); }
>>>>>>> home_medico
}
