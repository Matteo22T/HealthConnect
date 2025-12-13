package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.prescrizioneDTO;

import java.util.List;

public interface prescrizioneDAO {
    List<prescrizioneDTO> getPrescrizioniPaziente(Long id);
    List<prescrizioneDTO> getPrescrizioniByVisita(Long id);
    Boolean aggiornaPrescrizioni(List<prescrizioneDTO> prescrizioni, Long idVisita);
}
