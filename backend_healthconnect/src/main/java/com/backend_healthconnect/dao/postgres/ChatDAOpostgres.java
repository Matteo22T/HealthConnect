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
    public List<ChatMessaggioDTO> getStoricoChat(Long id1, Long id2) {
        List<ChatMessaggioDTO> storico = new ArrayList<>();
        String query = "SELECT * FROM messaggi WHERE (mittente_id = ? AND destinatario_id = ?) OR (mittente_id = ? AND destinatario_id = ?) ORDER BY data_invio ASC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setLong(1, id1);
            stmt.setLong(2, id2);
            stmt.setLong(3, id2);
            stmt.setLong(4, id1);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                ChatMessaggioDTO msg = new ChatMessaggioDTO();
                msg.setId(rs.getLong("id"));
                msg.setMittente_id(rs.getLong("mittente_id"));
                msg.setDestinatario_id(rs.getLong("destinatario_id"));
                msg.setTesto(rs.getString("testo"));

                Timestamp ts = rs.getTimestamp("data_invio");
                if(ts != null) {
                    msg.setData_invio(ts.toLocalDateTime());
                }
                storico.add(msg);
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
    public List<MedicoDTO> getMediciConChat(Long mioId) {
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