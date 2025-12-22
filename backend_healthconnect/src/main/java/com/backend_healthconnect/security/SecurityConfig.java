package com.backend_healthconnect.security;

import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Configuration
public class SecurityConfig {
    private final utenteDAO utenteDAO;

    public SecurityConfig(utenteDAO utenteDAO) {
        this.utenteDAO = utenteDAO;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disabilita CSRF (ok per API REST standard)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configura CORS

                .authorizeHttpRequests(auth -> auth
                        // 1. Endpoint Pubblici (Login, Register, CheckAuth)
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/check").permitAll()

                        // 2. Protezione per Ruolo
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/utenti/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/specializzazioni/admin/**").hasRole("ADMIN")

                        //medico
                        .requestMatchers("/api/medico/**").hasRole("MEDICO")
                        .requestMatchers("/api/metriche-salute/medico/**").hasRole("MEDICO")
                        .requestMatchers("/api/prenotazioni/accetta/**").hasRole("MEDICO")
                        .requestMatchers("/api/prenotazioni/medico/**").hasRole("MEDICO")
                        .requestMatchers("/api/prenotazioni/rifiuta/**").hasRole("MEDICO")
                        .requestMatchers("/api/visite/oggi/medici/**").hasRole("MEDICO")
                        .requestMatchers("/api/visite/tutti/medici/**").hasRole("MEDICO")
                        .requestMatchers("/api/visite/pazienti/medici/**").hasRole("MEDICO")
                        .requestMatchers("/api/visite/paziente/{id}/medico/**").hasRole("MEDICO")
                        .requestMatchers("/api/visite/medico/salva/**").hasRole("MEDICO")
                        .requestMatchers("/api/visite/num_pazienti/medici/**").hasRole("MEDICO")
                        .requestMatchers("/api/visite/visite_no_diagnosi/medico/**").hasRole("MEDICO")
                        .requestMatchers("/api/auth/modifica/indirizzobiografia").hasRole("MEDICO")

                        //paziente
                        .requestMatchers("/api/paziente/**").hasRole("PAZIENTE")
                        .requestMatchers( "/api/infermedica/**").hasRole("PAZIENTE")
                        .requestMatchers("/api/ai/**").hasRole("PAZIENTE")
                        .requestMatchers("/api/prenotazioni/paziente/**").hasRole("PAZIENTE")
                        .requestMatchers("/api/prenotazioni/rifiutate/paziente/**").hasRole("PAZIENTE")
                        .requestMatchers("/api/visite/medici/paziente/**").hasRole("PAZIENTE")
                        .requestMatchers("/api/visite/future/pazienti/**").hasRole("PAZIENTE")
                        .requestMatchers("/api/visite/storico/pazienti/**").hasRole("PAZIENTE")

                        .requestMatchers("/api/auth/modifica/password").hasAnyRole("PAZIENTE", "MEDICO")
                        .requestMatchers("/api/auth/modifica/profilo").hasAnyRole("PAZIENTE", "MEDICO")
                        .requestMatchers("/api/auth/modifica/emailtelefono").hasAnyRole("PAZIENTE", "MEDICO")
                        // 3. Tutto il resto richiede autenticazione
                        .anyRequest().authenticated()
                )

                // --- CONFIGURAZIONE LOGIN (JSON) ---
                .formLogin(form -> form
                        .loginProcessingUrl("/api/auth/login") // Url che Angular chiamerà
                        .successHandler((req, res, auth) -> {
                            res.setStatus(200);
                            res.setContentType("application/json");
                            // Restituisci l'oggetto utente al FE (senza password!)
                            utenteDTO u = utenteDAO.getUtenteByEmail(auth.getName());
                            u.setPassword(null);
                            new ObjectMapper().writeValue(res.getWriter(), u);
                        })
                        .failureHandler((req, res, ex) -> {
                            res.setStatus(401); // O 403 se preferisci
                            res.setContentType("application/json");

                            String errorMessage = "Credenziali non valide";

                            if (ex instanceof DisabledException) {
                                errorMessage = ex.getMessage();
                            }
                            else if (ex instanceof InternalAuthenticationServiceException && ex.getCause() instanceof DisabledException) {
                                errorMessage = ex.getCause().getMessage();

                            }
                            else if (ex instanceof BadCredentialsException) {
                                errorMessage = "Email o Password errati.";
                            }

                            String jsonResponse = String.format("{\"error\": \"%s\"}", errorMessage);
                            res.getWriter().write(jsonResponse);
                        })
                )

                // --- CONFIGURAZIONE LOGOUT ---
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((req, res, auth) -> res.setStatus(200))
                )

                // --- GESTIONE ERRORI ---
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) -> res.sendError(401, "Non autorizzato"))
                );

        return http.build();
    }

    @Bean
    UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200")); // Il tuo Angular
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // FONDAMENTALE per i cookie!
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
