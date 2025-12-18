package com.backend_healthconnect.security;

import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.Ruolo;
import com.backend_healthconnect.model.StatoApprovazione;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailServiceImpl implements UserDetailsService {

    private final utenteDAO utenteDAO;

    public UserDetailServiceImpl(utenteDAO utenteDAO) {
        this.utenteDAO = utenteDAO;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        utenteDTO user = utenteDAO.getUtenteByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Utente non trovato: " + email);
        }

        if (user.getRuolo() == Ruolo.MEDICO){
            if (user.getStato_approvazione() == StatoApprovazione.PENDING){
                throw new DisabledException("Il tuo account è in attesa di approvazione.");
            }
            if (user.getStato_approvazione() == StatoApprovazione.RIFIUTATO){
                throw new DisabledException("Il tuo account è stato rifiutato.");
            }
        }

        return User.builder().username(user.getEmail()).password(user.getPassword()).roles(user.getRuolo().toString()).build();
    }
}
