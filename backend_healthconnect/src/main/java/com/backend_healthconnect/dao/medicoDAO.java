package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.StatoApprovazione;

public interface medicoDAO {
    void save(Long idUtente, Long specializzazione, String numeroAlbo, String biografia, String indirizzo_studio, StatoApprovazione stato_approvazione);
}
