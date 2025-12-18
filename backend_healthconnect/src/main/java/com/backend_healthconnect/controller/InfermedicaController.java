package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.InputUtenteDTO;
import com.backend_healthconnect.model.erroreDiagnosisDTO;
import com.backend_healthconnect.model.richiestaDiagnosisDTO;
import com.backend_healthconnect.service.InfermedicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/infermedica")
@CrossOrigin(origins = "http://localhost:4200")
public class InfermedicaController {
    @Autowired
    private InfermedicaService infermedicaService;

    @PostMapping("/diagnosis")
    public ResponseEntity<?> inizioDiagnosi(@RequestBody InputUtenteDTO inputUtenteDTO) {
        Object result = infermedicaService.ottieniParseSintomi(inputUtenteDTO.getText(), inputUtenteDTO.getSex(), inputUtenteDTO.getAge());
        if (result instanceof erroreDiagnosisDTO) {
            return ResponseEntity
                    .badRequest()
                    .body(result);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/diagnosis/update")
    public ResponseEntity<?> updateDiagnosis(@RequestBody richiestaDiagnosisDTO request) {

        Object result = infermedicaService.aggiornaDiagnosis(request);

        if (result instanceof erroreDiagnosisDTO) {
            return ResponseEntity.badRequest().body(result);
        }

        return ResponseEntity.ok(result);
    }
}
