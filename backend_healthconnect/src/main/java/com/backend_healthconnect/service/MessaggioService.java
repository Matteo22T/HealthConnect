package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.messaggioDAO;
import com.backend_healthconnect.model.messaggioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessaggioService {
    @Autowired
    private messaggioDAO messaggioDAO;

    public List<messaggioDTO> getMessaggiNonLettiById(Long id){
        return this.messaggioDAO.getMessaggiNonLettiById(id);
    }
}
