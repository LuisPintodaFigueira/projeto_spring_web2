package br.edu.ifpr.estoufrito.dto;

import java.math.BigDecimal;

public class EstatisticaProdutoResponse {
    private String id;
    private String nome;
    private int quantidadeVendida;
    private BigDecimal lucroTotal = BigDecimal.ZERO;
    private boolean lucroDisponivel = true;

    public EstatisticaProdutoResponse(String id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public String getId() {
        return id;
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

    public BigDecimal getLucroTotal() {
        return lucroTotal;
    }

    public void setLucroTotal(BigDecimal lucroTotal) {
        this.lucroTotal = lucroTotal;
    }

    public boolean isLucroDisponivel() {
        return lucroDisponivel;
    }

    public void setLucroDisponivel(boolean lucroDisponivel) {
        this.lucroDisponivel = lucroDisponivel;
    }
}
