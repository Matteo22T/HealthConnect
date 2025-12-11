package com.backend_healthconnect.controller;

import com.backend_healthconnect.dao.metricheSaluteDAO;
import com.backend_healthconnect.model.metricheSaluteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/metriche-salute")
@CrossOrigin(origins = "http://localhost:4200")
public class MetricheSaluteController {

    @Autowired
    private metricheSaluteDAO metricheSaluteDAO;

    @GetMapping("/paziente/{pazienteId}")
    public ResponseEntity<List<metricheSaluteDTO>> getMetrichePaziente(
            @PathVariable Long pazienteId) {

        try {
            List<metricheSaluteDTO> metriche = metricheSaluteDAO.findByPazienteId(pazienteId);
            return ResponseEntity.ok(metriche);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/paziente/{pazienteId}/ultimi-6-mesi")
    public ResponseEntity<List<metricheSaluteDTO>> getMetricheUltimi6Mesi(
            @PathVariable Long pazienteId) {

        try {
            List<metricheSaluteDTO> metriche = metricheSaluteDAO.findByPazienteIdUltimi6Mesi(pazienteId);
            return ResponseEntity.ok(metriche);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


}