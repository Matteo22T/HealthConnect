package com.backend_healthconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BackendHealthconnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendHealthconnectApplication.class, args);
    }

}
