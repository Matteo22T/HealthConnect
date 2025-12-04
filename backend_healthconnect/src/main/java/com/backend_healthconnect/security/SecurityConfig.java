package com.backend_healthconnect.security;

import com.backend_healthconnect.dao.utenteDAO;
import com.backend_healthconnect.model.utenteDTO;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                        .requestMatchers("/api/medico/**").hasRole("MEDICO")
                        .requestMatchers("/api/paziente/**").hasRole("PAZIENTE")

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
                        .failureHandler((req, res, ex) -> res.sendError(401, "Credenziali non valide"))
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
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // FONDAMENTALE per i cookie!
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
