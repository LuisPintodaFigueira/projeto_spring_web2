package br.edu.ifpr.estoufrito.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import br.edu.ifpr.estoufrito.service.EstatisticaService;
import br.edu.ifpr.estoufrito.dto.EstatisticaResponse;

@RestController
@RequestMapping("/v1/estatisticas")
public class EstatisticaController {

    @Autowired 
    private EstatisticaService estatisticaService;

    @GetMapping
    public EstatisticaResponse buscarEstatisticas() {
        return estatisticaService.buscarEstatistica();
    }
}
