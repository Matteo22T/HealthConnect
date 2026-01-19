# HealthConnect 🏥

**HealthConnect** è una piattaforma web completa per la gestione di prenotazioni mediche e cartelle cliniche digitali. Il sistema connette specialisti (Cardiologia, Dermatologia, Pediatria, ecc.) e pazienti attraverso un ecosistema digitale che copre l'intero percorso di cura, dalla ricerca del medico al monitoraggio dei parametri vitali.

---

## 👥 Ruoli e Flussi di Accesso

L'applicazione gestisce tre tipologie di utenti con flussi di registrazione distinti:

* **Paziente:** Registrazione con attivazione immediata dell'account.
* **Medico:** Registrazione vincolata all'inserimento delle qualifiche (Specializzazione, Numero Albo, Biografia). L'account viene creato in stato **"PENDING"** e richiede l'approvazione esplicita di un Amministratore per diventare operativo.
* **Amministratore:** Utente pre-esistente con privilegi di gestione globale.

---

## 🚀 Funzionalità Principali

### 🩺 Per i Pazienti
* **Dashboard Personale:** Panoramica dei prossimi appuntamenti, delle ultime prescrizioni ricevute, dei messaggi non letti e dei propri medici.
* **Ricerca Avanzata:** Ricerca medici con filtro specializzazione, con ordinamento per nome del medico.
* **I Miei Medici** Sezione dedicata con visualizzazione dei propri medici e possibilità di prenotare o messaggiare con loro.
* **Cartella Clinica** Cartella Clinica digitale contenente storico visite, prescrizioni e metriche registrate.
* **Monitoraggio Grafico (Chart.js):** Visualizzazione dell'andamento delle metriche vitali (pressione, peso, glicemia) inserite dal medico tramite grafici interattivi.
* **Prenotazione Visite:** Possibilità di inviare richieste di prenotazione al medico scelto.
* **Calendario** Sezione dedicata alla visualizzazione di tutte le visite e prenotazioni future.
* **Assistente Virtuale AI:**
    * *Supporto:* Risposte a FAQ sulla piattaforma.
    * *Triage Sintomi:* Analisi preliminare dei sintomi tramite API Infermedica (con disclaimer medico). (l'app è momentaneamente in modalità simulazione per conservare le chiamate API poichè limitate, per consentire la visualizzazione della funzionalità il giorno dell'esame)
* **Chat Interna:** Canale di comunicazione diretto con i medici.

### 👨‍⚕️ Per i Medici
* **Profilo Professionale:** Include biografia, specializzazione e **integrazione Google Maps** per mostrare la posizione esatta dell'ambulatorio.
* **Gestione Agenda:** Controllo completo sulle fasce orarie e facoltà di accettare o rifiutare le richieste di prenotazione.
* **Calendario** Sezione dedicata alla visualizzazione di tutte le visite future.
* **Cartella Clinica Digitale:** Accesso all'anagrafica pazienti (dopo accettazione) per gestire:
    * Storico visite e diagnosi.
    * Note private del medico.
    * Inserimento nuove prescrizioni.
    * Registrazione metriche vitali (es. pressione, peso).
* **Chat Interna:** Canale di comunicazione diretto con i pazienti in cura.

### 🛠️ Per gli Amministratori
* **Validazione Medici:** Pannello dedicato "Medici in Attesa" per visualizzare i profili PENDING e approvarne (o rifiutarne) l'iscrizione.
* **Visualizzazione Utenti:** Visualizzazione di tutti gli utenti registrati.
* **Configurazione Piattaforma:** Gestione dinamica delle Specializzazioni (es. aggiunta "Oculistica").

---

## 🔐 Credenziali di Accesso (Mock Data)

Il database è pre-popolato con **10 account totali** per permettere il test immediato di tutti i ruoli e i flussi di lavoro.

🔑 **Password per TUTTI gli account:** `Password1@`

### 🛡️ Amministratore
* **Matteo Tocci**
    * 📧 Email: `admin@healthconnect.com`
    * 📝 *Ruolo:* Gestione globale, approvazione medici, gestione specializzazioni.

### 👨‍⚕️ Medici
* **Dott. Mario Rossi** (Cardiologo)
    * 📧 Email: `mario.rossi@medico.it`
    * 📝 *Note:* Profilo completo con molti pazienti e storico visite.
* **Dott.ssa Laura Verdi** (Dermatologa)
    * 📧 Email: `laura.verdi@medico.it`
* **Dott. Marco Neri** (Ortopedico)
    * 📧 Email: `marco.neri@medico.it`
* **Dott. Giovanni Blu** (Ginecologo - *Account da approvare*)
    * 📧 Email: `giovanni.blu@medico.it`
    * 📝 *Note:* Questo account è in stato **PENDING**. Utile per testare il flusso di approvazione lato Admin.

### 👤 Pazienti
* **Roberto Gialli**
    * 📧 Email: `roberto.gialli@paziente.it`
    * 📝 *Scenario:* Ipertensione (storico metriche completo, chat attiva con il cardiologo).
* **Giulia Neri**
    * 📧 Email: `giulia.neri@paziente.it`
    * 📝 *Scenario:* Acne severa (percorso dermatologico).
* **Luca Bianchi**
    * 📧 Email: `luca.bianchi@paziente.it`
    * 📝 *Scenario:* Traumatologia sportiva (infortunio al ginocchio).
* **Altri Pazienti:** `anna.blu@paziente.it`, `paolo.viola@paziente.it`
