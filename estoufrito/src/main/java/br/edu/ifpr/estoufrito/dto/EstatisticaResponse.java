package br.edu.ifpr.estoufrito.dto;

import java.math.BigDecimal;
import java.util.List;

public class EstatisticaResponse {
    private int quantidadeTotalVendida;
    private BigDecimal lucroTotal = BigDecimal.ZERO;
    private List<EstatisticaCategoriaResponse> totaisPorCategoria;

    public int getQuantidadeTotalVendida() {
        return quantidadeTotalVendida;
    }

    public void setQuantidadeTotalVendida(int quantidadeTotalVendida) {
        this.quantidadeTotalVendida = quantidadeTotalVendida;
    }

    public BigDecimal getLucroTotal() {
        return lucroTotal;
    }

    public void setLucroTotal(BigDecimal lucroTotal) {
        this.lucroTotal = lucroTotal;
    }

    public List<EstatisticaCategoriaResponse> getTotaisPorCategoria() {
        return totaisPorCategoria;
    }

    public void setTotaisPorCategoria(List<EstatisticaCategoriaResponse> totaisPorCategoria) {
        this.totaisPorCategoria = totaisPorCategoria;
    }
}
