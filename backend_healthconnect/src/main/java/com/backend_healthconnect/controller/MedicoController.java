package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.MedicoCardDTO;
import com.backend_healthconnect.service.RicercaMedici;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medici")
public class MedicoController {

    @Autowired
    private RicercaMedici ricercaMedici;

    @GetMapping("/trova")
    public List<MedicoCardDTO> trovaMedici(
            @RequestParam(name = "search", required = false) String query
    ) {
        // Gestione sicura del parametro vuoto o null
        if (query == null || query.trim().isEmpty() || query.equals("undefined")) {
            return ricercaMedici.eseguiRicerca("");
        }
        return ricercaMedici.eseguiRicerca(query);
    }
}