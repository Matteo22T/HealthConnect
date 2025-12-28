package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.ImpostazioniNotificheDTO;

public interface ImpostazioniDAO {
    boolean AggiornaNotificheEmail(Long id);
    ImpostazioniNotificheDTO getImpostazioniNotifiche(Long id);
}