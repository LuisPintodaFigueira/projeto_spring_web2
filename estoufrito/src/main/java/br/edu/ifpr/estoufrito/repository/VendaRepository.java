package br.edu.ifpr.estoufrito.repository;

import br.edu.ifpr.estoufrito.model.Venda;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendaRepository extends JpaRepository<Venda, Long> {

    List<Venda> findByDataFechamentoIsNull(Sort ordemDasVendas);

    List<Venda> findByDataFechamentoIsNull();

}

