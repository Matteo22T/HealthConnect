package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.metricheSaluteDAO;
import com.backend_healthconnect.dao.utenteDAO; // Assicurati di avere questo import
import com.backend_healthconnect.model.TipoMetrica;
import com.backend_healthconnect.model.metricheSaluteDTO;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class metricheSaluteDAOpostgres implements metricheSaluteDAO {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private utenteDAO utenteDAO;

    @Override
    public List<metricheSaluteDTO> findByPazienteId(Long pazienteId) {
        String query = "SELECT * FROM metriche_salute WHERE paziente_id = ? ORDER BY data DESC";
        return executeQuery(query, pazienteId);
    }

    @Override
    public List<metricheSaluteDTO> findByPazienteIdUltimi6Mesi(Long pazienteId) {
        String query = "SELECT * FROM metriche_salute " +
                "WHERE paziente_id = ? " +
                "AND data >= NOW() - INTERVAL '6 months' " +
                "ORDER BY data ASC";
        return executeQuery(query, pazienteId);
    }

    @Override
    public List<metricheSaluteDTO> findByPazienteIdAndTipo(Long pazienteId, TipoMetrica tipoMetrica) {
        // Nota: convertiamo l'enum in stringa per la query
        String query = "SELECT * FROM metriche_salute WHERE paziente_id = ? AND tipo_metrica = ?::tipo_metrica_enum ORDER BY data ASC";
        List<metricheSaluteDTO> results = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setLong(1, pazienteId);
            stmt.setString(2, tipoMetrica.name());

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                results.add(mapRowToDTO(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return results;
    }

    @Override
    public Map<String, Object> getStatisticheMetriche(Long pazienteId) {
        Map<String, Object> statistiche = new HashMap<>();

        // 1. Media PESO
        String sqlPeso = "SELECT AVG(valore) as media FROM metriche_salute WHERE paziente_id = ? AND tipo_metrica = 'PESO'::tipo_metrica_enum AND data >= NOW() - INTERVAL '6 months'";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sqlPeso)) {
            stmt.setLong(1, pazienteId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) statistiche.put("pesoMedio", rs.getDouble("media"));
        } catch (SQLException e) { e.printStackTrace(); }

        // 2. Ultima Pressione (MAX e MIN)
        String sqlPressione = "SELECT valore, tipo_metrica FROM metriche_salute " +
                "WHERE paziente_id = ? " +
                "AND tipo_metrica IN ('PRESSIONE_MAX'::tipo_metrica_enum, 'PRESSIONE_MIN'::tipo_metrica_enum) " +
                "ORDER BY data DESC LIMIT 2";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sqlPressione)) {
            stmt.setLong(1, pazienteId);
            ResultSet rs = stmt.executeQuery();
            List<Map<String, Object>> pressioni = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> p = new HashMap<>();
                p.put("valore", rs.getDouble("valore"));
                p.put("tipo", rs.getString("tipo_metrica"));
                pressioni.add(p);
            }
            statistiche.put("ultimaPressione", pressioni);
        } catch (SQLException e) { e.printStackTrace(); }

        return statistiche;
    }

    // --- Helper Methods ---
    private List<metricheSaluteDTO> executeQuery(String query, Long paramId) {
        List<metricheSaluteDTO> list = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setLong(1, paramId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapRowToDTO(rs));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    private metricheSaluteDTO mapRowToDTO(ResultSet rs) throws SQLException {
        metricheSaluteDTO dto = new metricheSaluteDTO();
        dto.setId(rs.getLong("id"));

        // Recupero ID e popolamento lazy (o tramite DAO se necessario)
        Long pazId = rs.getLong("paziente_id");
        Long medId = rs.getLong("medico_id");
        if (pazId > 0 && utenteDAO != null) dto.setPaziente(utenteDAO.getUtenteById(pazId));
        if (medId > 0 && utenteDAO != null) dto.setMedico(utenteDAO.getUtenteById(medId));

        // Mappatura Enum corretta
        dto.setTipoMetrica(TipoMetrica.valueOf(rs.getString("tipo_metrica")));
        dto.setValore(rs.getDouble("valore"));
        dto.setUnità_misura(rs.getString("unita_misura"));

        Timestamp ts = rs.getTimestamp("data");
        if (ts != null) dto.setData(ts.toLocalDateTime());

        return dto;
    }
}