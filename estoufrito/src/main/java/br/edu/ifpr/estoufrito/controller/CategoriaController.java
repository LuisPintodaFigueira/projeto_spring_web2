package br.edu.ifpr.estoufrito.controller;

import br.edu.ifpr.estoufrito.model.Categoria;
import br.edu.ifpr.estoufrito.service.CategoriaService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<Categoria> listarCategorias() {
        return categoriaService.listarCategorias();
    }

    @PostMapping
    public Categoria adicionarCategoria(@RequestBody(required = false) Categoria categoria) {
        return categoriaService.adicionarCategoria(categoria);
    }
}
