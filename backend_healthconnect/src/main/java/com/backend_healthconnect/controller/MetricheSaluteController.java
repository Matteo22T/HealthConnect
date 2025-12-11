package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.metricheSaluteDTO;
import com.backend_healthconnect.service.MetricheService;
import com.backend_healthconnect.service.MetricheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metriche-salute")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class MetricheSaluteController {

    @Autowired
    private MetricheService metricheService;

    @GetMapping("/paziente/{pazienteId}/ultimi-6-mesi")
    public ResponseEntity<List<metricheSaluteDTO>> getMetricheUltimi6Mesi(@PathVariable Long pazienteId) {
        List<metricheSaluteDTO> metriche = metricheService.getMetrichePazienteUltimi6Mesi(pazienteId);
        return ResponseEntity.ok(metriche);
    }
}