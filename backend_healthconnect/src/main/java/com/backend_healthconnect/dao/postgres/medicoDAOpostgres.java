package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.medicoDAO;
import com.backend_healthconnect.model.StatoApprovazione;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Repository
public class medicoDAOpostgres implements medicoDAO {
    @Autowired
    private DataSource dataSource;

    @Override
    public void save(Long idUtente, Long specializzazione, String  numeroAlbo, String biografia, String indirizzo_studio, StatoApprovazione stato_approvazione) {
        String query = "INSERT INTO dettagli_medici (utente_id, specializzazione_id, numero_albo, biografia, indirizzo_studio, stato_approvazione) VALUES (?, ?, ?, ?, ?, ?::stato_approvazione_enum)";
        try(PreparedStatement preparedStatement = dataSource.getConnection().prepareStatement(query)){
            preparedStatement.setLong(1, idUtente);
            preparedStatement.setLong(2, specializzazione);
            preparedStatement.setString(3, numeroAlbo);
            preparedStatement.setString(4, biografia);
            preparedStatement.setString(5, indirizzo_studio);
            preparedStatement.setString(6, stato_approvazione.toString());
            preparedStatement.executeUpdate();

        } catch (SQLException e){
            e.printStackTrace();
        }
    }
}
