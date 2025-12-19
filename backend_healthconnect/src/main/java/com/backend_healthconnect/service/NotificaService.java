package com.backend_healthconnect.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificaService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void inviaEmail(String a, String oggetto, String testo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("HealthConnect <webproject.unical@gmail.com>");
            message.setTo(a);
            message.setSubject(oggetto);
            message.setText(testo);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Errore invio email: " + e.getMessage());
        }
    }
}