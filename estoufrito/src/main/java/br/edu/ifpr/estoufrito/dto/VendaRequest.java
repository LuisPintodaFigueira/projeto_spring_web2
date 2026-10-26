package br.edu.ifpr.estoufrito.dto;

import java.util.ArrayList;
import java.util.List;

public class VendaRequest {
    private List<ItemPedidoRequest> itensPedido = new ArrayList<>();

    public List<ItemPedidoRequest> getItensPedido() {
        return itensPedido;
    }
    public void setItensPedido(List<ItemPedidoRequest> itensPedido) {
        this.itensPedido = itensPedido;
    }

}
