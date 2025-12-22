package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.specializzazioneDAO;
import com.backend_healthconnect.model.specializzazioneDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class specializzazioneDAOpostgres implements specializzazioneDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public specializzazioneDTO getSpecializzazioneById(Long id) {
        String query = "SELECT * FROM specializzazioni WHERE id = ?";

        try(Connection connection = this.dataSource.getConnection(); PreparedStatement statement = connection.prepareStatement(query)){
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

    @Override
    public List<specializzazioneDTO> getSpecializzazioniAll() {
        List<specializzazioneDTO> specializzazioni = new ArrayList<>();
        String query = "SELECT * FROM specializzazioni ORDER BY id ASC";
        try(Connection conn = dataSource.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query)) {
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                specializzazioneDTO specializzazione = new specializzazioneDTO();
                specializzazione.setId(rs.getLong("id"));
                specializzazione.setNome(rs.getString("nome"));
                specializzazioni.add(specializzazione);
            }
            return specializzazioni;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean salvaSpecializzazione(String nome) {
        String query = "INSERT INTO specializzazioni (nome) VALUES (?)";
        try (Connection conn = dataSource.getConnection();
        PreparedStatement stmt = conn.prepareStatement(query)){
            stmt.setString(1,nome);
            return stmt.executeUpdate() > 0;
        }catch (SQLException e){
            throw new RuntimeException(e);
        }
    }
}
