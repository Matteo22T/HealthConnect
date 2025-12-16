package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.postgres.RicercaMediciDAO;
import com.backend_healthconnect.model.MedicoCardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RicercaMedici {

    @Autowired
    private RicercaMediciDAO ricercaMediciDAO; // Si collega al DAO

    public List<MedicoCardDTO> eseguiRicerca(String query) {
        // Passa la richiesta al DAO
        return ricercaMediciDAO.executeRicerca(query);
    }
}