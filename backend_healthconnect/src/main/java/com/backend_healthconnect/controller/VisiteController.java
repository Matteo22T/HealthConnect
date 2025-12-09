package com.backend_healthconnect.controller;

import com.backend_healthconnect.model.visitaDTO;
import com.backend_healthconnect.service.VisiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visite")
@CrossOrigin(origins = "http://localhost:4200")

public class VisiteController {
    @Autowired
    private VisiteService visiteService;

    @GetMapping("/oggi/medici/{id}")
    public List<visitaDTO> getVisiteOdierneMedico(@PathVariable Long id){
        return visiteService.getListaVisiteOdierne(id);
    }
}
