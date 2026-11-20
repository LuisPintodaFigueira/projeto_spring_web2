package br.edu.ifpr.estoufrito.service;

import br.edu.ifpr.estoufrito.model.Categoria;
import br.edu.ifpr.estoufrito.repository.CategoriaRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarCategorias() {
        Sort ordemPorNome = Sort.by("nome").ascending();
        return categoriaRepository.findAll(ordemPorNome);
    }

    public Categoria adicionarCategoria(Categoria categoria) {
        if (categoria == null || categoria.getNome() == null) {
            throw new IllegalArgumentException("Informe o nome da categoria.");
        }

        String nomeDaCategoria = categoria.getNome().trim();

        if (nomeDaCategoria.isEmpty()) {
            throw new IllegalArgumentException("O nome da categoria não pode ficar vazio.");
        }

        if (categoria.getId() != null) {
            throw new IllegalArgumentException("O ID deve ficar vazio ao criar uma categoria.");
        }

        if (categoriaRepository.existsByNomeIgnoreCase(nomeDaCategoria)) {
            throw new IllegalArgumentException("Essa categoria já existe.");
        }

        categoria.setNome(nomeDaCategoria);
        return categoriaRepository.save(categoria);
    }
}
