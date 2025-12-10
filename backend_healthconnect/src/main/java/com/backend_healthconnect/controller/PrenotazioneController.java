package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.prenotazioneDTO;
import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.service.PrenotazioneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prenotazioni")
@CrossOrigin(origins = "http://localhost:4200")
public class PrenotazioneController {

    @Autowired
    private PrenotazioneService prenotazioneService;

    @GetMapping("/medico/{id}")
    public ResponseEntity<?> getPrenotazioniInAttesaMedico(@PathVariable Long id) {
        List<prenotazioneDTO> prenotazioniInAttesa = prenotazioneService.getPrenotazioniInAttesaByMedico(id);
        if (prenotazioniInAttesa == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(prenotazioniInAttesa);
    }

    @PatchMapping("/accetta/{id}")
    public ResponseEntity<Boolean> accettaPrenotazione(@PathVariable Long id){
        boolean risultato = prenotazioneService.accettaPrenotazione(id);
        System.out.println(risultato);
        if (risultato) return ResponseEntity.ok(risultato);
        else return ResponseEntity.notFound().build();
    }

    @PatchMapping("/rifiuta/{id}")
    public ResponseEntity<?> rifiutaPrenotazione(@PathVariable Long id){
        boolean risultato = prenotazioneService.rifiutaPrenotazione(id);
        if (risultato) return ResponseEntity.ok(risultato);
        else return ResponseEntity.notFound().build();
    }



}
