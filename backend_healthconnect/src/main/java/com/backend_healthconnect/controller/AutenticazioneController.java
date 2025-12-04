package com.backend_healthconnect.controller;

import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.service.AutenticazioneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AutenticazioneController {

    @Autowired
    private AutenticazioneService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody utenteDTO utente) {
        try {
            authService.registraUtente(utente);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Utente registrato con successo"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Errore generico");
        }
    }

    @GetMapping("/check")
    public ResponseEntity<utenteDTO> checkAuth(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            utenteDTO u = this.authService.getUtenteByEmail(authentication.getName());
            return ResponseEntity.ok(u);
        }
        return ResponseEntity.status(401).build();
    }


}
