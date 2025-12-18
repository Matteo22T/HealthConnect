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
            @RequestParam(name = "search", required = false) String query,
            // 👇 Aggiungi questo parametro per catturare la scelta della dropdown
            @RequestParam(name = "spec", required = false) String spec
    ) {
        // Gestione sicura dei null
        String safeQuery = (query == null || query.equals("undefined")) ? "" : query;

        // Se spec è null o "Tutte", passiamo stringa vuota
        String safeSpec = (spec == null || spec.equals("undefined") || spec.equals("Tutte")) ? "" : spec;

        return ricercaMedici.eseguiRicerca(safeQuery, safeSpec);
    }
}