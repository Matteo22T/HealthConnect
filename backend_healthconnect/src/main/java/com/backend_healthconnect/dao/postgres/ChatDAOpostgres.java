package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.ChatDAO;
import com.backend_healthconnect.model.ChatMessaggioDTO;
import com.backend_healthconnect.model.MedicoDTO; // 👈 Ora questo import funzionerà
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource; // 👈 Fondamentale per la connessione
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ChatDAOpostgres implements ChatDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public List<ChatMessaggioDTO> getStoricoChat(Long idUtenteCorrente, Long idInterlocutore) {
        List<ChatMessaggioDTO> storico = new ArrayList<>();

        // Query 1: Aggiorna lo stato dei messaggi ricevuti (da idInterlocutore a idUtenteCorrente)
        String updateQuery = "UPDATE messaggi SET letto = true WHERE mittente_id = ? AND destinatario_id = ? AND letto = false";

        // Query 2: Recupera lo storico (invariata)
        String selectQuery = "SELECT * FROM messaggi WHERE (mittente_id = ? AND destinatario_id = ?) " +
                "OR (mittente_id = ? AND destinatario_id = ?) ORDER BY data_invio ASC";

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            try {
                // 1. Eseguo l'UPDATE
                try (PreparedStatement updateStmt = conn.prepareStatement(updateQuery)) {
                    updateStmt.setLong(1, idInterlocutore);    // Chi ha inviato il messaggio
                    updateStmt.setLong(2, idUtenteCorrente);   // Chi sta leggendo ora
                    updateStmt.executeUpdate();
                }

                // 2. Eseguo la SELECT
                try (PreparedStatement selectStmt = conn.prepareStatement(selectQuery)) {
                    selectStmt.setLong(1, idUtenteCorrente);
                    selectStmt.setLong(2, idInterlocutore);
                    selectStmt.setLong(3, idInterlocutore);
                    selectStmt.setLong(4, idUtenteCorrente);

                    ResultSet rs = selectStmt.executeQuery();
                    while (rs.next()) {
                        ChatMessaggioDTO msg = new ChatMessaggioDTO();
                        msg.setId(rs.getLong("id"));
                        msg.setMittente_id(rs.getLong("mittente_id"));
                        msg.setDestinatario_id(rs.getLong("destinatario_id"));
                        msg.setTesto(rs.getString("testo"));
                        msg.setLetto(rs.getBoolean("letto"));

                        Timestamp ts = rs.getTimestamp("data_invio");
                        if(ts != null) {
                            msg.setData_invio(ts.toLocalDateTime());
                        }
                        storico.add(msg);
                    }
                }

                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return storico;
    }

    @Override
    public boolean salvaMessaggio(ChatMessaggioDTO msg) {
        String query = "INSERT INTO messaggi (mittente_id, destinatario_id, testo, data_invio) VALUES (?, ?, ?, NOW())";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setLong(1, msg.getMittente_id());
            stmt.setLong(2, msg.getDestinatario_id());
            stmt.setString(3, msg.getTesto());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<MedicoDTO> getContatti(Long mioId) {
        List<MedicoDTO> contatti = new ArrayList<>();

        // Query sulla tabella UTENTI (quella che esiste davvero)
        String query = "SELECT DISTINCT u.id, u.nome, u.cognome " +
                "FROM utenti u " +
                "JOIN messaggi msg ON (u.id = msg.mittente_id OR u.id = msg.destinatario_id) " +
                "WHERE (msg.mittente_id = ? OR msg.destinatario_id = ?) " +
                "AND u.id != ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setLong(1, mioId);
            stmt.setLong(2, mioId);
            stmt.setLong(3, mioId);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                MedicoDTO medico = new MedicoDTO();
                medico.setId(rs.getLong("id"));
                medico.setNome(rs.getString("nome"));
                medico.setCognome(rs.getString("cognome"));

                // Per ora passiamo una stringa fissa per non bloccare tutto.
                // Il Frontend si aspetta una stringa, non un ID.
                medico.setSpecializzazione("Medico");

                contatti.add(medico);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return contatti;
    }
}