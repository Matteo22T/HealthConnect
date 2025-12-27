package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.medicoDAO;
import com.backend_healthconnect.model.*;
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
    public List<utenteDTO> getMediciPerCard(String ricerca, String specializzazione) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();

        sql.append("SELECT u.*, d.*, ");
        sql.append("CAST(d.specializzazione_id AS VARCHAR) as spec_id ");
        sql.append("FROM dettagli_medici d ");
        sql.append("JOIN utenti u ON d.utente_id = u.id ");
        sql.append("WHERE CAST(u.ruolo AS VARCHAR) = 'MEDICO' ");
        sql.append("AND CAST(d.stato_approvazione AS VARCHAR) = 'APPROVATO' ");

        // Filtro Ricerca (Nome/Cognome)
        if (ricerca != null && !ricerca.trim().isEmpty()) {
            sql.append("AND (LOWER(u.nome) LIKE LOWER(?) OR LOWER(u.cognome) LIKE LOWER(?) ");
            sql.append("OR LOWER(COALESCE(u.nome, '') || ' ' || COALESCE(u.cognome, '')) LIKE LOWER(?) ");
            sql.append("OR LOWER(COALESCE(u.cognome, '') || ' ' || COALESCE(u.nome, '')) LIKE LOWER(?) ");

            sql.append(") "); // Fine blocco AND
            String searchPattern = "%" + ricerca.trim() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
            params.add(searchPattern);
        }

        // Filtro Specializzazione
        if (specializzazione != null && !specializzazione.trim().isEmpty() && !specializzazione.equals("Tutte")) {
            sql.append("AND CAST(d.specializzazione_id AS VARCHAR) = ? ");
            params.add(specializzazione);
        }

        return jdbcTemplate.query(sql.toString(), (rs, rowNum) -> new utenteDTO(
                rs.getLong("id"),
                rs.getString("nome"),
                rs.getString("cognome"),
                rs.getString("email"),
                rs.getString("password"),
                rs.getLong("telefono"),
                rs.getDate("data_nascita").toLocalDate(),
                Ruolo.valueOf(rs.getString("ruolo")),
                rs.getDate("created_at").toLocalDate(),
                rs.getString("sesso"),
                rs.getLong("specializzazione_id"),
                rs.getString("numero_albo"),
                rs.getString("biografia"),
                rs.getString("indirizzo_studio"),
                StatoApprovazione.valueOf(rs.getString("stato_approvazione"))
        ), params.toArray());
    }

    @Override
    public utenteDTO getMedicoById(Long id) {
        String query = "SELECT u.*, d.* FROM utenti u JOIN dettagli_medici d ON u.id = d.utente_id WHERE u.id = ?";

        try (Connection connection = this.dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {

            statement.setLong(1, id);
            ResultSet rs = statement.executeQuery();
            utenteDTO medico = new utenteDTO();
            while (rs.next()) {
                medico.setId(rs.getLong("id"));
                medico.setNome(rs.getString("nome"));
                medico.setCognome(rs.getString("cognome"));
                medico.setEmail(rs.getString("email"));
                medico.setPassword(rs.getString("password"));
                medico.setTelefono(rs.getLong("telefono"));
                medico.setDataNascita(rs.getDate("data_nascita").toLocalDate());
                medico.setRuolo(Ruolo.valueOf(rs.getString("ruolo")));
                medico.setDataCreazione(rs.getDate("created_at").toLocalDate());
                medico.setSesso(rs.getString("sesso"));
                medico.setNumero_albo(rs.getString("numero_albo"));
                medico.setIndirizzo_studio(rs.getString("indirizzo_studio"));
                medico.setBiografia(rs.getString("biografia"));
                medico.setStato_approvazione(StatoApprovazione.valueOf(rs.getString("stato_approvazione")));
                medico.setSpecializzazione_id(rs.getLong("specializzazione_id"));
            }
            return medico;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
