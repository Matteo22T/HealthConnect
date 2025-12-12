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

    public List<prescrizioneDTO> getPrescrizioniPaziente(Long id){
        return prescrizioneDAO.getPrescrizioniPaziente(id);
    }

    public List<prescrizioneDTO> getAllPrescrizioni(Long id){
        return prescrizioneDAO.getAllPrescrizioniPaziente(id);
    }

}
