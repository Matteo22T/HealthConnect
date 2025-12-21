package com.backend_healthconnect.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ValidazioneEmail {

    @JsonProperty("email_address")
    private String emailAddress;

    @JsonProperty("email_deliverability")
    private EmailDeliverability emailDeliverability;

    @JsonProperty("email_quality")
    private EmailQuality emailQuality;

    @Data
    public static class EmailDeliverability {
        private String status;

        @JsonProperty("status_detail")
        private String statusDetail;

        @JsonProperty("is_format_valid")
        private Boolean isFormatValid;

        @JsonProperty("is_smtp_valid")
        private Boolean isSmtpValid;

        @JsonProperty("is_mx_valid")
        private Boolean isMxValid;

        @JsonProperty("mx_records")
        private List<String> mxRecords;
    }

    @Data
    public static class EmailQuality {
        private Double score;

        @JsonProperty("is_free_email")
        private Boolean isFreeEmail;

        @JsonProperty("is_username_suspicious")
        private Boolean isUsernameSuspicious;

        @JsonProperty("is_disposable")
        private Boolean isDisposable;

        @JsonProperty("is_catchall")
        private Boolean isCatchall;

        @JsonProperty("is_subaddress")
        private Boolean isSubaddress;

        @JsonProperty("is_role")
        private Boolean isRole;

        @JsonProperty("is_dmarc_enforced")
        private Boolean isDmarcEnforced;

        @JsonProperty("is_spf_strict")
        private Boolean isSpfStrict;

        @JsonProperty("minimum_age")
        private Integer minimumAge;
    }
}