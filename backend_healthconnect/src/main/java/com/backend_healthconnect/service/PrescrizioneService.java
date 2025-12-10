package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.prescrizioneDAO;
import com.backend_healthconnect.model.prescrizioneDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescrizioneService {

    @Autowired
    private prescrizioneDAO prescrizioneDAO;

    public List<prescrizioneDTO> getPrescrizioniByVisita(Long id){
        return prescrizioneDAO.getPrescrizioniByVisita(id);
    }

}
