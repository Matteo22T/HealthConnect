package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/utenti")
@CrossOrigin(origins = "http://localhost:4200")
public class UtenteController {
    @Autowired
    UtenteService utenteService;

    @GetMapping("/{id}")
    public ResponseEntity<utenteDTO> getUtenteById(@PathVariable Long id){
        utenteDTO utente = utenteService.getUtenteById(id);
        if (utente != null) return ResponseEntity.ok(utente);
        else return ResponseEntity.notFound().build();
    }
}
