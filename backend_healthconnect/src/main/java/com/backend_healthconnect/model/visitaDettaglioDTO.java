package com.backend_healthconnect.model;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class visitaDettaglioDTO extends visitaDTO{
    private List<prescrizioneDTO> prescrizioni;
}
