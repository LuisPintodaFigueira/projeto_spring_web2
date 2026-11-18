package br.edu.ifpr.estoufrito.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ifpr.estoufrito.model.Estatistica;
import br.edu.ifpr.estoufrito.repository.EstatisticaRepository;
import java.math.BigDecimal;
import java.util.Optional;

@Service
public class EstatisticaService {

    @Autowired
    private EstatisticaRepository estatisticaRepository;

    public Estatistica buscarEstatistica() {
        Optional<Estatistica> estatisticaSalva = estatisticaRepository.findById(1L);

        if (estatisticaSalva.isPresent()) {
            return estatisticaSalva.get();
        }

        Estatistica novaEstatistica = new Estatistica();
        novaEstatistica.setId(1L);
        return estatisticaRepository.save(novaEstatistica);
    }

    public Estatistica somarVenda(BigDecimal lucroDaVenda, int quantidadeVendida) {
        Estatistica estatistica = buscarEstatistica();

        int quantidadeTotal = estatistica.getQuantidadeTotalVendida() + quantidadeVendida;
        BigDecimal lucroTotal = estatistica.getLucroTotal().add(lucroDaVenda);

        estatistica.setQuantidadeTotalVendida(quantidadeTotal);
        estatistica.setLucroTotal(lucroTotal);
        return estatisticaRepository.save(estatistica);
    }

}
