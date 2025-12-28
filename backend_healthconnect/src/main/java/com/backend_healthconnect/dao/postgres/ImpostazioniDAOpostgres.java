package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.ImpostazioniDAO;
import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.ImpostazioniNotificheDTO;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class ImpostazioniDAOpostgres implements ImpostazioniDAO {
    @Autowired
    private DataSource dataSource;

    @Autowired
    private utenteDAO utenteDAO;

    @Override
    public ImpostazioniNotificheDTO getImpostazioniNotifiche(Long id) {
        String query = "SELECT * FROM impostazioni_notifiche WHERE utente_id = ?";
        try (Connection connection = dataSource.getConnection();
        PreparedStatement stmt = connection.prepareStatement(query)){
            stmt.setLong(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                ImpostazioniNotificheDTO impostazioni = new ImpostazioniNotificheDTO();
                impostazioni.setUtente(utenteDAO.getUtenteById(rs.getLong("utente_id")));
                impostazioni.setNotificheEmail(rs.getBoolean("notifiche_email"));
                return impostazioni;
            }
        }
        catch (SQLException e) {
            throw new RuntimeException("Errore nella lettura delle impostazioni", e);
        }
        return null;
    }

    @Override
    public boolean AggiornaNotificheEmail(Long id) {
        ImpostazioniNotificheDTO impAttuali = getImpostazioniNotifiche(id);
        String updateQuery = "UPDATE impostazioni_notifiche SET notifiche_email = ? WHERE utente_id = ?";

        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement stmt = conn.prepareStatement(updateQuery)) {
                stmt.setBoolean(1,!impAttuali.isNotificheEmail());
                stmt.setLong(2, id);
                return stmt.executeUpdate() > 0;
            }

        } catch (SQLException e) {
            throw new RuntimeException("Errore nell'aggiornamento delle impostazioni", e);
        }
    }
}
