package br.edu.ifpr.estoufrito.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class EstatisticaCategoriaResponse {
    private String nome;
    private int quantidadeVendida;
    private BigDecimal totalVendido = BigDecimal.ZERO;
    private List<EstatisticaProdutoResponse> produtosVendidos = new ArrayList<>();

    public EstatisticaCategoriaResponse() {
    }

    public EstatisticaCategoriaResponse(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public int getQuantidadeVendida() {
        return quantidadeVendida;
    }

    public void setQuantidadeVendida(int quantidadeVendida) {
        this.quantidadeVendida = quantidadeVendida;
    }

    public BigDecimal getTotalVendido() {
        return totalVendido;
    }

    public void setTotalVendido(BigDecimal totalVendido) {
        this.totalVendido = totalVendido;
    }

    public List<EstatisticaProdutoResponse> getProdutosVendidos() {
        return produtosVendidos;
    }
}
