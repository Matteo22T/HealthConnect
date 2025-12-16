package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.MedicoCardDTO;
import com.backend_healthconnect.service.RicercaMedici; // Importa il nuovo Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medici")
@CrossOrigin(origins = "http://localhost:4200")
public class MedicoController {

    @Autowired
    private RicercaMedici ricercaMedici; // Injection del Service rinominato

    @GetMapping("/trova")
    public ResponseEntity<List<MedicoCardDTO>> getMedici(@RequestParam(required = false) String search) {
        // Chiama il metodo del service "RicercaMedici"
        return ResponseEntity.ok(ricercaMedici.eseguiRicerca(search));
    }
}