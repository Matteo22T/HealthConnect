package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.medicoDAO;
import com.backend_healthconnect.model.medicoCardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RicercaMedici {

    @Autowired
    private medicoDAO medicoDao;

    public List<medicoCardDTO> eseguiRicerca(String query, String specializzazione) {
        return medicoDao.getMediciPerCard(query, specializzazione);
    }
}