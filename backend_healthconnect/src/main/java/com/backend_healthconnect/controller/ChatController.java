package com.backend_healthconnect.controller;

import com.backend_healthconnect.dao.ChatDAO;
import com.backend_healthconnect.model.ChatMessaggioDTO;
import com.backend_healthconnect.model.MedicoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat") // Nuovo endpoint specifico
@CrossOrigin(origins = "http://localhost:4200")
public class ChatController {

    @Autowired
    private ChatDAO chatDAO;

    // GET: /api/chat/storia/1/5 (Legge la chat tra me (1) e il medico (5))
    @GetMapping("/storia/{idMio}/{idAltro}")
    public ResponseEntity<List<ChatMessaggioDTO>> getStoria(@PathVariable Long idMio, @PathVariable Long idAltro) {
        List<ChatMessaggioDTO> messaggi = chatDAO.getStoricoChat(idMio, idAltro);
        return ResponseEntity.ok(messaggi);
    }

    @GetMapping("/contatti/{idMio}")
    public ResponseEntity<List<MedicoDTO>> getContatti(@PathVariable Long idMio) {
        return ResponseEntity.ok(chatDAO.getMediciConChat(idMio));
    }

    // POST: /api/chat/invia (Invia un messaggio)
    @PostMapping("/invia")
    public ResponseEntity<?> inviaMessaggio(@RequestBody ChatMessaggioDTO messaggio) {
        boolean successo = chatDAO.salvaMessaggio(messaggio);

        if (successo) {
            return ResponseEntity.ok("Messaggio inviato");
        } else {
            return ResponseEntity.status(500).body("Errore invio messaggio");
        }
    }
}