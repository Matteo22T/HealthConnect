package com.backend_healthconnect.model;

import com.backend_healthconnect.dao.prescrizioneDAO;

import java.util.List;

public class visitaDTOProxy extends visitaDettaglioDTO{
    private final prescrizioneDAO prescrizioneDAO;

    public visitaDTOProxy(prescrizioneDAO prescrizioneDAO) {
        this.prescrizioneDAO = prescrizioneDAO;
    }

    @Override
    public List<prescrizioneDTO> getPrescrizioni() {
        List<prescrizioneDTO> prescrizioni = super.getPrescrizioni();

        if (prescrizioni == null) {
            prescrizioni = prescrizioneDAO.getPrescrizioniByVisita(getId());
            super.setPrescrizioni(prescrizioni);
        }
        return prescrizioni;
    }
}
