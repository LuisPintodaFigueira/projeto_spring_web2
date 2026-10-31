package br.edu.ifpr.estoufrito.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import br.edu.ifpr.estoufrito.service.EstatisticaService;
import br.edu.ifpr.estoufrito.model.Estatistica;

@RestController
@RequestMapping("/v1/estatisticas")
public class EstatisticaController {

    private EstatisticaService estatisticaService;

    @GetMapping("/estatisticas")
    public Estatistica visualizarEstatisticas() {
        return estatisticaService.buscarEstatistica();
    }
}