package br.edu.ifpr.estoufrito.repository;

import br.edu.ifpr.estoufrito.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

}
