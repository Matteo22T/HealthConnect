package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.metricheSaluteDAO;
import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.TipoMetrica;
import com.backend_healthconnect.model.metricheSaluteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class metricheSaluteDAOpostgres implements metricheSaluteDAO {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private utenteDAO utenteDAO;

    @Override
    public List<metricheSaluteDTO> findByPazienteIdUltimi6Mesi(Long pazienteId) {
        List<metricheSaluteDTO> metriche = new ArrayList<>();

        // Recupera i dati degli ultimi 6 mesi ordinati per data
        String query = "SELECT * FROM metriche_salute " +
                "WHERE paziente_id = ? " +
                "AND data_misurazione >= CURRENT_DATE - INTERVAL '6 months' " +
                "ORDER BY data_misurazione ASC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setLong(1, pazienteId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                metricheSaluteDTO dto = new metricheSaluteDTO();
                dto.setId(rs.getLong("id"));

                dto.setTipoMetrica(TipoMetrica.valueOf(rs.getString("tipo")));
                dto.setValore(rs.getDouble("valore"));
                dto.setUnità_misura(rs.getString("unita_misura"));

                Date date = rs.getDate("data_misurazione");
                if (date != null) dto.setData(date.toLocalDate());

                Long medicoId = rs.getLong("medico_id");
                if (medicoId > 0) {
                    dto.setMedico(utenteDAO.getUtenteById(medicoId));
                }

                metriche.add(dto);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Errore recupero metriche salute", e);
        }
        return metriche;
    }

    @Override
    public Boolean salvaNuovaMetrica(metricheSaluteDTO metrica) {
        String query = "INSERT INTO metriche_salute (paziente_id, medico_id , tipo, valore, unita_misura, data_misurazione) VALUES (?, ?, ?::tipo_metrica_enum, ?, ?, ?)";
        try (Connection connection = dataSource.getConnection();
        PreparedStatement statement = connection.prepareStatement(query)){
            statement.setLong(1,metrica.getPaziente().getId());
            statement.setLong(2,metrica.getMedico().getId());
            statement.setString(3,metrica.getTipoMetrica().toString());
            statement.setDouble(4,metrica.getValore());
            statement.setString(5,metrica.getUnità_misura());
            statement.setDate(6, Date.valueOf(metrica.getData()));
            return statement.executeUpdate() > 0;

        } catch (SQLException e) {
            throw new RuntimeException("Errore durante la creazione della metrica", e);
        }
    }
}