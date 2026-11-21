package br.edu.ifpr.estoufrito.controller;

import br.edu.ifpr.estoufrito.model.Produto;
import br.edu.ifpr.estoufrito.service.ProdutoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public List<Produto> verTodosOsProdutos() {
        return produtoService.listarProdutos();
    }

    @PostMapping
    public Produto adicionarNovoProduto(@RequestBody Produto produto) {
        return produtoService.adicionarProduto(produto);
    }

    @PutMapping("/{id}/preco")
    public Produto alterarPreco(@PathVariable Long id, @RequestBody(required = false) Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("informe o novo preço");
        }

        return produtoService.alterarPreco(id, produto.getPreco());
    }

    @PutMapping("/{id}/categoria")
    public Produto alterarCategoria(@PathVariable Long id, @RequestBody(required = false) Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("informe a categoria");
        }

        return produtoService.alterarCategoria(id, produto.getCategoria());
    }

    @PatchMapping("/{id}/estoque")
    public Produto adicionarEstoqueProduto(@PathVariable Long id, @RequestBody(required = false) Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("informe a quantidade");
        }
        
        return produtoService.adicionarEstoque(id, produto.getQuantidadeEstoque());
    }

    @DeleteMapping("/produtos/{id}")
    public void excluirProduto(@PathVariable Long id) {
        produtoService.removerProduto(id);
    }

}
