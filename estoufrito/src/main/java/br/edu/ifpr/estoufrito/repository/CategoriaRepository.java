package br.edu.ifpr.estoufrito.repository;

import br.edu.ifpr.estoufrito.model.Categoria;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    boolean existsByNomeIgnoreCase(String nome);

    Optional<Categoria> findByNomeIgnoreCase(String nome);
}
