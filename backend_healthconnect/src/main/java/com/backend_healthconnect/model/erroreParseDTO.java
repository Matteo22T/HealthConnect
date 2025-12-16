package com.backend_healthconnect.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class erroreParseDTO {
    private List<Detail> detail;

    private String message;

    @Getter
    @Setter
    public static class Detail {
        private String msg;
        private String type;
    }
}
