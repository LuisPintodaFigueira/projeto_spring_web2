package br.edu.ifpr.estoufrito.service;

import org.springframework.stereotype.Service;
import br.edu.ifpr.estoufrito.model.Venda;
import br.edu.ifpr.estoufrito.repository.VendaRepository;
import br.edu.ifpr.estoufrito.repository.ProdutoRepository;


@Service
public class VendaService {
    
    private VendaRepository vendaRepository;
    private ProdutoRepository produtoRepository;

    public Venda finalizarVenda() {

        Venda vendaRepository = produtoRepository.findById();
    }
}
