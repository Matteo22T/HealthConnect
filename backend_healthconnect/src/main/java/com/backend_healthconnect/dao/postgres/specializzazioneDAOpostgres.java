package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.specializzazioneDAO;
import com.backend_healthconnect.model.specializzazioneDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class specializzazioneDAOpostgres implements specializzazioneDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public specializzazioneDTO getSpecializzazioneById(Long id) {
        String query = "SELECT * FROM specializzazioni WHERE id = ?";

        try(PreparedStatement statement = dataSource.getConnection().prepareStatement(query)){
            statement.setLong(1, id);

            ResultSet rs = statement.executeQuery();
            specializzazioneDTO specializzazione = new specializzazioneDTO();
            while (rs.next()) {
                specializzazione.setId(rs.getLong("id"));
                specializzazione.setNome(rs.getString("nome"));
            }
            return specializzazione;

        } catch (SQLException e){
            throw new RuntimeException(e);
        }
    }
}
