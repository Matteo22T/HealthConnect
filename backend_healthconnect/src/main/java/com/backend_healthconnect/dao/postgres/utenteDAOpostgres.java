package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.Ruolo;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

@Repository
public class utenteDAOpostgres implements utenteDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public utenteDTO getUtenteById(Long id) {
        String query="SELECT * FROM utente WHERE id=?";
        try(PreparedStatement statement=dataSource.getConnection().prepareStatement(query)){
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
                utente.setDataCreazione(rs.getDate("data_creazione").toLocalDate());
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
        String query="SELECT * FROM utenti WHERE email=?";
        try(PreparedStatement statement=dataSource.getConnection().prepareStatement(query)){
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
        try (PreparedStatement preparedStatement = this.dataSource.getConnection().prepareStatement(query)){
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
            e.printStackTrace();
        }
        return null;
    }
}
