package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.MedicoDTO;
import com.backend_healthconnect.model.medicoCardDTO;
import com.backend_healthconnect.model.StatoApprovazione;

import java.util.List;

public interface medicoDAO {
    void save(Long idUtente, Long specializzazione, String numeroAlbo, String biografia, String indirizzo_studio, StatoApprovazione stato_approvazione);

    List<medicoCardDTO> getMediciPerCard(String ricerca, String specializzazione);

    MedicoDTO getMedicoById(Long id);
}
