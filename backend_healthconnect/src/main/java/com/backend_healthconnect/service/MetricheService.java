package com.backend_healthconnect.service;

import com.backend_healthconnect.dao.metricheSaluteDAO;
import com.backend_healthconnect.model.metricheSaluteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MetricheService {

    @Autowired
    private metricheSaluteDAO metricheDAO;

    public List<metricheSaluteDTO> getMetrichePazienteUltimi6Mesi(Long pazienteId) {
        return metricheDAO.findByPazienteIdUltimi6Mesi(pazienteId);
    }

    public Boolean salvaNuovaMetrica(metricheSaluteDTO metrica){
        return metricheDAO.salvaNuovaMetrica(metrica);
    }
}