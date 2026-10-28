package br.edu.ifpr.estoufrito.service;

import org.hibernate.annotations.Audited;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ifpr.estoufrito.model.Estatistica;
import br.edu.ifpr.estoufrito.repository.EstatisticaRepository;

@Service 
public class EstatisticaService {
    
    @Autowired 
    private EstatisticaRepository estatisticaRepository;

    public Estatistica buscarEstatistica() {

        return estatisticaRepository.findById(1L).orElseGet(() -> {
            Estatistica novaEstatistica = new Estatistica();
            
            novaEstatistica.setId(1L);

            return estatisticaRepository.save(novaEstatistica);
        });

    }

    public Estatistica somarVenda(float totalVendido, int quantidadeTotalVendida) {
        Estatistica estatistica = buscarEstatistica();

        estatistica.setQuantidadeTotalVendida(estatistica.getQuantidadeTotalVendida() + quantidadeTotalVendida);
        estatistica.setLucroTotal(estatistica.getLucroTotal() + totalVendido);

        return estatisticaRepository.save(estatistica);

    }

}
