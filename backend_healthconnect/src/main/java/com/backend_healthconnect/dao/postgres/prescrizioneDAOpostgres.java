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

    @Autowired
    visitaDAOpostgres visitaDAO;

    @Override
    public List<prescrizioneDTO> getPrescrizioniByVisita(Long id){

        List<prescrizioneDTO> prescrizioni = new ArrayList<>();

        String query = "SELECT * FROM prescrizioni WHERE visita_id = ?";

        try(Connection conn = dataSource.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query)){

            stmt.setLong(1,id);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()){
                prescrizioneDTO prescrizioneDTO = new prescrizioneDTO();

                prescrizioneDTO.setId(rs.getLong("id"));

                Long id_visita = rs.getLong("visita_id");

                visitaDTO visitaDTO = visitaDAO.getVisitaById(id_visita);
                prescrizioneDTO.setVisita(visitaDTO);

                prescrizioneDTO.setNome_farmaco(rs.getString("nome_farmaco"));
                prescrizioneDTO.setDosaggio(rs.getString("dosaggio"));
                prescrizioneDTO.setDataEmissione(rs.getDate("data_emissione").toLocalDate());
                prescrizioneDTO.setDataFine(rs.getDate("data_fine").toLocalDate());


                prescrizioni.add(prescrizioneDTO);
            }
            return prescrizioni;
        }
        catch (SQLException e){
            throw new RuntimeException(e);
        }
    }
}
