package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.prenotazioneDAO;
import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.StatoPrenotazione;
import com.backend_healthconnect.model.prenotazioneDTO;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class prenotazioneDAOpostgres implements prenotazioneDAO {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private utenteDAO utenteDAO;

    @Override
    public List<prenotazioneDTO> getPrenotazioniInAttesaByMedico(Long id) {
        List<prenotazioneDTO> prenotazioni = new ArrayList<>();

        String query = "SELECT * FROM prenotazioni WHERE medico_id = ? AND stato = 'RICHIESTA' AND data_visita > CURRENT_TIMESTAMP";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setLong(1, id);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                prenotazioneDTO prenotazione = new prenotazioneDTO();
                prenotazione.setId(rs.getLong("id"));

                utenteDTO medico = utenteDAO.getUtenteById(id);
                prenotazione.setMedico(medico);

                //settiamo il paziente
                Long idPaziente = rs.getLong("paziente_id");
                utenteDTO utente = utenteDAO.getUtenteById(idPaziente);
                prenotazione.setPaziente(utente);

                Timestamp timestamp = rs.getTimestamp("data_visita");
                prenotazione.setDataVisita(timestamp.toLocalDateTime());

                StatoPrenotazione stato = StatoPrenotazione.valueOf(rs.getString("stato"));
                prenotazione.setStato(stato);

                prenotazione.setMotivo(rs.getString("motivo"));

                prenotazioni.add(prenotazione);
            }
            return prenotazioni;

        } catch (SQLException e) {
            throw new RuntimeException("Errore durante la lettura delle prenotazioni in attesa dal database", e);
        }
    }

    @Override
    public List<prenotazioneDTO> getPrenotazioniInAttesaByPaziente(Long id) {
        List<prenotazioneDTO> prenotazioni = new ArrayList<>();

        String query = "SELECT * FROM prenotazioni WHERE paziente_id = ? AND stato = 'RICHIESTA' AND data_visita > CURRENT_TIMESTAMP";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setLong(1, id);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                prenotazioneDTO prenotazione = new prenotazioneDTO();
                prenotazione.setId(rs.getLong("id"));

                utenteDTO paziente = utenteDAO.getUtenteById(id);
                prenotazione.setPaziente(paziente);

                Long idMedico = rs.getLong("medico_id");
                utenteDTO utente = utenteDAO.getUtenteById(idMedico);
                prenotazione.setMedico(utente);

                Timestamp timestamp = rs.getTimestamp("data_visita");
                prenotazione.setDataVisita(timestamp.toLocalDateTime());

                StatoPrenotazione stato = StatoPrenotazione.valueOf(rs.getString("stato"));
                prenotazione.setStato(stato);

                prenotazione.setMotivo(rs.getString("motivo"));

                prenotazioni.add(prenotazione);
            }
            return prenotazioni;

        } catch (SQLException e) {
            throw new RuntimeException("Errore durante la lettura delle prenotazioni in attesa dal database", e);
        }
    }

    @Override
    public List<prenotazioneDTO> getPrenotazioniRifiutateByPaziente(Long id) {
        List<prenotazioneDTO> prenotazioni = new ArrayList<>();
        String query = "SELECT * FROM prenotazioni WHERE paziente_id = ? AND stato = 'RIFIUTATA' AND data_visita > CURRENT_TIMESTAMP";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setLong(1, id);

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                prenotazioneDTO prenotazione = new prenotazioneDTO();
                prenotazione.setId(rs.getLong("id"));

                utenteDTO paziente = utenteDAO.getUtenteById(id);
                prenotazione.setPaziente(paziente);

                Long idMedico = rs.getLong("medico_id");
                utenteDTO utente = utenteDAO.getUtenteById(idMedico);
                prenotazione.setMedico(utente);

                Timestamp timestamp = rs.getTimestamp("data_visita");
                prenotazione.setDataVisita(timestamp.toLocalDateTime());

                StatoPrenotazione stato = StatoPrenotazione.valueOf(rs.getString("stato"));
                prenotazione.setStato(stato);

                prenotazione.setMotivo(rs.getString("motivo"));

                prenotazioni.add(prenotazione);
            }
            return prenotazioni;

        } catch (SQLException e) {
            throw new RuntimeException("Errore durante la lettura delle prenotazioni rifiutate dal database", e);
        }

    }

    @Override
    public prenotazioneDTO getPrenotazioneById(Long id) {
        String query = "SELECT * FROM prenotazioni WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setLong(1, id);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                prenotazioneDTO prenotazione = new prenotazioneDTO();
                prenotazione.setId(rs.getLong("id"));

                Long idPaziente = rs.getLong("paziente_id");
                utenteDTO utente = utenteDAO.getUtenteById(idPaziente);
                prenotazione.setPaziente(utente);

                Long idMedico = rs.getLong("medico_id");
                utenteDTO medico = utenteDAO.getUtenteById(idMedico);
                prenotazione.setMedico(medico);

                Timestamp timestamp = rs.getTimestamp("data_visita");
                prenotazione.setDataVisita(timestamp.toLocalDateTime());

                StatoPrenotazione stato = StatoPrenotazione.valueOf(rs.getString("stato"));
                prenotazione.setStato(stato);

                prenotazione.setMotivo(rs.getString("motivo"));
                return prenotazione;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Errore nella richiesta della prenotazione dal database", e);
        }
        return null;
    }

    @Override
    // Funzione per evitare accavallamenti di visite
    public boolean orarioNonValidoMedico(Long idPrenotazione) {
        prenotazioneDTO prenotazione = getPrenotazioneById(idPrenotazione);
        if (prenotazione == null) {
            throw new RuntimeException("Prenotazione non trovata");
        }

        LocalDateTime dataVisita = prenotazione.getDataVisita();
        Long idMedico = prenotazione.getMedico().getId();

        LocalDateTime inizioRange = dataVisita.minusMinutes(29);
        LocalDateTime fineRange = dataVisita.plusMinutes(29);

        String query = "SELECT COUNT(*) AS count FROM visite " +
                "WHERE medico_id = ? " +
                "AND data_visita > ? AND data_visita < ? "
                ;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setLong(1, idMedico);
            stmt.setTimestamp(2, Timestamp.valueOf(inizioRange));
            stmt.setTimestamp(3, Timestamp.valueOf(fineRange));

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int count = rs.getInt("count");
                return count > 0;
            }
            return false;

        } catch (SQLException e) {
            throw new RuntimeException("Errore durante la verifica dell'orario della prenotazione", e);
        }
    }

    @Override
    public prenotazioneDTO accettaPrenotazione(Long id) {
        if (orarioNonValidoMedico(id)){
            throw new RuntimeException("Hai già una prenotazione in questa fascia oraria.");
        }
        String query = "UPDATE prenotazioni SET stato = 'CONFERMATA' WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setLong(1, id);

            if (stmt.executeUpdate() > 0) {
                prenotazioneDTO prenotazione = this.getPrenotazioneById(id);
                if (prenotazione == null) {
                    throw new RuntimeException("Errore durante l'accettazione della prenotazione");
                }

                return prenotazione;
            }

        } catch (SQLException e) {
            throw new RuntimeException("Errore durante l'accettazione della prenotazione", e);
        }
        return null;
    }

    @Override
    public boolean rifiutaPrenotazione(Long id) {
        String query = "UPDATE prenotazioni SET stato = 'RIFIUTATA' WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setLong(1, id);
            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            throw new RuntimeException("Errore durante l'accettazione della prenotazione", e);
        }
    }

    @Override
    // Funzione per evitare accavallamenti di prenotazioni
    public boolean orarioNonValido(LocalDateTime dataVisita, Long idPaziente) {
        LocalDateTime inizioRange = dataVisita.minusMinutes(29);
        LocalDateTime fineRange = dataVisita.plusMinutes(29);

        String query = "SELECT COUNT(*) AS count FROM prenotazioni " +
                "WHERE paziente_id = ? " +
                "AND data_visita > ? AND data_visita < ? " +
                "AND stato IN ('RICHIESTA', 'CONFERMATA')";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setLong(1, idPaziente);
            stmt.setTimestamp(2, Timestamp.valueOf(inizioRange));
            stmt.setTimestamp(3, Timestamp.valueOf(fineRange));

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int count = rs.getInt("count");
                return count > 0;
            }
            return false;

        } catch (SQLException e) {
            throw new RuntimeException("Errore durante la verifica dell'orario della prenotazione", e);
        }
    }

    @Override
    public boolean salvaPrenotazione(prenotazioneDTO p) {
        if (orarioNonValido(p.getDataVisita(), p.getPaziente().getId())) {
            throw new RuntimeException("Hai già una prenotazione in questa fascia oraria.");
        }
        String query = "INSERT INTO prenotazioni (paziente_id, medico_id, data_visita, stato, motivo) VALUES (?, ?, ?, ?::stato_prenotazione_enum, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setLong(1, p.getPaziente().getId());
            stmt.setLong(2, p.getMedico().getId());
            stmt.setTimestamp(3, Timestamp.valueOf(p.getDataVisita()));


            stmt.setString(4, "RICHIESTA");

            stmt.setString(5, p.getMotivo());

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
