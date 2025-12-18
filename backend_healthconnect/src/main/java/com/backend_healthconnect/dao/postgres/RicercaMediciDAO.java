package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.model.MedicoCardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RicercaMediciDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Mapper per convertire le righe del DB in oggetti Java
    private static final class MedicoRowMapper implements RowMapper<MedicoCardDTO> {
        @Override
        public MedicoCardDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new MedicoCardDTO(
                    rs.getLong("id"),
                    rs.getString("nome"),
                    rs.getString("cognome"),
                    rs.getString("spec_id"),        // Qui avremo l'ID (es. "0")
                    rs.getString("indirizzo_studio")
            );
        }
    }

    public List<MedicoCardDTO> executeRicerca(String ricerca, String specializzazione) {
        StringBuilder sql = new StringBuilder();

        sql.append("SELECT u.id, u.nome, u.cognome, d.indirizzo_studio, ");
        sql.append("CAST(d.specializzazione_id AS VARCHAR) as spec_id ");
        sql.append("FROM dettagli_medici d ");
        sql.append("JOIN utenti u ON d.utente_id = u.id ");

        // 👇 QUESTA È LA PARTE VECCHIA
        sql.append("WHERE CAST(u.ruolo AS VARCHAR) = 'MEDICO' ");

        // 👇 AGGIUNGI QUESTA RIGA NUOVA SOTTO:
        sql.append("AND CAST(d.stato_approvazione AS VARCHAR) = 'APPROVATO' ");

        List<Object> params = new ArrayList<>();



        // 1. FILTRO NOME (Se c'è testo nella barra di ricerca)
        if (ricerca != null && !ricerca.trim().isEmpty()) {
            sql.append("AND (LOWER(u.nome) LIKE LOWER(?) OR LOWER(u.cognome) LIKE LOWER(?)) ");
            String searchPattern = "%" + ricerca.trim() + "%";
            params.add(searchPattern);
            params.add(searchPattern);
        }

        // 2. NUOVO FILTRO SPECIALIZZAZIONE (Se è stata selezionata dalla tendina)
        // Filtriamo solo se la stringa non è null, non è vuota e non è "Tutte"
        if (specializzazione != null && !specializzazione.trim().isEmpty() && !specializzazione.equals("Tutte")) {
            // Confrontiamo l'ID convertito in testo
            sql.append("AND CAST(d.specializzazione_id AS VARCHAR) = ? ");
            params.add(specializzazione);
        }

        return jdbcTemplate.query(sql.toString(), new MedicoRowMapper(), params.toArray());
    }
}