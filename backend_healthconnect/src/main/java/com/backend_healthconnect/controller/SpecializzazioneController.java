package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.specializzazioneDTO;
import com.backend_healthconnect.service.SpecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specializzazioni")
@CrossOrigin(origins = "http://localhost:4200")
public class SpecializzazioneController {
    @Autowired
    private SpecService specService;

    @GetMapping("/{id}")
    public ResponseEntity<specializzazioneDTO> getSpecializzazioneById(@PathVariable Long id){
        specializzazioneDTO spec = specService.getSpecializzazioneById(id);
        if (spec != null) return ResponseEntity.ok(spec);
        else return ResponseEntity.notFound().build();
    }

    @GetMapping("/admin/all-spec")
    public ResponseEntity<List<specializzazioneDTO>> getAllSpecializzazioni(){
        return ResponseEntity.ok(specService.getAllSpecializzazioni());
    }

    @PostMapping("/admin/aggiungi/{nomeSpec}")
    public ResponseEntity<Boolean> aggiungiSpecializzazione(@PathVariable String nomeSpec){
        return ResponseEntity.ok(specService.salvaSpecializzazione(nomeSpec));
    }
}
