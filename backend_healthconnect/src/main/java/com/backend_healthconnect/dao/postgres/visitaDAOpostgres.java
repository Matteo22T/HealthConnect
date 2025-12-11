package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.prenotazioneDAO;
import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.dao.visitaDAO;
import com.backend_healthconnect.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class visitaDAOpostgres implements visitaDAO {

    @Autowired
    utenteDAO utenteDAO;

    @Autowired
    prenotazioneDAO prenotazioneDAO;

    @Autowired
    private DataSource dataSource;

    @Override
    public List<visitaDTO> getVisiteOdierneByMedico(Long id) {
        List<visitaDTO> visite = new ArrayList<>();

        String query = "SELECT * FROM visite WHERE medico_id = ? and data_visita = CURRENT_DATE";
        try(Connection conn = dataSource.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query)){
            stmt.setLong(1, id);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()){
                visitaDTO visita = new visitaDTO();
                visita.setId(rs.getLong("id"));

                utenteDTO medico = utenteDAO.getUtenteById(rs.getLong("medico_id"));
                visita.setMedico(medico);

                utenteDTO paziente = utenteDAO.getUtenteById(rs.getLong("paziente_id"));
                visita.setPaziente(paziente);

                prenotazioneDTO prenotazione = prenotazioneDAO.getPrenotazioneById(rs.getLong("prenotazione_id"));
                visita.setPrenotazione(prenotazione);

                visita.setDiagnosi(rs.getString("diagnosi"));
                visita.setNoteMedico(rs.getString("note_medico"));
                Timestamp data = rs.getTimestamp("data_visita");
                visita.setDataVisita(data.toLocalDateTime());
                visite.add(visita);
            }
            return visite;

        } catch (SQLException e){
            throw new RuntimeException("Errore nella richiesta delle visite al database", e);
        }
    }

    @Override
    public List<utenteDTO> getListaPazientiMedico(Long id) {
        List<utenteDTO> pazienti = new ArrayList<>();
        String query = "SELECT DISTINCT paziente_id FROM visite WHERE medico_id = ?";

        try(Connection conn = this.dataSource.getConnection();
        PreparedStatement statement = conn.prepareStatement(query)){
            statement.setLong(1, id);
            ResultSet rs = statement.executeQuery();
            while (rs.next()){
                Long idPaziente = rs.getLong("paziente_id");
                utenteDTO paziente = utenteDAO.getUtenteById(idPaziente);
                pazienti.add(paziente);
            }
            return pazienti;

        } catch (SQLException e){
            throw new RuntimeException("Errore durante la richiesta lista pazienti al db",e);
        }
    }

    @Override
    public boolean creaVisita(prenotazioneDTO prenotazione) {
        String query = "INSERT INTO visite (prenotazione_id, paziente_id, medico_id, diagnosi, note_medico, data_visita) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection connection = this.dataSource.getConnection();
        PreparedStatement statement = connection.prepareStatement(query)){
            statement.setLong(1,prenotazione.getId());
            statement.setLong(2,prenotazione.getPaziente().getId());
            statement.setLong(3,prenotazione.getMedico().getId());
            statement.setString(4,null);
            statement.setString(5,null);
            statement.setTimestamp(6, Timestamp.valueOf(prenotazione.getDataVisita()));
            return statement.executeUpdate() > 0;

        } catch (SQLException e){
            throw new RuntimeException("Errore durante la creazione della visita", e);
        }
    }

    @Override
    public visitaDTO getVisitaById(Long id) {
        return null;
    }

    @Override
    public List<visitaDTO> getVisiteFutureByPaziente(Long id) {
        List<visitaDTO> visiteFuture = new ArrayList<>();

        String query = "SELECT * FROM visite " +
                "WHERE paziente_id = ? " +
                "AND data_visita >= CURRENT_DATE " +
                "ORDER BY data_visita ASC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setLong(1, id);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                visitaDTO p = new visitaDTO();
                p.setId(rs.getLong("id"));

                prenotazioneDTO prenotazioneDTO = prenotazioneDAO.getPrenotazioneById(rs.getLong("prenotazione_id"));
                p.setPrenotazione(prenotazioneDTO);

                utenteDTO paziente = utenteDAO.getUtenteById(id);
                p.setPaziente(paziente);

                utenteDTO medico = utenteDAO.getUtenteById(rs.getLong("medico_id"));
                p.setMedico(medico);

                p.setDiagnosi(rs.getString("diagnosi"));

                p.setNoteMedico(rs.getString("note_medico"));

                p.setDataVisita(rs.getTimestamp("data_visita").toLocalDateTime());

                visiteFuture.add(p);
            }
            return visiteFuture;

        } catch (SQLException e) {
            throw new RuntimeException("Errore recupero visite future", e);
        }

    }

    @Override
    public List<utenteDTO> getListaMediciPaziente(Long id){
        List<utenteDTO> medici = new ArrayList<>();

        String query=
                "SELECT DISTINCT u.* \n" +
                        "FROM utenti u\n" +
                        "INNER JOIN visite v ON u.id = v.medico_id\n" +
                        "WHERE v.paziente_id = ? \n" +
                        "AND u.ruolo = 'MEDICO'\n" +
                        "ORDER BY u.nome, u.cognome;\n ";
        try (Connection conn=dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)){

            stmt.setLong(1,id);
            ResultSet rs= stmt.executeQuery();

            while (rs.next()){
                utenteDTO medico = new utenteDTO();
                medico.setId(rs.getLong("id"));
                medico.setNome(rs.getString("nome"));
                medico.setCognome(rs.getString("cognome"));
                medico.setEmail(rs.getString("email"));
                medico.setPassword(rs.getString("password"));
                medico.setTelefono(rs.getLong("telefono"));
                medico.setDataNascita(rs.getDate("data_nascita").toLocalDate());
                medico.setRuolo(Ruolo.valueOf(rs.getString("ruolo")));

                medici.add(medico);
            }
            return medici;
        }
        catch (SQLException e){
            throw new RuntimeException(e);
        }
    }
}
