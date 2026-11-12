package br.edu.ifpr.estoufrito.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.edu.ifpr.estoufrito.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByNome(String nome);

    boolean existsByNome(String nome);

}
