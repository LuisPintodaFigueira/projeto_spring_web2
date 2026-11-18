package br.edu.ifpr.estoufrito.service;

import br.edu.ifpr.estoufrito.dto.ItemPedidoRequest;
import br.edu.ifpr.estoufrito.dto.VendaRequest;
import br.edu.ifpr.estoufrito.model.ItemVenda;
import br.edu.ifpr.estoufrito.model.Produto;
import br.edu.ifpr.estoufrito.model.Venda;
import br.edu.ifpr.estoufrito.repository.ProdutoRepository;
import br.edu.ifpr.estoufrito.repository.VendaRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private EstatisticaService estatisticaService;

    @Transactional
    public Venda finalizarVenda(VendaRequest pedido) {
        if (pedido == null || pedido.getItensPedido() == null || pedido.getItensPedido().isEmpty()) {
            throw new IllegalArgumentException("a venda deve conter pelo menos um produto");
        }

        Venda vendaNova = new Venda();
        vendaNova.setDataHora(LocalDateTime.now());
        vendaNova.setTotalVendido(BigDecimal.ZERO);
        vendaNova.setLucroTotal(BigDecimal.ZERO);
        vendaNova.setItensVenda(new ArrayList<>());

        BigDecimal totalDaVenda = BigDecimal.ZERO;
        BigDecimal lucroDaVenda = BigDecimal.ZERO;
        int quantidadeTotalVendida = 0;

        for (ItemPedidoRequest itemPedido : pedido.getItensPedido()) {
            validarItemPedido(itemPedido);

            Produto produto = buscarProduto(itemPedido.getProdutoId());
            validarEstoque(produto,itemPedido.getQuantidade());
            atualizarEstoque(produto, itemPedido.getQuantidade());

            ItemVenda itemVenda = criarItemVenda(produto, itemPedido, vendaNova);
            vendaNova.getItensVenda().add(itemVenda);

            BigDecimal quantidade = BigDecimal.valueOf(itemPedido.getQuantidade());
            BigDecimal valorDoItem = produto.getPreco().multiply(quantidade);
            BigDecimal lucroDoItem = produto.getPreco().subtract(produto.getCusto()).multiply(quantidade);

            totalDaVenda = totalDaVenda.add(valorDoItem);
            lucroDaVenda = lucroDaVenda.add(lucroDoItem);
            quantidadeTotalVendida = quantidadeTotalVendida + itemPedido.getQuantidade();

        }

        vendaNova.setTotalVendido(totalDaVenda);
        vendaNova.setLucroTotal(lucroDaVenda);

        Venda vendaSalva = vendaRepository.save(vendaNova);

        estatisticaService.somarVenda(lucroDaVenda, quantidadeTotalVendida);

        return vendaSalva;
    }

    public List<Venda> listarVendas() {
        Sort ordemDasVendas = Sort.by("dataHora").descending();
        return vendaRepository.findAll(ordemDasVendas);
    }

    private void validarItemPedido(ItemPedidoRequest itemPedido) {
        if (itemPedido == null || itemPedido.getProdutoId() == null) {
            throw new IllegalArgumentException("informe um produto válido em cada item");
        }

        if (itemPedido.getQuantidade() <= 0) {
            throw new IllegalArgumentException("a quantidade deve ser maior que zero");
        }
    }

    private Produto buscarProduto(Long idDoProduto) {
        Optional<Produto> produtoEncontrado = produtoRepository.findById(idDoProduto);

        if (produtoEncontrado.isEmpty()) {
            throw new IllegalArgumentException("produto não encontrado");
        }

        return produtoEncontrado.get();
    }

    private void validarEstoque(Produto produto, int quantidadePedida) {
        if (quantidadePedida > produto.getQuantidadeEstoque()) {
            throw new IllegalArgumentException("quantidade insuficiente em estoque para o produto: " + produto.getNome());
        }
    }

    private void atualizarEstoque(Produto produto, int quantidadeVendida) {
        int novoEstoque = produto.getQuantidadeEstoque() - quantidadeVendida;
        produto.setQuantidadeEstoque(novoEstoque);
        produtoRepository.save(produto);
    }

    private ItemVenda criarItemVenda(Produto produto, ItemPedidoRequest pedido, Venda venda) {
        ItemVenda itemVenda = new ItemVenda();
        itemVenda.setProdutoId(produto.getId().intValue());
        itemVenda.setQuantidade(pedido.getQuantidade());
        itemVenda.setPrecoUnitario(produto.getPreco());
        itemVenda.setCustoUnitario(produto.getCusto());
        itemVenda.setNomeProduto(produto.getNome());
        itemVenda.setVenda(venda);

        return itemVenda;
    }

}
