package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.prenotazioneDTO;
import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.service.PrenotazioneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @GetMapping("/paziente/{id}")
    public ResponseEntity<?> getPrenotazioniInAttesaPaziente(@PathVariable Long id) {
        List<prenotazioneDTO> prenotazioniInAttesa = prenotazioneService.getPrenotazioniInAttesaByPaziente(id);
        if (prenotazioniInAttesa == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(prenotazioniInAttesa);
    }

    @GetMapping("/rifiutate/paziente/{id}")
    public ResponseEntity<?> getPrenotazioniRifiutatePaziente(@PathVariable Long id) {
        List<prenotazioneDTO> prenotazioniInAttesa = prenotazioneService.getPrenotazioniRifiutateByPaziente(id);
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

    @PostMapping("/crea")
    public ResponseEntity<?> creaPrenotazione(@RequestBody PrenotazioneRequest request) {
        try {
            prenotazioneDTO nuova = new prenotazioneDTO();
            utenteDTO paziente = new utenteDTO();
            paziente.setId(request.paziente_id);
            nuova.setPaziente(paziente);

            utenteDTO medico = new utenteDTO();
            medico.setId(request.medico_id);
            nuova.setMedico(medico);


            if (request.data_visita != null) {
                nuova.setDataVisita(LocalDateTime.parse(request.data_visita));
            }

            nuova.setMotivo(request.motivo);

            // Salviamo
            boolean esito = prenotazioneService.creaPrenotazione(nuova);

            if (esito) {
                return ResponseEntity.ok("Prenotazione creata con successo");
            } else {
                return ResponseEntity.status(500).body("Errore nel salvataggio");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Errore nei dati inviati: " + e.getMessage());
        }
    }

    static class PrenotazioneRequest {
        public Long paziente_id;
        public Long medico_id;
        public String data_visita;
        public String motivo;
    }


}
