package br.edu.ifpr.estoufrito.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.math.BigDecimal;

@Entity
public class Estatistica{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantidadeTotalVendida;
    private BigDecimal lucroTotal = BigDecimal.ZERO;

    public Estatistica() {
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

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
}