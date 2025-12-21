package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.ChatMessaggioDTO;
import com.backend_healthconnect.model.MedicoDTO;

import java.util.List;

public interface ChatDAO {
    List<ChatMessaggioDTO> getStoricoChat(Long utente1, Long utente2);
    List<MedicoDTO> getMediciConChat(Long mioId);
    boolean salvaMessaggio(ChatMessaggioDTO messaggio);
}