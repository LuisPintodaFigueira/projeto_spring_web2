package br.edu.ifpr.estoufrito.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import br.edu.ifpr.estoufrito.service.ProdutoService;
import br.edu.ifpr.estoufrito.model.Produto;
import java.util.List;

@RestController
@RequestMapping("/v1/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public List<Produto> verTodosOsProdutos() {

        System.out.println("Listando produtos...");

        return produtoService.ListarProdutos();
    }

    @PostMapping
    public Produto adicionarNovoProduto(@RequestBody Produto produto) {
        return produtoService.adicionarProduto(produto);
    }

    @PutMapping("/{id}/preco")
    public Produto alterarPrecoProduto(@PathVariable Long id, @RequestBody Produto produto) {
        return produtoService.alterarPreco(id, produto.getPreco());
    }

    @PatchMapping("/{id}/estoque")
    public Produto adicionarEstoqueProduto(@PathVariable Long id, @RequestBody Produto produto) {
        return produtoService.adicionarEstoque(id, produto.getQuantidadeEstoque());
    }

    @DeleteMapping("/produtos/{id}")
    public void excluirProduto(@PathVariable Long id) {
        produtoService.removerProduto(id);
    }

}
