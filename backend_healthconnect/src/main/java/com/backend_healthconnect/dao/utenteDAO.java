package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.utenteDTO;

import java.util.List;

public interface utenteDAO {

    utenteDTO getUtenteById (Long id);
    utenteDTO getUtenteByEmail(String email);
    utenteDTO save(utenteDTO utente);
}
