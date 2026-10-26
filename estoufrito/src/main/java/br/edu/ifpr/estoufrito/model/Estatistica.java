package br.edu.ifpr.estoufrito.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Estatistica{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantidadeTotalVendida;
    private float lucroTotal;

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

    public float getLucroTotal() {
        return lucroTotal;
    }
    public void setLucroTotal(float lucroTotal) {
        this.lucroTotal = lucroTotal;
    }
}