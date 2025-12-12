package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.messaggioDTO;

import java.util.List;

public interface messaggioDAO {
    List<messaggioDTO> getMessaggiNonLettiById(Long id);
    boolean inviaMessaggio(Long idMittente, Long idDestinatario, String testo);
}
