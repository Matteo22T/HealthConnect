package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.messaggioDAO;
import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.messaggioDTO;
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
public class messaggioDAOpostgres implements messaggioDAO {
    @Autowired
    private DataSource dataSource;

    @Autowired
    private utenteDAO utenteDAO;

    @Override
    public List<messaggioDTO> getMessaggiNonLettiById(Long id) {
        List<messaggioDTO> messaggi = new ArrayList<>();
        String query = "SELECT * FROM messaggi WHERE destinatario_id = ? AND letto = false" + " ORDER BY data_invio DESC";

        try (Connection connection = this.dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)){
            statement.setLong(1, id);
            ResultSet rs = statement.executeQuery();
            while (rs.next()) {
                messaggioDTO messaggio = new messaggioDTO();
                messaggio.setId(rs.getLong("id"));
                messaggio.setTesto(rs.getString("testo"));
                messaggio.setDestinatario(utenteDAO.getUtenteById(rs.getLong("destinatario_id")));
                messaggio.setMittente(utenteDAO.getUtenteById(rs.getLong("mittente_id")));
                messaggio.setLetto(rs.getBoolean("letto"));
                messaggio.setDataInvio(rs.getTimestamp("data_invio").toLocalDateTime());
                messaggi.add(messaggio);
            }
            return messaggi;


        } catch (SQLException e){
            throw new RuntimeException("Errore durante la lettura dei messaggi",e);
        }
    }
}
