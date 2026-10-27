package br.edu.ifpr.estoufrito.service;

import br.edu.ifpr.estoufrito.model.Produto;
import br.edu.ifpr.estoufrito.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> ListarProdutos() {
        return produtoRepository.findAll();
    }

    public Produto adicionarProduto(Produto produto) {

        if (produto.getId() != null) {
            throw new IllegalArgumentException("O ID do produto deve ser nulo ao adicionar um novo produto.");
        }

        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do produto não pode ser nulo.");
        }

        if (produto.getPreco() < 0) {
            throw new IllegalArgumentException("O preço do produto não pode ser nulo ou negativo.");
        }

        if (produto.getQuantidadeEstoque() < 0) {
            throw new IllegalArgumentException("A quantidade em estoque não pode ser nula ou negativa.");
        }

        return produtoRepository.save(produto);
    }

    public Produto alterarPreco(Long id, float novoPreco) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado com o ID: " + id));

        produto.setPreco(novoPreco);
        return produtoRepository.save(produto);
    }

    public Produto adicionarEstoque(Long id,  int quantidade) {
        Produto produto = produtoRepository.findById(id).orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (quantidade < 0) {
            throw new IllegalArgumentException("A quantidade a ser adicionada não pode ser negativa.");
        }

        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + quantidade);

        return produtoRepository.save(produto);

    }

    public Produto removerProduto(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado com o ID: " + id));

        produtoRepository.delete(produto);
        return produto;
    }
}