package com.backend_healthconnect.service;


import com.backend_healthconnect.dao.medicoDAO;
import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.Ruolo;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticazioneService {

    @Autowired
    private utenteDAO utenteDAO;

    @Autowired
    private medicoDAO medicoDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ValidazioneEmailService seriviceEmail;


    public utenteDTO getUtenteByEmail(String email){
        utenteDTO utente = this.utenteDAO.getUtenteByEmail(email);
        if (utente != null) utente.setPassword(null);

        return utente;
    }

    public void registraUtente(utenteDTO utente){
        if (this.utenteDAO.getUtenteByEmail(utente.getEmail()) != null){
            throw new IllegalArgumentException("Email già registrata!");
        }

        boolean isReale = seriviceEmail.emailReale(utente.getEmail());
        if (!isReale) {
            throw new IllegalArgumentException("L'indirizzo email inserito non è valido o è inesistente.");
        }

        String cryptedPassword = passwordEncoder.encode(utente.getPassword());
        utente.setPassword(cryptedPassword);

        utenteDTO nuovoUtente = this.utenteDAO.save(utente);

        if ( nuovoUtente.getRuolo() == Ruolo.MEDICO){
            this.medicoDAO.save(nuovoUtente.getId(), nuovoUtente.getSpecializzazione_id(), nuovoUtente.getNumero_albo(), nuovoUtente.getBiografia(), nuovoUtente.getIndirizzo_studio(), nuovoUtente.getStato_approvazione());
        }
    }



    public utenteDTO modificaDatiPersonaliUtente(Long idUtente, String email, Long telefono){
        return this.utenteDAO.modificaProfilo(idUtente, email, telefono);
    }

    public utenteDTO modificaDatiProfessionaliUtente(Long idUtente, String indirizzo, String biografia){
        return this.utenteDAO.modificaProfiloProfessionale(idUtente, indirizzo, biografia);
    }

    public void cambiaPassword(Long id,String passwordAttuale, String nuovaPassword){
        utenteDTO utente = this.utenteDAO.getUtenteById(id);
        if (!passwordEncoder.matches(passwordAttuale, utente.getPassword())) {
            throw new RuntimeException("Password attuale errata");
        }

        String passwordHashed = passwordEncoder.encode(nuovaPassword);

        utenteDAO.cambiaPassword(id, passwordHashed);
    }

}
