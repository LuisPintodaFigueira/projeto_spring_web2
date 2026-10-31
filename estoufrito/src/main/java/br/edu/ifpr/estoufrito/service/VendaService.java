package br.edu.ifpr.estoufrito.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.edu.ifpr.estoufrito.dto.VendaRequest;
import br.edu.ifpr.estoufrito.model.Venda;
import br.edu.ifpr.estoufrito.repository.VendaRepository;
import br.edu.ifpr.estoufrito.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import br.edu.ifpr.estoufrito.dto.ItemPedidoRequest;
import br.edu.ifpr.estoufrito.model.Produto;
import br.edu.ifpr.estoufrito.model.ItemVenda;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private EstatisticaService estatisticaService;

    @Transactional
    public Venda finalizarVenda(VendaRequest request) {

        if (request.getItensPedido() == null || request.getItensPedido().isEmpty()) {
            throw new IllegalArgumentException("A venda deve conter pelo menos um produto.");
        }

        Venda vendaNova = new Venda();
        vendaNova.setDataHora(LocalDateTime.now());
        vendaNova.setTotalVendido(0f);
        vendaNova.setLucroTotal(0f);
        vendaNova.setItensVenda(new ArrayList<>());

        float totalVendido = 0f;
        float lucroTotal = 0f;
        int quantidadeTotal = 0;

        for (ItemPedidoRequest itemPedido : request.getItensPedido()) {

            Produto produto = produtoRepository.findById(itemPedido.getProdutoId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));

            if (itemPedido.getQuantidade() < 0) {
                throw new IllegalArgumentException(
                        "Quantidade inválida para o produto: " + produto.getNome());
            }

            if (itemPedido.getQuantidade() > produto.getQuantidadeEstoque()) {
                throw new IllegalArgumentException(
                        "Quantidade insuficiente em estoque para o produto: " + produto.getNome());
            }

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - itemPedido.getQuantidade());
            produtoRepository.save(produto);

            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setProdutoId(produto.getId().intValue());
            itemVenda.setQuantidade(itemPedido.getQuantidade());
            itemVenda.setPrecoUnitario(produto.getPreco());
            itemVenda.setCustoUnitario(produto.getCusto());
            itemVenda.setNomeProduto(produto.getNome());

            itemVenda.setVenda(vendaNova);

            vendaNova.getItensVenda().add(itemVenda);

            totalVendido += produto.getPreco() * itemPedido.getQuantidade();
            lucroTotal += (produto.getPreco() - produto.getCusto()) * itemPedido.getQuantidade();
            quantidadeTotal += itemPedido.getQuantidade();

        }

        vendaNova.setTotalVendido(totalVendido);
        vendaNova.setLucroTotal(lucroTotal);

        Venda vendaSalva = vendaRepository.save(vendaNova);

        estatisticaService.somarVenda(lucroTotal, quantidadeTotal);

        return vendaSalva;
    }

    public List<Venda> listarVendas() {
        return vendaRepository.findAll();
    }

}
