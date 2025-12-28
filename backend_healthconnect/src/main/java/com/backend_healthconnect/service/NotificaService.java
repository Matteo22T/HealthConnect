package com.backend_healthconnect.service;
import com.backend_healthconnect.dao.ImpostazioniDAO;
import com.backend_healthconnect.model.ImpostazioniNotificheDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificaService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    ImpostazioniDAO impostazioniDAO;

    @Async
    public void inviaEmail(String emailDestinatario, String oggetto, String testo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("HealthConnect <webproject.unical@gmail.com>");
        message.setTo(emailDestinatario);
        message.setSubject(oggetto);
        message.setText(testo);

        mailSender.send(message);
    }

    public ImpostazioniNotificheDTO getImpostazioniNotifiche(Long id){
        return impostazioniDAO.getImpostazioniNotifiche(id);
    }

    public boolean AggiornaNotificheEmail(Long id){
        return impostazioniDAO.AggiornaNotificheEmail(id);
    }
}