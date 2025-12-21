package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.medicoDAO;
import com.backend_healthconnect.model.medicoCardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend_healthconnect.dao.postgres.RicercaMediciDAO;
import com.backend_healthconnect.model.MedicoDTO;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;

@Service
public class RicercaMedici {

    @Autowired
    private medicoDAO medicoDao;

    public List<medicoCardDTO> eseguiRicerca(String query, String specializzazione) {
        return medicoDao.getMediciPerCard(query, specializzazione);
    }

    public MedicoDTO trovaPerId(Long id) {
        return medicoDao.getMedicoById(id);
    }
}