package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtenteService {

    @Autowired
    private utenteDAO utenteDAO;

    public utenteDTO getUtenteById(Long id){
        return utenteDAO.getUtenteById(id);
    }

    public List<utenteDTO> getUtentiAll() {return utenteDAO.getUtentiAll();}

    public boolean approvaMedico(Long id){ return utenteDAO.approvaMedico(id); }

    public boolean rifiutaMedico(Long id){ return utenteDAO.rifiutaMedico(id); }

}
