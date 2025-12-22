package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.service.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/admin/all")
    public ResponseEntity<List<utenteDTO>> getUtentiAll(){
        List<utenteDTO> utenti = utenteService.getUtentiAll();
        if (utenti != null) return ResponseEntity.ok(utenti);
        else return ResponseEntity.notFound().build();
    }

    @PutMapping("/admin/approva-medico/{id}")
    public ResponseEntity<Boolean> approvaMedico(@PathVariable Long id){
        boolean esito = utenteService.approvaMedico(id);
        if (esito) return ResponseEntity.ok(esito);
        else return ResponseEntity.notFound().build();
    }

    @PutMapping("/admin/rifiuta-medico/{id}")
    public ResponseEntity<Boolean> rifiutaMedico(@PathVariable Long id){
        boolean esito = utenteService.rifiutaMedico(id);
        if (esito) return ResponseEntity.ok(esito);
        else return ResponseEntity.notFound().build();
    }


}
