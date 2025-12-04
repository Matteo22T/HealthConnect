package com.backend_healthconnect.security;

import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.utenteDTO;
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

        return User.builder().username(user.getEmail()).password(user.getPassword()).roles(user.getRuolo().toString()).build();
    }
}
