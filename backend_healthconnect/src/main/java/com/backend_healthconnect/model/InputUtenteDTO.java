package com.backend_healthconnect.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InputUtenteDTO {
    private String text;  // Es: "Ho mal di testa"
    private int age;      // Es: 30
    private String sex;   // Es: "male" o "female"
}