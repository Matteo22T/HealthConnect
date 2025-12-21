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

        }
        catch (SQLException e) {
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
    public prenotazioneDTO accettaPrenotazione(Long id) {
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
    public boolean salvaPrenotazione(prenotazioneDTO p) {
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
