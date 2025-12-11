package com.backend_healthconnect.dao.postgres;

import com.backend_healthconnect.dao.prescrizioneDAO;
import com.backend_healthconnect.model.prescrizioneDTO;
import com.backend_healthconnect.model.visitaDTO;
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
        String query = "SELECT * FROM prescrizioni WHERE visita_id = ?";
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
}
