package br.edu.ifpr.estoufrito.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import br.edu.ifpr.estoufrito.dto.VendaRequest;
import br.edu.ifpr.estoufrito.service.VendaService;
import br.edu.ifpr.estoufrito.model.Venda;
import java.util.List;

@RestController
@RequestMapping("/v1/vendas")
public class VendaController {

    @Autowired 
    private VendaService vendaService;

    @GetMapping("/vendas")
    public List<Venda> visualizarVendas() {
        return vendaService.listarVendas();
    }

    @PostMapping("/vendas")
    public Venda realizarVenda(@RequestBody VendaRequest vendaRequest) {
        return vendaService.finalizarVenda(vendaRequest);
    }
}
