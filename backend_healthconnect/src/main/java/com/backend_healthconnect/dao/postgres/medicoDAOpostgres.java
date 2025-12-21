package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.medicoDAO;
import com.backend_healthconnect.model.MedicoDTO;
import com.backend_healthconnect.model.medicoCardDTO;
import com.backend_healthconnect.model.StatoApprovazione;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class medicoDAOpostgres implements medicoDAO {
    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void save(Long idUtente, Long specializzazione, String  numeroAlbo, String biografia, String indirizzo_studio, StatoApprovazione stato_approvazione) {
        String query = "INSERT INTO dettagli_medici (utente_id, specializzazione_id, numero_albo, biografia, indirizzo_studio, stato_approvazione) VALUES (?, ?, ?, ?, ?, ?::stato_approvazione_enum)";
        try(Connection connection = this.dataSource.getConnection(); PreparedStatement preparedStatement = connection.prepareStatement(query)){
            preparedStatement.setLong(1, idUtente);
            preparedStatement.setLong(2, specializzazione);
            preparedStatement.setString(3, numeroAlbo);
            preparedStatement.setString(4, biografia);
            preparedStatement.setString(5, indirizzo_studio);
            preparedStatement.setString(6, stato_approvazione.toString());
            preparedStatement.executeUpdate();

        } catch (SQLException e){
            e.printStackTrace();
        }
    }


    @Override
    public List<medicoCardDTO> getMediciPerCard(String ricerca, String specializzazione) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();

        sql.append("SELECT u.id, u.nome, u.cognome, d.indirizzo_studio, ");
        sql.append("CAST(d.specializzazione_id AS VARCHAR) as spec_id ");
        sql.append("FROM dettagli_medici d ");
        sql.append("JOIN utenti u ON d.utente_id = u.id ");
        sql.append("WHERE CAST(u.ruolo AS VARCHAR) = 'MEDICO' ");
        sql.append("AND CAST(d.stato_approvazione AS VARCHAR) = 'APPROVATO' ");

        // Filtro Ricerca (Nome/Cognome)
        if (ricerca != null && !ricerca.trim().isEmpty()) {
            sql.append("AND (LOWER(u.nome) LIKE LOWER(?) OR LOWER(u.cognome) LIKE LOWER(?)) ");
            String searchPattern = "%" + ricerca.trim() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
        }

        // Filtro Specializzazione
        if (specializzazione != null && !specializzazione.trim().isEmpty() && !specializzazione.equals("Tutte")) {
            sql.append("AND CAST(d.specializzazione_id AS VARCHAR) = ? ");
            params.add(specializzazione);
        }

        return jdbcTemplate.query(sql.toString(), (rs, rowNum) -> new medicoCardDTO(
                rs.getLong("id"),
                rs.getString("nome"),
                rs.getString("cognome"),
                rs.getString("spec_id"),
                rs.getString("indirizzo_studio")
        ), params.toArray());
    }

    @Override
    public MedicoDTO getMedicoById(Long id) {
        String query = "SELECT u.id, u.nome, u.cognome, d.specializzazione_id FROM utenti u JOIN dettagli_medici d ON u.id = d.utente_id WHERE u.id = ?";

        try (Connection connection = this.dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {

            statement.setLong(1, id);
            ResultSet rs = statement.executeQuery();
            MedicoDTO medico = new MedicoDTO();
            while (rs.next()) {
                medico.setId(rs.getLong("id"));
                medico.setNome(rs.getString("nome"));
                medico.setCognome(rs.getString("cognome"));
                medico.setSpecializzazione(rs.getString("specializzazione_id"));
            }
            return medico;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
