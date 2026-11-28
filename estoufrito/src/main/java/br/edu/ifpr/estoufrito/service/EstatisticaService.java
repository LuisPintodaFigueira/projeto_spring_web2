package br.edu.ifpr.estoufrito.service;

import br.edu.ifpr.estoufrito.dto.EstatisticaResponse;
import br.edu.ifpr.estoufrito.dto.EstatisticaCategoriaResponse;
import br.edu.ifpr.estoufrito.dto.EstatisticaProdutoResponse;
import br.edu.ifpr.estoufrito.model.Categoria;
import br.edu.ifpr.estoufrito.model.Estatistica;
import br.edu.ifpr.estoufrito.model.ItemVenda;
import br.edu.ifpr.estoufrito.model.Produto;
import br.edu.ifpr.estoufrito.model.Venda;
import br.edu.ifpr.estoufrito.repository.CategoriaRepository;
import br.edu.ifpr.estoufrito.repository.EstatisticaRepository;
import br.edu.ifpr.estoufrito.repository.ProdutoRepository;
import br.edu.ifpr.estoufrito.repository.VendaRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EstatisticaService {

    @Autowired
    private EstatisticaRepository estatisticaRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private VendaRepository vendaRepository;

    public EstatisticaResponse buscarEstatistica() {
        Estatistica estatistica = buscarEstatisticaSalva();
        List<EstatisticaCategoriaResponse> totaisPorCategoria = criarTotaisPorCategoria();
        List<Produto> produtos = produtoRepository.findAll();
        List<Venda> vendas = vendaRepository.findByDataFechamentoIsNull();

        for (Venda venda : vendas) {
            if (venda.getItensVenda() == null) {
                continue;
            }

            for (ItemVenda item : venda.getItensVenda()) {
                adicionarItemNasEstatisticas(item, produtos, totaisPorCategoria);
            }
        }

        EstatisticaResponse resposta = new EstatisticaResponse();
        resposta.setQuantidadeTotalVendida(estatistica.getQuantidadeTotalVendida());
        resposta.setLucroTotal(estatistica.getLucroTotal());
        resposta.setTotaisPorCategoria(totaisPorCategoria);
        return resposta;
    }

    public Estatistica somarVenda(BigDecimal lucroDaVenda, int quantidadeVendida) {
        Estatistica estatistica = buscarEstatisticaSalva();

        int quantidadeTotal = estatistica.getQuantidadeTotalVendida() + quantidadeVendida;
        BigDecimal lucroTotal = estatistica.getLucroTotal().add(lucroDaVenda);

        estatistica.setQuantidadeTotalVendida(quantidadeTotal);
        estatistica.setLucroTotal(lucroTotal);
        return estatisticaRepository.save(estatistica);
    }

    public void zerarEstatisticas() {
        Estatistica estatistica = buscarEstatisticaSalva();
        estatistica.setQuantidadeTotalVendida(0);
        estatistica.setLucroTotal(BigDecimal.ZERO);
        estatisticaRepository.save(estatistica);
    }

    private Estatistica buscarEstatisticaSalva() {
        Optional<Estatistica> estatisticaEncontrada = estatisticaRepository.findById(1L);

        if (estatisticaEncontrada.isPresent()) {
            return estatisticaEncontrada.get();
        }

        Estatistica novaEstatistica = new Estatistica();
        novaEstatistica.setId(1L);
        return estatisticaRepository.save(novaEstatistica);
    }

    private List<EstatisticaCategoriaResponse> criarTotaisPorCategoria() {
        List<Categoria> categorias = categoriaRepository.findAll();
        List<EstatisticaCategoriaResponse> totaisPorCategoria = new ArrayList<>();

        for (Categoria categoria : categorias) {
            if (categoria.getNome() != null && !categoria.getNome().trim().isEmpty()) {
                totaisPorCategoria.add(new EstatisticaCategoriaResponse(categoria.getNome()));
            }
        }

        return totaisPorCategoria;
    }

    private void adicionarItemNasEstatisticas(ItemVenda item, List<Produto> produtos,
            List<EstatisticaCategoriaResponse> totaisPorCategoria) {
        if (item == null || item.getQuantidade() <= 0 || item.getPrecoUnitario() == null
                || item.getPrecoUnitario().signum() < 0) {
            return;
        }

        Produto produto = buscarProdutoDaVenda(item, produtos);
        String nomeDaCategoria = "Sem categoria";

        if (produto != null && produto.getCategoria() != null && !produto.getCategoria().trim().isEmpty()) {
            nomeDaCategoria = produto.getCategoria();
        }

        EstatisticaCategoriaResponse totalDaCategoria = buscarCategoria(nomeDaCategoria, totaisPorCategoria);
        String nomeDoProduto = item.getNomeProduto();

        if (nomeDoProduto == null || nomeDoProduto.trim().isEmpty()) {
            if (produto != null && produto.getNome() != null) {
                nomeDoProduto = produto.getNome();
            } else {
                nomeDoProduto = "Produto sem nome";
            }
        }

        EstatisticaProdutoResponse produtoVendido = buscarProdutoVendido(item, nomeDoProduto, totalDaCategoria);

        totalDaCategoria.setQuantidadeVendida(totalDaCategoria.getQuantidadeVendida() + item.getQuantidade());
        BigDecimal valorDoItem = item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade()));
        totalDaCategoria.setTotalVendido(totalDaCategoria.getTotalVendido().add(valorDoItem));
        produtoVendido.setQuantidadeVendida(produtoVendido.getQuantidadeVendida() + item.getQuantidade());

        BigDecimal custoUnitario = item.getCustoUnitario();
        if (custoUnitario == null || custoUnitario.signum() < 0) {
            produtoVendido.setLucroDisponivel(false);
        } else {
            BigDecimal lucroDoItem = item.getPrecoUnitario().subtract(custoUnitario)
                    .multiply(BigDecimal.valueOf(item.getQuantidade()));
            produtoVendido.setLucroTotal(produtoVendido.getLucroTotal().add(lucroDoItem));
        }
    }

    private Produto buscarProdutoDaVenda(ItemVenda item, List<Produto> produtos) {
        for (Produto produto : produtos) {
            if (produto.getId() != null && produto.getId().intValue() == item.getProdutoId()) {
                return produto;
            }
        }

        return null;
    }

    private EstatisticaCategoriaResponse buscarCategoria(String nomeDaCategoria,
            List<EstatisticaCategoriaResponse> totaisPorCategoria) {
        for (EstatisticaCategoriaResponse categoria : totaisPorCategoria) {
            if (categoria.getNome().equals(nomeDaCategoria)) {
                return categoria;
            }
        }

        EstatisticaCategoriaResponse novaCategoria = new EstatisticaCategoriaResponse(nomeDaCategoria);
        totaisPorCategoria.add(novaCategoria);
        return novaCategoria;
    }

    private EstatisticaProdutoResponse buscarProdutoVendido(ItemVenda item, String nomeDoProduto,
            EstatisticaCategoriaResponse categoria) {
        for (EstatisticaProdutoResponse produto : categoria.getProdutosVendidos()) {
            if (produto.getId().equals(String.valueOf(item.getProdutoId()))
                    && produto.getNome().equals(nomeDoProduto)) {
                return produto;
            }
        }

        EstatisticaProdutoResponse novoProduto = new EstatisticaProdutoResponse(
                String.valueOf(item.getProdutoId()), nomeDoProduto);
        categoria.getProdutosVendidos().add(novoProduto);
        return novoProduto;
    }
}
