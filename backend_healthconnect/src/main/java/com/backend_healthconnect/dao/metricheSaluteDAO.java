
package com.backend_healthconnect.dao;

import com.backend_healthconnect.model.TipoMetrica;
import com.backend_healthconnect.model.metricheSaluteDTO;

import java.util.List;
import java.util.Map;

public interface metricheSaluteDAO {
    List<metricheSaluteDTO> findByPazienteId(Long pazienteId);
    List<metricheSaluteDTO> findByPazienteIdUltimi6Mesi(Long pazienteId);
    List<metricheSaluteDTO> findByPazienteIdAndTipo(Long pazienteId, TipoMetrica tipoMetrica);
    Map<String, Object> getStatisticheMetriche(Long pazienteId);
}