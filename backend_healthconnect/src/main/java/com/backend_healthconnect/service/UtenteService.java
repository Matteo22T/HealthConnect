package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UtenteService {

    @Autowired
    private utenteDAO utenteDAO;

    public utenteDTO getUtenteById(Long id){
        return utenteDAO.getUtenteById(id);
    }

}
