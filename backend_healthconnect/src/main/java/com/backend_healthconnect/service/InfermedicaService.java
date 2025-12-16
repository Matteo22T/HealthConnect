package com.backend_healthconnect.service;

import com.backend_healthconnect.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InfermedicaService {

    @Autowired
    private TranslationService translationService;

    @Value("${api.infermedica.url}")
    private String infermedicaUrl;

   @Value("${api.infermedica.app-id}")
   private String appId;

   @Value("${api.infermedica.app-key}")
   private String appKey;

    @Value("${app.simulation.mode}")
    private boolean simulationMode;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final RestTemplate restTemplate = new RestTemplate();

   public Object ottieniParseSintomi(String input, String sex, int age){
       if (simulationMode) {
           System.out.println("--- MODALITÀ SIMULAZIONE: Parse ---");
           return getMockQuestionResponse(0);
       }

       String englishText = translationService.translateToEnglish(input);
       System.out.println(englishText);
       richiestaParseDTO richiestaParseDTO = new richiestaParseDTO(englishText, age, sex);



       Object risposta = chiamaInfermedicaParse(richiestaParseDTO);
       if (risposta instanceof erroreParseDTO){
           erroreParseDTO    errore = (erroreParseDTO) risposta;
           System.err.println("--- ERRORE INFERMEDICA RILEVATO ---");

           // Controlliamo se c'è un messaggio di dettaglio
           if (errore.getDetail() != null && !errore.getDetail().isEmpty()) {
               // Stampiamo il primo messaggio di errore
               System.err.println("Messaggio: " + errore.getDetail().get(0).getMsg());
           } else {
               System.err.println("Errore generico (nessun dettaglio nel JSON)");
           }           return risposta;
       }

       rispostaParseDTO rispostaParseDTO = (rispostaParseDTO) risposta;

       if (rispostaParseDTO.getMentions() == null || rispostaParseDTO.getMentions().isEmpty()) {
           System.out.println("Nessun sintomo trovato nel testo.");
           throw new RuntimeException("Nessun sintomo rilevato nel testo.");
       }
       List<richiestaDiagnosisDTO.Evidence> evidenceList = rispostaParseDTO.getMentions().stream()
               .map(mention -> new richiestaDiagnosisDTO.Evidence(
                       mention.getId(),       // ID del sintomo (es. s_21)
                       mention.getChoiceId(), // "present" o "absent"
                       "initial"              // source è sempre "initial" all'inizio
               ))
               .collect(Collectors.toList());
       return callInfermedicaDiagnosis(evidenceList, richiestaParseDTO.getAge(), richiestaParseDTO.getSex());
   }

    private Object callInfermedicaDiagnosis(List<richiestaDiagnosisDTO.Evidence> evidence, richiestaParseDTO.Age age, String sex) {
       System.out.println("callinInfermedicaDiagnosis");
        String url = infermedicaUrl + "/diagnosis";
        HttpHeaders headers = new HttpHeaders();
        headers.set("App-Id", appId);
        headers.set("App-Key", appKey);
        headers.setContentType(MediaType.APPLICATION_JSON);


        richiestaDiagnosisDTO diagnosisRequest = new richiestaDiagnosisDTO(sex, age, evidence);
        try {
            String jsonDebug = new ObjectMapper().writeValueAsString(diagnosisRequest);
            System.out.println(">>> STO INVIANDO QUESTO JSON A DIAGNOSIS: " + jsonDebug);
        } catch (Exception e) {
            System.err.println("Errore stampa debug JSON: " + e.getMessage());
        }
        HttpEntity<richiestaDiagnosisDTO> entity = new HttpEntity<>(diagnosisRequest, headers);

        try {
            // 1. NON fare subito return! Salva la risposta in una variabile.
            rispostaDiagnosisDTO response = restTemplate.postForObject(url, entity, rispostaDiagnosisDTO.class);

            // ============================================================
            // ✋ LOGICA FRENO A MANO (STOP INTELLIGENTE)
            // ============================================================

            // CONFIGURAZIONE
            int MAX_DOMANDE = 10;          // Dopo 10 prove totali, fermati
            double SOGLIA_SICUREZZA = 0.65; // Se sei sicuro al 65%, fermati

            // A. CONTROLLO EMERGENZA (Priorità Massima)
            // Nota: Assicurati di aver aggiunto il campo "has_emergency_evidence" nel DTO
            if (response.isHasEmergencyEvidence()) {
                System.out.println("🚨 Rilevata emergenza! STOP Immediato.");
                response.setShouldStop(true);
                response.setQuestion(null);
                return response;
            }

            // B. CONTROLLO PROBABILITÀ (Sei abbastanza sicuro?)
            if (response.getConditions() != null && !response.getConditions().isEmpty()) {
                // Prendi la prima malattia (la più probabile)
                double prob = response.getConditions().get(0).getProbability();

                if (prob >= SOGLIA_SICUREZZA) {
                    System.out.println("✅ Probabilità sufficiente (" + prob + "). STOP.");
                    response.setShouldStop(true);
                    response.setQuestion(null);
                    return response;
                }
            }

            // C. CONTROLLO NOIA (Troppe domande?)
            if (evidence.size() >= MAX_DOMANDE) {
                System.out.println("✋ Raggiunto limite domande (" + evidence.size() + "). STOP.");
                response.setShouldStop(true);
                response.setQuestion(null);
                return response;
            }

            // ============================================================

            // 2. Se non siamo stati fermati dai freni, restituisci la risposta normale
            return response;

        } catch (HttpClientErrorException e) {
            // ... (Gestione errori invariata) ...
            String errorJson = e.getResponseBodyAsString();
            System.err.println(">>> STATUS CODE: " + e.getStatusCode());
            System.err.println(">>> JSON ERRORE GREZZO: " + errorJson);
            try {
                return objectMapper.readValue(e.getResponseBodyAsString(), erroreDiagnosisDTO.class);
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
                throw new RuntimeException("Errore diagnosi critico: " + ex.getMessage());
            }
        }
    }

   private Object chiamaInfermedicaParse(richiestaParseDTO richiestaParseDTO){
       System.out.println("DEBUG KEYS -> AppId: " + appId + " | AppKey: " + (appKey != null ? "Presente" : "NULL"));
       String url = infermedicaUrl + "/parse";
       HttpHeaders headers = new HttpHeaders();
       headers.set("App-Id", appId);
       headers.set("App-Key", appKey);
       headers.setContentType(MediaType.APPLICATION_JSON);


       HttpEntity<richiestaParseDTO> entity = new HttpEntity<>(richiestaParseDTO, headers);
       try {

           return restTemplate.postForObject(url, entity, rispostaParseDTO.class);

       } catch (HttpClientErrorException e) {
           String errorJson = e.getResponseBodyAsString();


           System.err.println(">>> STATUS CODE: " + e.getStatusCode());
           System.err.println(">>> JSON ERRORE GREZZO: " + errorJson);
           try {
               return objectMapper.readValue(errorJson, erroreParseDTO.class);
           } catch (Exception jsonEx) {
               throw new RuntimeException("Errore critico parsing Infermedica: " + e.getMessage());
           }
       }   }

    public Object aggiornaDiagnosis(richiestaDiagnosisDTO request) {

       System.out.println("aggiornaDiagnosis");

        if (simulationMode) {
            int currentSize = request.getEvidence().size();
            System.out.println("Simulazione - Evidence size: " + currentSize);

            // Se abbiamo meno di 3 risposte, facciamo una NUOVA domanda
            if (currentSize < 3) {
                // Passiamo 'currentSize' per generare un ID diverso ogni volta
                return getMockQuestionResponse(currentSize);
            } else {
                return getMockResultResponse();
            }
        }

        return callInfermedicaDiagnosis(
                request.getEvidence(),
                request.getAge(),
                request.getSex()
        );
    }

    private rispostaParseDTO getMockParseResponse() {
        rispostaParseDTO mock = new rispostaParseDTO();
        rispostaParseDTO.Mention m = new rispostaParseDTO.Mention();
        m.setId("s_21");
        m.setName("Headache");
        m.setCommonName("Headache");
        m.setChoiceId("present");
        m.setType("symptom");

        mock.setMentions(List.of(m));
        return mock;
    }

    private rispostaDiagnosisDTO getMockQuestionResponse(int index) {
        rispostaDiagnosisDTO mock = new rispostaDiagnosisDTO();
        mock.setShouldStop(false); // CONTINUA

        rispostaDiagnosisDTO.Question q = new rispostaDiagnosisDTO.Question();
        q.setType("group_single");
        q.setText("[SIMULAZIONE] Il dolore è pulsante?");

        rispostaDiagnosisDTO.Item item = new rispostaDiagnosisDTO.Item();
        item.setId("s_mock_1"+ index);
        item.setName("Dolore pulsante");

        rispostaDiagnosisDTO.Choice c1 = new rispostaDiagnosisDTO.Choice();
        c1.setId("present"); c1.setLabel("Sì");
        rispostaDiagnosisDTO.Choice c2 = new rispostaDiagnosisDTO.Choice();
        c2.setId("absent"); c2.setLabel("No");

        item.setChoices(List.of(c1, c2));
        q.setItems(List.of(item));

        mock.setQuestion(q);
        mock.setConditions(new ArrayList<>()); // Lista vuota mentre fa domande
        return mock;
    }

    private rispostaDiagnosisDTO getMockResultResponse() {
        rispostaDiagnosisDTO mock = new rispostaDiagnosisDTO();
        mock.setShouldStop(true); // STOP -> Mostra risultati
        mock.setQuestion(null);

        rispostaDiagnosisDTO.Condition c1 = new rispostaDiagnosisDTO.Condition();
        c1.setId("c_1");
        c1.setCommonName("Emicrania (Simulata)");
        c1.setProbability(0.95);

        rispostaDiagnosisDTO.Condition c2 = new rispostaDiagnosisDTO.Condition();
        c2.setId("c_2");
        c2.setCommonName("Cefalea tensiva (Simulata)");
        c2.setProbability(0.70);

        mock.setConditions(List.of(c1, c2));
        return mock;
    }

}
