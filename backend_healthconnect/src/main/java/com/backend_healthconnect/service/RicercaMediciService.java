package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.medicoDAO;
import com.backend_healthconnect.model.MedicoDTO;
import com.backend_healthconnect.model.medicoCardDTO;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RicercaMediciService {

    @Autowired
    private medicoDAO medicoDao;

    public List<utenteDTO> eseguiRicerca(String query, String specializzazione) {
        return medicoDao.getMediciPerCard(query, specializzazione);
    }

    public utenteDTO trovaPerId(Long id){
        return medicoDao.getMedicoById(id);
    }

}