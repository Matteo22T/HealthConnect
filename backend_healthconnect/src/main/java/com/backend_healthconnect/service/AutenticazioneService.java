package com.backend_healthconnect.service;


import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticazioneService {

    @Autowired
    private utenteDAO utenteDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public utenteDTO login(String email, String password){

        if (email == null || email.trim().isEmpty() || password == null || password.isEmpty()){
            return null;
        }

        utenteDTO utente = utenteDAO.getUtenteByEmail(email.trim());

        if (utente == null){
            return null;
        }

        if (!passwordEncoder.matches(password, utente.getPassword())){
            return null;
        }

        utente.setPassword(null);

        return utente;

    }


}
