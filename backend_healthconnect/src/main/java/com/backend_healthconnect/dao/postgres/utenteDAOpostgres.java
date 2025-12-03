package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.Ruolo;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

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

}
