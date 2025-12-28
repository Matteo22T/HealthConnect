package com.backend_healthconnect.controller;


import com.backend_healthconnect.model.ImpostazioniNotificheDTO;
import com.backend_healthconnect.service.NotificaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/utenti")
@CrossOrigin(origins = "http://localhost:4200")
public class ImpostazioniController {

    @Autowired
    private NotificaService impostazioniDAO;

    @PutMapping("/impostazioni/aggiorna/{id}")
    public ResponseEntity<Boolean> aggiornaImpostazioni(@PathVariable Long id) {
        boolean successo = impostazioniDAO.AggiornaNotificheEmail(id);

        if (successo) {
            ImpostazioniNotificheDTO nuoveImpostazioni = impostazioniDAO.getImpostazioniNotifiche(id);
            return ResponseEntity.ok(nuoveImpostazioni.isNotificheEmail());
        } else {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/impostazioni/notifiche/{id}")
    public ResponseEntity<?> getImpostazioniNotifiche(@PathVariable Long id){
        ImpostazioniNotificheDTO impostazioni = impostazioniDAO.getImpostazioniNotifiche(id);
        if (impostazioni != null) return ResponseEntity.ok(impostazioni);
        else return ResponseEntity.notFound().build();
    }
}