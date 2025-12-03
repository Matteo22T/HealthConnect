package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.utenteDTO;
import com.backend_healthconnect.service.AutenticazioneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AutenticazioneController {

    @Autowired
    private AutenticazioneService authService;

    @PostMapping("/login")
    public utenteDTO login(@RequestBody utenteDTO utente){
        return authService.login(utente.getEmail(), utente.getPassword());
    }



}
