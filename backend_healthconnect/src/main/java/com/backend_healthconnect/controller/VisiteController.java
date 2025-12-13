package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.model.visitaDTO;
import com.backend_healthconnect.model.visitaDettaglioDTO;
import com.backend_healthconnect.service.VisiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visite")
@CrossOrigin(origins = "http://localhost:4200")

public class VisiteController {
    @Autowired
    private VisiteService visiteService;

    @GetMapping("/oggi/medici/{id}")
    public ResponseEntity<List<visitaDTO>> getVisiteOdierneMedico(@PathVariable Long id){
        List<visitaDTO> visite = visiteService.getListaVisiteOdierne(id);
        if (visite != null) return ResponseEntity.ok(visite);
        else return ResponseEntity.notFound().build();
    }

    @GetMapping("/pazienti/medici/{id}")
    public ResponseEntity<List<utenteDTO>> getListaPazientiMedico(@PathVariable Long id){
        List<utenteDTO> lista = visiteService.getListaPazientiVisiteMedico(id);
        if (lista != null) return ResponseEntity.ok(lista);
        else return ResponseEntity.notFound().build();
    }

    @GetMapping("/medici/paziente/{id}")
    public List<utenteDTO> getListaMediciPaziente(@PathVariable Long id){
        return visiteService.getListaMediciPaziente(id);
    }

    @GetMapping("/future/pazienti/{id}")
    public ResponseEntity<List<visitaDTO>> getVisiteFutureByPaziente(@PathVariable Long id){
        List<visitaDTO> lista = visiteService.getVisiteFutureByPaziente(id);
        if (lista != null) return ResponseEntity.ok(lista);
        else return ResponseEntity.notFound().build();
    }

    @GetMapping("/paziente/{id}/medico/{id_med}")
    public ResponseEntity<List<visitaDettaglioDTO>> getVisitePassatePazienteByMedico (@PathVariable("id") Long idPaziente, @PathVariable("id_med") Long idMedico){
        List<visitaDettaglioDTO> list = visiteService.getVisitePassatePazienteByMedico(idPaziente,idMedico);
        if (list != null) return ResponseEntity.ok(list);
        else return ResponseEntity.notFound().build();
    }

    @GetMapping("/medico/{id}")
    public ResponseEntity<visitaDettaglioDTO> getVisitaById(@PathVariable Long id){
        visitaDettaglioDTO visita = visiteService.getVisitaById(id);
        if (visita != null) return ResponseEntity.ok(visita);
        else return ResponseEntity.notFound().build();
    }

    @PutMapping("/medico/salva/{id}")
    public ResponseEntity<Boolean> salvaVisita(@PathVariable Long id, @RequestBody visitaDettaglioDTO visita){
        if (id == null || visita == null || !id.equals(visita.getId())) return ResponseEntity.badRequest().build();
        Boolean esito = visiteService.salvaVisita(id, visita);
        if (esito) return ResponseEntity.ok(esito);
        else return ResponseEntity.notFound().build();
    }
}
