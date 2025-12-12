package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.richiestaAiDTO;
import com.backend_healthconnect.model.rispostaAiDTO;
import com.backend_healthconnect.service.AssistenteAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AssistenteAiController {

    @Autowired
    private AssistenteAiService aiService;

    @PostMapping("/supporto")
    public ResponseEntity<rispostaAiDTO> chiediSupporto(@RequestBody richiestaAiDTO richiesta){
        rispostaAiDTO risposta = aiService.generaRisposta(richiesta.getTestoUtente());
        return ResponseEntity.ok(risposta);
    }

}
