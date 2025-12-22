package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.Ruolo;
import com.backend_healthconnect.model.StatoApprovazione;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class utenteDAOpostgres implements utenteDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public utenteDTO getUtenteById(Long id) {
        String query="SELECT u.*, \n" + "dm.specializzazione_id, \n" + "dm.numero_albo, \n" + "dm.biografia, \n" + "dm.indirizzo_studio, \n" + "dm.stato_approvazione\n" + "FROM utenti u\n" + "LEFT JOIN dettagli_medici dm ON u.id = dm.utente_id\n" + "WHERE u.id = ?";
        try(Connection connection = this.dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(query)){
            statement.setLong(1, id);
            ResultSet rs=statement.executeQuery();
            while (rs.next()) {
                utenteDTO utente = new utenteDTO();
                utente.setId(rs.getLong("id"));
                utente.setNome(rs.getString("nome"));
                utente.setCognome(rs.getString("cognome"));
                utente.setEmail(rs.getString("email"));
                utente.setPassword(rs.getString("password"));
                utente.setTelefono(rs.getLong("telefono"));
                utente.setDataNascita(rs.getDate("data_nascita").toLocalDate());
                Ruolo ruolo = Ruolo.valueOf(rs.getString("ruolo"));
                utente.setRuolo(ruolo);
                utente.setDataCreazione(rs.getDate("created_at").toLocalDate());
                utente.setSesso(rs.getString("sesso"));
                //dati medico
                long specId = rs.getLong("specializzazione_id");
                if (!rs.wasNull()) {
                    utente.setSpecializzazione_id(specId);
                }

                utente.setNumero_albo(rs.getString("numero_albo"));
                utente.setBiografia(rs.getString("biografia"));
                utente.setIndirizzo_studio(rs.getString("indirizzo_studio"));

                String stato = rs.getString("stato_approvazione");
                if (stato != null) {
                    utente.setStato_approvazione(StatoApprovazione.valueOf(stato));
                }

                return utente;
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public utenteDTO getUtenteByEmail(String email) {
        String query="SELECT u.*, \n" + "dm.specializzazione_id, \n" + "dm.numero_albo, \n" + "dm.biografia, \n" + "dm.indirizzo_studio, \n" + "dm.stato_approvazione\n" + "FROM utenti u\n" + "LEFT JOIN dettagli_medici dm ON u.id = dm.utente_id\n" + "WHERE u.email = ?";
        try(Connection connection = this.dataSource.getConnection();
            PreparedStatement statement = connection.prepareStatement(query)){
            statement.setString(1, email);
            ResultSet rs=statement.executeQuery();
            while (rs.next()) {
                utenteDTO utente = new utenteDTO();
                utente.setId(rs.getLong("id"));
                utente.setNome(rs.getString("nome"));
                utente.setCognome(rs.getString("cognome"));
                utente.setEmail(rs.getString("email"));
                utente.setPassword(rs.getString("password"));
                utente.setTelefono(rs.getLong("telefono"));
                java.sql.Date dataDalDb = rs.getDate("data_nascita");
                if (dataDalDb != null) {
                    utente.setDataNascita(dataDalDb.toLocalDate());
                } else {
                    utente.setDataNascita(null);
                }
                Ruolo ruolo = Ruolo.valueOf(rs.getString("ruolo"));
                utente.setRuolo(ruolo);
                java.sql.Date data = rs.getDate("created_at");
                if (data != null) {
                    utente.setDataNascita(data.toLocalDate());
                } else {
                    utente.setDataCreazione(null);
                }
                utente.setSesso(rs.getString("sesso"));

                //prendo dati medico
                long specId = rs.getLong("specializzazione_id");
                if (!rs.wasNull()) {
                    utente.setSpecializzazione_id(specId);
                }

                utente.setNumero_albo(rs.getString("numero_albo"));
                utente.setBiografia(rs.getString("biografia"));
                utente.setIndirizzo_studio(rs.getString("indirizzo_studio"));

                String stato = rs.getString("stato_approvazione");
                if (stato != null) {
                    utente.setStato_approvazione(StatoApprovazione.valueOf(stato));
                }

                return utente;
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return null;

    }

    @Override
    public utenteDTO save(utenteDTO utente) {

        String query = "INSERT INTO utenti ( email, password, nome, cognome, telefono, data_nascita,ruolo, sesso) VALUES (?, ?, ?, ?, ?, ?, ?::ruolo_enum,?)";
        try (PreparedStatement preparedStatement = this.dataSource.getConnection().prepareStatement(query, Statement.RETURN_GENERATED_KEYS)){
            preparedStatement.setString(1, utente.getEmail());
            preparedStatement.setString(2, utente.getPassword());
            preparedStatement.setString(3, utente.getNome());
            preparedStatement.setString(4, utente.getCognome());
            preparedStatement.setLong(5, utente.getTelefono());
            preparedStatement.setDate(6, java.sql.Date.valueOf(utente.getDataNascita()));
            preparedStatement.setString(7, utente.getRuolo().toString());
            preparedStatement.setString(8, utente.getSesso());
            preparedStatement.executeUpdate();

            try {
                ResultSet rs = preparedStatement.getGeneratedKeys();
                if (rs.next()) {
                    utente.setId(rs.getLong(1));
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            return utente;


        } catch (SQLException e){
            throw new RuntimeException("Errore durante il salvataggio dell'utente",e);
        }
    }

    @Override
    public utenteDTO modificaProfilo(Long id, String email, Long telefono) {
        String query = "UPDATE utenti SET email = ?, telefono = ? WHERE id = ?";
        try (Connection connection = this.dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(query)){
            statement.setString(1, email);
            statement.setString(2, telefono.toString());
            statement.setLong(3, id);

            if (statement.executeUpdate()>0){
                utenteDTO utente = getUtenteById(id);
                utente.setEmail(email);
                utente.setTelefono(telefono);
                return utente;
            }
        } catch (SQLException e){
            throw new RuntimeException("Errore durante la modifica del profilo dell'utente",e);
        }
        System.out.println("ritorna null");
        return null;
    }

    @Override
    public utenteDTO modificaProfiloProfessionale(Long id, String indrizzo, String biografia){
        String query = "UPDATE dettagli_medici SET indirizzo_studio = ?, biografia = ? WHERE utente_id = ?";
        try (Connection connection = this.dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(query)){
            statement.setString(1, indrizzo);
            statement.setString(2, biografia);
            statement.setLong(3, id);

            if (statement.executeUpdate()>0){
                utenteDTO utente = getUtenteById(id);
                utente.setIndirizzo_studio(indrizzo);
                utente.setBiografia(biografia);
                return utente;
            }
        } catch (SQLException e){
            throw new RuntimeException("Errore durante la modifica del profilo dell'utente",e);
        }
        System.out.println("ritorna null");
        return null;
    }

    @Override
    public void cambiaPassword(Long id, String nuovaPassword) {
        String query = "UPDATE utenti SET password = ? WHERE id = ?";
        try (Connection connection = this.dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(query)){
            statement.setString(1, nuovaPassword);
            statement.setLong(2, id);

            int rowsAffected = statement.executeUpdate();

            if (rowsAffected == 0) {
                throw new SQLException("Aggiornamento fallito, nessun utente trovato con ID: " + id);
            }
            } catch (SQLException e){
            throw new RuntimeException("Errore durante la modifica del profilo dell'utente",e);
        }
    }

    @Override
    public List<utenteDTO> getUtentiAll() {
        List<utenteDTO> utenti = new ArrayList<>();
        String query = "SELECT * FROM utenti WHERE ruolo = 'PAZIENTE' OR ruolo = 'MEDICO' ORDER BY created_at DESC";
        String queryMedico = "SELECT * FROM dettagli_medici WHERE utente_id = ?";

        try (Connection conn = this.dataSource.getConnection(); PreparedStatement stmt = conn.prepareStatement(query)){
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                utenteDTO utente = new utenteDTO();
                utente.setId(rs.getLong("id"));
                utente.setNome(rs.getString("nome"));
                utente.setCognome(rs.getString("cognome"));
                utente.setEmail(rs.getString("email"));
                utente.setPassword(rs.getString("password"));
                utente.setTelefono(rs.getLong("telefono"));
                utente.setRuolo(Ruolo.valueOf(rs.getString("ruolo")));
                utente.setDataNascita(rs.getDate("data_nascita").toLocalDate());
                utente.setDataCreazione(rs.getDate("created_at").toLocalDate());
                utente.setSesso(rs.getString("sesso"));
                if (utente.getRuolo() == Ruolo.MEDICO){
                    try(PreparedStatement stmt2 = conn.prepareStatement(queryMedico)){
                        stmt2.setLong(1,utente.getId());
                        ResultSet rs2 = stmt2.executeQuery();
                        if (rs2.next()){
                            utente.setSpecializzazione_id(rs2.getLong("specializzazione_id"));
                            utente.setNumero_albo(rs2.getString("numero_albo"));
                            utente.setBiografia(rs2.getString("biografia"));
                            utente.setIndirizzo_studio(rs2.getString("indirizzo_studio"));
                            utente.setStato_approvazione(StatoApprovazione.valueOf(rs2.getString("stato_approvazione")));
                        }
                    }
                    catch (SQLException e){
                        throw new RuntimeException(e);
                    }
                }
                utenti.add(utente);
            }
            return utenti;
        } catch (SQLException e){
            throw  new RuntimeException("Errore durante richiesta lista utenti",e);
        }
    }

    @Override
    public boolean approvaMedico(Long id){
        String query = "UPDATE dettagli_medici SET stato_approvazione = 'APPROVATO' WHERE utente_id = ?";
        try (Connection connection = this.dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(query)){
            statement.setLong(1, id);
            return statement.executeUpdate()>0;
        } catch (SQLException e){
            throw new RuntimeException("Errore durante la modifica del profilo dell'utente",e);
        }
    }

    @Override
    public boolean rifiutaMedico(Long id) {
        String query = "UPDATE dettagli_medici SET stato_approvazione = 'RIFIUTATO' WHERE utente_id = ?";
        try (Connection connection = this.dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new RuntimeException("Errore durante la modifica del profilo dell'utente", e);
        }
    }
}
