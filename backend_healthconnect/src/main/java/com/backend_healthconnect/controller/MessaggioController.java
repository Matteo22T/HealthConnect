package com.backend_healthconnect.controller;

import com.backend_healthconnect.dao.messaggioDAO;
import com.backend_healthconnect.model.messaggioDTO;
import com.backend_healthconnect.service.MessaggioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messaggi")
@CrossOrigin(origins = "http://localhost:4200")
public class MessaggioController {

    @Autowired
    private MessaggioService messaggioService;

    @GetMapping("/nonletti/utenti/{id}")
    public ResponseEntity<List<messaggioDTO>> getMessaggiNonLettiById(@PathVariable Long id){
        List<messaggioDTO> messaggi = messaggioService.getMessaggiNonLettiById(id);
        if (messaggi != null) return ResponseEntity.ok(messaggi);
        else return ResponseEntity.notFound().build();
    }
}
