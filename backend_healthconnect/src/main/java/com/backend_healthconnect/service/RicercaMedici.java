package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.postgres.RicercaMediciDAO;
import com.backend_healthconnect.model.MedicoCardDTO;
import com.backend_healthconnect.model.MedicoDTO; // 👈 FONDAMENTALE
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource; // 👈 Serve per il Database
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;

@Service
public class RicercaMedici {

    @Autowired
    private RicercaMediciDAO ricercaMediciDAO;

    @Autowired
    private DataSource dataSource; // 👈 AGGIUNTO: Ci serve per fare la query diretta

    // Questo metodo esisteva già e lo lasciamo uguale (chiama il DAO)
    public List<MedicoCardDTO> eseguiRicerca(String query, String specializzazione) {
        return ricercaMediciDAO.executeRicerca(query, specializzazione);
    }
    
    public MedicoDTO trovaPerId(Long id) {
        return ricercaMediciDAO.getMedicoById(id);
    }
}