package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.utenteDTO;

public interface utenteDAO {

    utenteDTO getUtenteById (Long id);


    utenteDTO getUtenteByEmail(String email);
}
