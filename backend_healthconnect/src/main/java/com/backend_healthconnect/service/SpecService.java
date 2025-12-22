package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.specializzazioneDAO;
import com.backend_healthconnect.model.specializzazioneDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecService {

    @Autowired
    private specializzazioneDAO specializzazioneDAO;

    public specializzazioneDTO getSpecializzazioneById(Long id){
        return specializzazioneDAO.getSpecializzazioneById(id);
    }
    public List<specializzazioneDTO> getAllSpecializzazioni(){return specializzazioneDAO.getSpecializzazioniAll();}
    public boolean salvaSpecializzazione(String nome){return specializzazioneDAO.salvaSpecializzazione(nome);}
}
