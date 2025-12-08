package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.specializzazioneDAO;
import com.backend_healthconnect.model.specializzazioneDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SpecService {

    @Autowired
    private specializzazioneDAO specializzazioneDAO;

    public specializzazioneDTO getSpecializzazioneById(Long id){
        return specializzazioneDAO.getSpecializzazioneById(id);
    }
}
