package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.prescrizioneDTO;
import com.backend_healthconnect.service.PrescrizioneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescrizioni")
@CrossOrigin(origins = "http://localhost:4200")
public class PrescrizioneController {

    @Autowired
    private PrescrizioneService prescrizioneService;

    @GetMapping("/paziente/{id}")
    public List<prescrizioneDTO> getPrescrizioniPaziente(@PathVariable Long id){
        return prescrizioneService.getPrescrizioniPaziente(id);
    }
}
