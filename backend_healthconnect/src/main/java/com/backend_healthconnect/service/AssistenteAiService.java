package com.backend_healthconnect.service;

import com.backend_healthconnect.model.rispostaAiDTO;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AssistenteAiService {

    // Mappa di risposte predefinite basate sugli intenti
    private final Map<String, rispostaAiDTO> risposteMap = new HashMap<>();

    // Mappa di parole chiave per ogni intento
    private final Map<String, List<String>> paroleChiaveMap = new HashMap<>();

    public AssistenteAiService() {
        inizializzaConoscenza();
    }

    private void inizializzaConoscenza() {

        // PRENOTAZIONI
        paroleChiaveMap.put("PRENOTAZIONE", List.of("prenot", "appuntamento", "visita", "calendario", "orari", "disponib"));
        risposteMap.put("PRENOTAZIONE", new rispostaAiDTO(
                "📅 **Gestione Appuntamenti**\nPuoi prenotare una nuova visita nella sezione 'Medici' e controllare quelle già programmate nella sezione 'Calendario' della tua dashboard.",
                "/paziente/dashboard"
        ));

        // PRESCRIZIONI
        paroleChiaveMap.put("PRESCRIZIONE", List.of("prescrizion", "ricetta", "farmac", "medicina", "bianca"));
        risposteMap.put("PRESCRIZIONE", new rispostaAiDTO(
                "💊 **Le tue Ricette**\nTrovi lo storico completo delle tue prescrizioni e i dettagli dei farmaci nella tua sezione 'Cartella Clinica'.",
                "/paziente/cartella"
        ));

        // PROFILO
        paroleChiaveMap.put("PROFILO", List.of("profilo", "account", "email", "dati"));
        risposteMap.put("PROFILO", new rispostaAiDTO(
                "👤 **Il tuo Profilo**\nPuoi aggiornare i tuoi dati personali nella sezione Profilo.",
                "/paziente/profilo"
        ));

        paroleChiaveMap.put("PASSWORD", List.of("password"));
        risposteMap.put("PASSWORD", new rispostaAiDTO(
                "🔐 **Impostazioni**\nPuoi aggiornare la tua password, nelle Impostazioni del tuo account.",
                "/paziente/impostazioni"
        ));

        // MEDICI
        paroleChiaveMap.put("MEDICO", List.of("medico", "dottore", "specialista", "cardiologo"));
        risposteMap.put("MEDICO", new rispostaAiDTO(
                "👨‍⚕️ **I tuoi Medici**\nPuoi cercare un nuovo specialista o vedere i tuoi medici curanti nella sezione 'Medici'.",
                "/paziente/medici"
        ));
    }

    public rispostaAiDTO generaRisposta(String messaggio) {
        if (messaggio == null || messaggio.trim().isEmpty()) {
            return new rispostaAiDTO("Non ho sentito nulla... 👂 Scrivi qualcosa!", null);
        }

        String testo = messaggio.toLowerCase().replaceAll("[^a-z0-9 ]", ""); // Pulisce punteggiatura
        String[] paroleUtente = testo.split("\\s+"); // Divide in parole

        String intentoTrovato = trovaIntento(paroleUtente);

        if (intentoTrovato != null) {
            return risposteMap.get(intentoTrovato);
        }

        if (testo.contains("ciao") || testo.contains("buongiorno") || testo.contains("salve")) {
            return new rispostaAiDTO("Ciao! 👋 Come posso aiutarti oggi su HealthConnect?", null);
        }

        return new rispostaAiDTO(
                "Mi dispiace, non ho capito. 🤖\nProva a usare parole più semplici, ad esempio:\n- \"Voglio prenotare\"\n- \"Le mie ricette\"\n- \"Cambio password\"",
                null
        );
    }

    private String trovaIntento(String[] paroleUtente) {
        for (String parola : paroleUtente) {
            // Controlla ogni parola rispetto alle parole chiave definite
            for (Map.Entry<String, List<String>> entry : paroleChiaveMap.entrySet()) {
                for (String keyword : entry.getValue()) {

                    // A. Match Esatto o Parziale
                    if (parola.contains(keyword) || keyword.contains(parola)) {
                        return entry.getKey();
                    }

                    // B. Match "Fuzzy" (Tollera errori di battitura, es. "ricetta" vs "riceta")
                    // Si applica solo se la parola è abbastanza lunga (> 4 lettere)
                    if (keyword.length() > 4 && calcolaDistanzaLevenshtein(parola, keyword) <= 2) {
                        return entry.getKey();
                    }
                }
            }
        }
        return null;
    }

    // Calcola la distanza di Levenshtein tra due stringhe ovvero il numero minimo di operazioni necessarie per trasformare una stringa nell'altra
    private int calcolaDistanzaLevenshtein(String s1, String s2) {
        // Creiamo una griglia dove le righe rappresentano i caratteri di s1 e le colonne quelli di s2.
        // Le dimensioni sono +1 per includere il caso di "stringa vuota".
        int[][] dp = new int[s1.length() + 1][s2.length() + 1];

        // Esaminiamo ogni cella della griglia e calcoliamo il costo minimo
        for (int i = 0; i <= s1.length(); i++) {
            for (int j = 0; j <= s2.length(); j++) {
                // Caso base: una delle stringhe è vuota
                if (i == 0) {
                    dp[i][j] = j;
                }
                // Caso base: l'altra stringa è vuota
                else if (j == 0) {
                    dp[i][j] = i;
                }
                // calcolo del costo
                else {
                    // Calcolo del costo minimo tra sostituzione, cancellazione e inserimento
                    dp[i][j] = min(
                            // Sostituzione
                            dp[i - 1][j - 1] + costOfSubstitution(s1.charAt(i - 1), s2.charAt(j - 1)),
                            // Cancellazione
                            dp[i - 1][j] + 1,
                            // Inserimento
                            dp[i][j - 1] + 1
                    );
                }
            }
        }
        // L'ultima cella in basso a destra della matrice contiene il numero minimo
        // totale di operazioni necessarie.
        return dp[s1.length()][s2.length()];
    }

    // Costo di sostituzione tra due caratteri ovvero 0 se uguali, 1 altrimenti
    private int costOfSubstitution(char a, char b) {
        return a == b ? 0 : 1;
    }

    // Restituisce il minimo tra una serie di numeri
    private int min(int... numbers) {
        return Arrays.stream(numbers).min().orElse(Integer.MAX_VALUE);
    }
}
