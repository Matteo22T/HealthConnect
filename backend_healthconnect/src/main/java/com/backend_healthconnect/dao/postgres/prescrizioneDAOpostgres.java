package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.prescrizioneDAO;
import com.backend_healthconnect.model.prescrizioneDTO;
import com.backend_healthconnect.model.visitaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class prescrizioneDAOpostgres implements prescrizioneDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public List<prescrizioneDTO> getPrescrizioniPaziente(Long id){

        List<prescrizioneDTO> prescrizioni = new ArrayList<>();

        String query = """
            SELECT p.* FROM prescrizioni p
            INNER JOIN visite v ON p.visita_id = v.id
            WHERE v.paziente_id = ? 
            AND (p.data_fine IS NULL OR p.data_fine >= CURRENT_DATE)
            ORDER BY p.data_emissione DESC
            """;


        try(Connection conn = dataSource.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query)){

            stmt.setLong(1,id);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()){
                prescrizioneDTO prescrizioneDTO = new prescrizioneDTO();

                prescrizioneDTO.setId(rs.getLong("id"));
                prescrizioneDTO.setId_visita(rs.getLong("visita_id"));

                prescrizioneDTO.setNome_farmaco(rs.getString("nome_farmaco"));
                prescrizioneDTO.setDosaggio(rs.getString("dosaggio"));
                prescrizioneDTO.setDataEmissione(rs.getDate("data_emissione").toLocalDate());
                java.sql.Date dataFine = rs.getDate("data_fine");
                if (dataFine != null) {
                    prescrizioneDTO.setDataFine(dataFine.toLocalDate());
                }


                prescrizioni.add(prescrizioneDTO);
            }
            return prescrizioni;
        }
        catch (SQLException e){
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<prescrizioneDTO> getPrescrizioniByVisita(Long id) {
        String query = "SELECT * FROM prescrizioni WHERE visita_id = ? ORDER BY data_fine DESC";
        try(Connection conn = dataSource.getConnection();
        PreparedStatement stmt = conn.prepareStatement(query)){
            stmt.setLong(1,id);
            ResultSet rs = stmt.executeQuery();
            List<prescrizioneDTO> prescrizioni = new ArrayList<>();
            while (rs.next()){
                prescrizioneDTO prescrizioneDTO = new prescrizioneDTO();
                prescrizioneDTO.setId(rs.getLong("id"));
                prescrizioneDTO.setId_visita(id);
                prescrizioneDTO.setNome_farmaco(rs.getString("nome_farmaco"));
                prescrizioneDTO.setDosaggio(rs.getString("dosaggio"));
                prescrizioneDTO.setDataEmissione(rs.getDate("data_emissione").toLocalDate());
                java.sql.Date dataFine = rs.getDate("data_fine");
                if (dataFine != null) {
                    prescrizioneDTO.setDataFine(dataFine.toLocalDate());
                }
                prescrizioni.add(prescrizioneDTO);
            }
            return prescrizioni;
        } catch (SQLException e) {
            throw new RuntimeException("errore durante connessione al database per le prescizioni", e);
        }
    }

    @Override
    public List<prescrizioneDTO> getAllPrescrizioniPaziente(Long id) {
        List<prescrizioneDTO> prescrizioni = new ArrayList<>();
        String query = """
        SELECT p.* FROM prescrizioni p
        INNER JOIN visite v ON p.visita_id = v.id
        WHERE v.paziente_id = ? 
        ORDER BY p.data_emissione DESC
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setLong(1, id);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                prescrizioneDTO dto = new prescrizioneDTO();
                dto.setId(rs.getLong("id"));
                dto.setNome_farmaco(rs.getString("nome_farmaco"));
                dto.setDosaggio(rs.getString("dosaggio"));
                dto.setDataEmissione(rs.getDate("data_emissione").toLocalDate());
                java.sql.Date fine = rs.getDate("data_fine");
                if(fine != null) dto.setDataFine(fine.toLocalDate());

                prescrizioni.add(dto);
            }
            return prescrizioni;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Boolean aggiornaPrescrizioni(List<prescrizioneDTO> prescrizioni, Long idVisita) {
        String queryDelete = "DELETE FROM prescrizioni WHERE visita_id = ?";
        try (Connection conn = dataSource.getConnection();
        PreparedStatement statement = conn.prepareStatement(queryDelete)){
            statement.setLong(1, idVisita);
            statement.executeUpdate();

            if (prescrizioni != null){
                for (prescrizioneDTO prescrizione : prescrizioni) {
                    String queryInsert = "INSERT INTO prescrizioni (visita_id, nome_farmaco, dosaggio, data_emissione, data_fine) VALUES (?, ?, ?, ?, ?)";
                    try (PreparedStatement preparedStatement = conn.prepareStatement(queryInsert)) {
                        preparedStatement.setLong(1,idVisita);
                        preparedStatement.setString(2, prescrizione.getNome_farmaco());
                        preparedStatement.setString(3, prescrizione.getDosaggio());

                        Date date = Date.valueOf(prescrizione.getDataEmissione());
                        preparedStatement.setDate(4, date);

                        date = Date.valueOf(prescrizione.getDataFine());
                        preparedStatement.setDate(5, date);

                        if (preparedStatement.executeUpdate() <= 0){
                            return false;
                        }
                    }
                }
            }
            return true;
        } catch (SQLException e) {
            throw new RuntimeException("errore durante connessione al database per le prescizioni", e);
        }
    }
}
