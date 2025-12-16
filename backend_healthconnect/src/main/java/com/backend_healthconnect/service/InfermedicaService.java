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
            rispostaDiagnosisDTO response = restTemplate.postForObject(url, entity, rispostaDiagnosisDTO.class);

            if (response != null) {
                traduciRispostaInItaliano(response);
            }

            int MAX_DOMANDE = 10;
            double SOGLIA_SICUREZZA = 0.65;

            if (response.isHasEmergencyEvidence()) {
                System.out.println("🚨 Rilevata emergenza! STOP Immediato.");
                response.setShouldStop(true);
                response.setQuestion(null);
                return response;
            }

            if (response.getConditions() != null && !response.getConditions().isEmpty()) {
                double prob = response.getConditions().get(0).getProbability();

                if (prob >= SOGLIA_SICUREZZA) {
                    System.out.println("✅ Probabilità sufficiente (" + prob + "). STOP.");
                    response.setShouldStop(true);
                    response.setQuestion(null);
                    return response;
                }
            }

            if (evidence.size() >= MAX_DOMANDE) {
                System.out.println("✋ Raggiunto limite domande (" + evidence.size() + "). STOP.");
                response.setShouldStop(true);
                response.setQuestion(null);
                return response;
            }

            return response;

        } catch (HttpClientErrorException e) {
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
            int risposte = request.getEvidence().size();

            if (risposte == 1) return getMockGroupSingle(2);
            if (risposte == 2) return getMockMultipleChoiceMock();

            return getMockResultResponse();
        }

        if (simulationMode) {
            int currentSize = request.getEvidence().size();
            System.out.println("Simulazione - Evidence size: " + currentSize);

            if (currentSize < 2) {
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

    private void traduciRispostaInItaliano(rispostaDiagnosisDTO response) {
        if (response == null) return;

        if (response.getQuestion() != null) {
            String questionText = response.getQuestion().getText();
            response.getQuestion().setText(translationService.translateToItalian(questionText));

            if (response.getQuestion().getItems() != null) {
                for (rispostaDiagnosisDTO.Item item : response.getQuestion().getItems()) {
                    item.setName(translationService.translateToItalian(item.getName()));

                    if (item.getChoices() != null) {
                        for (rispostaDiagnosisDTO.Choice choice : item.getChoices()) {
                            String label = choice.getLabel().toLowerCase();
                            switch (label) {
                                case "yes": choice.setLabel("Sì"); break;
                                case "no": choice.setLabel("No"); break;
                                case "don't know": choice.setLabel("Non so"); break;
                                default:
                                    choice.setLabel(translationService.translateToItalian(choice.getLabel()));
                                    break;
                            }
                        }
                    }
                }
            }
        }

        if (response.getConditions() != null) {
            for (rispostaDiagnosisDTO.Condition condition : response.getConditions()) {
                String translatedName = translationService.translateToItalian(condition.getCommonName());
                condition.setCommonName(translatedName);
            }
        }
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
        mock.setShouldStop(false);
        mock.setHasEmergencyEvidence(false);

        rispostaDiagnosisDTO.Question q = new rispostaDiagnosisDTO.Question();
        q.setType("single");
        q.setText("[MOCK #" + index + "] Avverti una sensazione di pressione dietro gli occhi?");

        rispostaDiagnosisDTO.Item item = new rispostaDiagnosisDTO.Item();
        item.setId("s_mock_" + index);
        item.setName("Pressione oculare");

        rispostaDiagnosisDTO.Choice c1 = new rispostaDiagnosisDTO.Choice();
        c1.setId("present");
        c1.setLabel("Sì");

        rispostaDiagnosisDTO.Choice c2 = new rispostaDiagnosisDTO.Choice();
        c2.setId("absent");
        c2.setLabel("No");

        rispostaDiagnosisDTO.Choice c3 = new rispostaDiagnosisDTO.Choice();
        c3.setId("unknown");
        c3.setLabel("Non so");

        item.setChoices(List.of(c1, c2, c3));
        q.setItems(List.of(item));

        mock.setQuestion(q);
        mock.setConditions(new ArrayList<>());
        return mock;
    }

    private rispostaDiagnosisDTO getMockResultResponse() {
        rispostaDiagnosisDTO mock = new rispostaDiagnosisDTO();
        mock.setShouldStop(true);
        mock.setHasEmergencyEvidence(false);

        rispostaDiagnosisDTO.Condition c1 = new rispostaDiagnosisDTO.Condition();
        c1.setCommonName("Emicrania da stress (MOCK)");
        c1.setProbability(0.88);

        rispostaDiagnosisDTO.Condition c2 = new rispostaDiagnosisDTO.Condition();
        c2.setCommonName("Sinusite (MOCK)");
        c2.setProbability(0.45);

        mock.setConditions(List.of(c1, c2));
        return mock;
    }

    private rispostaDiagnosisDTO getMockEmergencyResponse() {
        rispostaDiagnosisDTO mock = new rispostaDiagnosisDTO();
        mock.setShouldStop(true);
        mock.setHasEmergencyEvidence(true);

        rispostaDiagnosisDTO.Condition c = new rispostaDiagnosisDTO.Condition();
        c.setCommonName("Sospetta crisi ipertensiva (URGENTE)");
        c.setProbability(0.99);

        mock.setConditions(List.of(c));
        return mock;
    }

    private List<rispostaDiagnosisDTO.Choice> getStandardChoices() {
        rispostaDiagnosisDTO.Choice c1 = new rispostaDiagnosisDTO.Choice();
        c1.setId("present"); c1.setLabel("Sì");
        rispostaDiagnosisDTO.Choice c2 = new rispostaDiagnosisDTO.Choice();
        c2.setId("absent"); c2.setLabel("No");
        rispostaDiagnosisDTO.Choice c3 = new rispostaDiagnosisDTO.Choice();
        c3.setId("unknown"); c3.setLabel("Non so");
        return List.of(c1, c2, c3);
    }

    private rispostaDiagnosisDTO getMockMultipleChoiceMock() {
        rispostaDiagnosisDTO mock = new rispostaDiagnosisDTO();
        mock.setShouldStop(false);
        mock.setHasEmergencyEvidence(false);

        rispostaDiagnosisDTO.Question q = new rispostaDiagnosisDTO.Question();
        q.setType("group_multiple");
        q.setText("[MOCK MULTIPLO] Quali di questi altri fastidi avverti?");

        rispostaDiagnosisDTO.Item item1 = new rispostaDiagnosisDTO.Item();
        item1.setId("s_mock_m1");
        item1.setName("Nausea");
        item1.setChoices(getStandardChoices());

        rispostaDiagnosisDTO.Item item2 = new rispostaDiagnosisDTO.Item();
        item2.setId("s_mock_m2");
        item2.setName("Fastidio alla luce");
        item2.setChoices(getStandardChoices());

        q.setItems(List.of(item1, item2));
        mock.setQuestion(q);
        return mock;
    }

    private rispostaDiagnosisDTO getMockGroupSingle(int index) {
        rispostaDiagnosisDTO mock = new rispostaDiagnosisDTO();
        mock.setShouldStop(false);
        mock.setHasEmergencyEvidence(false);

        rispostaDiagnosisDTO.Question q = new rispostaDiagnosisDTO.Question();
        q.setType("group_single");
        q.setText("[MOCK #" + index + "] Come descriveresti l'intensità del dolore?");

        rispostaDiagnosisDTO.Item i1 = new rispostaDiagnosisDTO.Item();
        i1.setId("s_lieve_" + index); i1.setName("Lieve");

        rispostaDiagnosisDTO.Item i2 = new rispostaDiagnosisDTO.Item();
        i2.setId("s_medio_" + index); i2.setName("Moderato");

        rispostaDiagnosisDTO.Item i3 = new rispostaDiagnosisDTO.Item();
        i3.setId("s_forte_" + index); i3.setName("Severo");

        q.setItems(List.of(i1, i2, i3));
        mock.setQuestion(q);
        mock.setConditions(new ArrayList<>());
        return mock;
    }

    private rispostaDiagnosisDTO getMockSingleQuestion(int index) {
        rispostaDiagnosisDTO mock = new rispostaDiagnosisDTO();
        mock.setShouldStop(false);
        mock.setHasEmergencyEvidence(false);

        rispostaDiagnosisDTO.Question q = new rispostaDiagnosisDTO.Question();
        q.setType("single");
        q.setText("[MOCK #" + index + "] Avverti una sensazione di pressione dietro gli occhi?");

        rispostaDiagnosisDTO.Item item = new rispostaDiagnosisDTO.Item();
        item.setId("s_mock_" + index);
        item.setName("Pressione oculare");
        item.setChoices(getStandardChoices());

        q.setItems(List.of(item));
        mock.setQuestion(q);
        mock.setConditions(new ArrayList<>());
        return mock;
    }
}
