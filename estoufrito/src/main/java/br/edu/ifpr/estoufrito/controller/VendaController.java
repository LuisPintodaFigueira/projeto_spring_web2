package br.edu.ifpr.estoufrito.controller;

import br.edu.ifpr.estoufrito.dto.VendaRequest;
import br.edu.ifpr.estoufrito.model.Venda;
import br.edu.ifpr.estoufrito.service.VendaService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public Venda realizarVenda(@RequestBody(required = false) VendaRequest pedido) {
        return vendaService.finalizarVenda(pedido);
    }
}
