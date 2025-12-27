package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.medicoCardDTO;
import com.backend_healthconnect.model.MedicoDTO;
import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.service.RicercaMediciService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medici")
public class MedicoController {

    @Autowired
    private RicercaMediciService ricercaMediciService;

    @GetMapping("/trova")
    public List<medicoCardDTO> trovaMedici(
            @RequestParam(name = "search", required = false) String query,
            @RequestParam(name = "spec", required = false) String spec
    ) {
        // Gestione sicura dei null
        String safeQuery = (query == null || query.equals("undefined")) ? "" : query;

        // Se spec è null o "Tutte", passiamo stringa vuota
        String safeSpec = (spec == null || spec.equals("undefined") || spec.equals("Tutte")) ? "" : spec;

        return ricercaMediciService.eseguiRicerca(safeQuery, safeSpec);
    }
    @GetMapping("/{id}")
    public ResponseEntity<MedicoDTO> getMedicoById(@PathVariable Long id) {
        MedicoDTO medico = ricercaMediciService.trovaPerId(id);

        if (medico != null) {
            return ResponseEntity.ok(medico);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}