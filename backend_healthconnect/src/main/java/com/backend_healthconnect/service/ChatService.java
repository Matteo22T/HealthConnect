package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.ChatDAO;
import com.backend_healthconnect.model.ChatMessaggioDTO;
import com.backend_healthconnect.model.MedicoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatDAO chatDAO;

    public List<ChatMessaggioDTO> getStoricoChat(Long idMio, Long idAltro){
        return chatDAO.getStoricoChat(idMio, idAltro);
    }

    public boolean inviaMessaggio(ChatMessaggioDTO messaggio){
        return chatDAO.salvaMessaggio(messaggio);
    }

    public List<MedicoDTO> getContatti(Long mioId) {
        return chatDAO.getContatti(mioId);
    }
}
