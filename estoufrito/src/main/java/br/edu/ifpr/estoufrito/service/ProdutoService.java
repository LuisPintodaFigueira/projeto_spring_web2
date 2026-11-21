package br.edu.ifpr.estoufrito.service;

import br.edu.ifpr.estoufrito.model.Categoria;
import br.edu.ifpr.estoufrito.model.Produto;
import br.edu.ifpr.estoufrito.repository.CategoriaRepository;
import br.edu.ifpr.estoufrito.repository.ProdutoRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Produto> listarProdutos() {
        Sort ordemPorNome = Sort.by("nome").ascending();
        return produtoRepository.findAll(ordemPorNome);
    }

    public Produto adicionarProduto(Produto produto) {
        validarProdutoNovo(produto);
        return produtoRepository.save(produto);
    }

    public Produto alterarPreco(Long idDoProduto, BigDecimal novoPreco) {
        validarPreco(novoPreco);

        Produto produto = buscarProduto(idDoProduto);
        produto.setPreco(novoPreco);

        return produtoRepository.save(produto);
    }

    public Produto alterarCategoria(Long idDoProduto, String novaCategoria) {
        String nomeDaCategoria = validarCategoria(novaCategoria);

        Produto produto = buscarProduto(idDoProduto);
        produto.setCategoria(nomeDaCategoria);
        return produtoRepository.save(produto);
    }

    public Produto adicionarEstoque(Long idDoProduto,  int quantidadeAdicionada) {
        if (quantidadeAdicionada <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }

        Produto produto = buscarProduto(idDoProduto);
        int novoEstoque = produto.getQuantidadeEstoque() + quantidadeAdicionada;
        produto.setQuantidadeEstoque(novoEstoque);

        return produtoRepository.save(produto);

    }

    public Produto removerProduto(Long idDoProduto) {
        Produto produto = buscarProduto(idDoProduto);
        produtoRepository.delete(produto);
        return produto;
    }

    private void validarProdutoNovo(Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("informe os dados do produto");
        }

        if (produto.getId() != null) {
            throw new IllegalArgumentException("o id deve ficar vazio ao criar um produto");
        }

        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("informe o nome do produto");
        }

        produto.setCategoria(validarCategoria(produto.getCategoria()));

        validarPreco(produto.getPreco());

        if (produto.getCusto() == null || produto.getCusto().signum() < 0) {
            throw new IllegalArgumentException("o custo não pode ser negativo");
        }

        if (produto.getQuantidadeEstoque() < 0) {
            throw new IllegalArgumentException("o estoque não pode ser negativo");
        }
    }

    private void validarPreco(BigDecimal preco) {
        if (preco == null || preco.signum() <= 0) {
            throw new IllegalArgumentException("o preço deve ser maior que zero");
        }
    }

    private String validarCategoria(String nomeDaCategoria) {
        if (nomeDaCategoria == null || nomeDaCategoria.trim().isEmpty()) {
            throw new IllegalArgumentException("Informe uma categoria válida.");
        }

        Optional<Categoria> categoriaEncontrada = categoriaRepository.findByNomeIgnoreCase(nomeDaCategoria.trim());

        if (categoriaEncontrada.isEmpty()) {
            throw new IllegalArgumentException("A categoria informada não existe.");
        }

        return categoriaEncontrada.get().getNome();
    }

    private Produto buscarProduto(Long idDoProduto) {
        Optional<Produto> produtoEncontrado = produtoRepository.findById(idDoProduto);

        if (produtoEncontrado.isEmpty()) {
            throw new IllegalArgumentException("Produto não encontrado com o ID " + idDoProduto);
        }

        return produtoEncontrado.get();
    }
}
