package com.backend_healthconnect.service;


import com.backend_healthconnect.dao.prenotazioneDAO;
import com.backend_healthconnect.model.prenotazioneDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrenotazioneService {

    @Autowired
    private prenotazioneDAO prenotazioneDAO;

    public List<prenotazioneDTO> getPrenotazioniInAttesaByMedico(Long id){
        System.out.println(id);
        return prenotazioneDAO.getPrenotazioniInAttesaByMedico(id);
    }
}
