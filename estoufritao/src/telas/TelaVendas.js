import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import * as api from '../api';
import { estilos } from '../estilos';
import { formatarData, formatarMoeda } from '../util';

export default function TelaVendas() {
    const [listaDeVendas, setListaDeVendas] = useState([]);
    const [estaCarregando, setEstaCarregando] = useState(true);
    const [mensagemDeErro, setMensagemDeErro] = useState('');

    async function carregarVendas() {
        try {
            const vendasRecebidas = await api.listarVendas();
            setListaDeVendas(vendasRecebidas);
            setMensagemDeErro('');
        } catch {
            setMensagemDeErro('Não foi possível carregar as vendas.');
        } finally {
            setEstaCarregando(false);
        }
    }

    useEffect(function carregarAoAbrirTela() {
        api.listarVendas()
            .then(function receberVendas(vendasRecebidas) {
                setListaDeVendas(vendasRecebidas);
                setMensagemDeErro('');
            })
            .catch(function mostrarErroDeVendas() {
                setMensagemDeErro('Não foi possível carregar as vendas.');
            })
            .finally(function encerrarCarregamento() {
                setEstaCarregando(false);
            });
    }, []);

    function mostrarVenda(venda) {
        function mostrarItem(item) {
            return (
                <Text key={item.id} style={estilos.suave}>
                    {item.quantidade} x {item.nomeProduto} - {formatarMoeda(item.precoUnitario)}
                </Text>
            );
        }

        return (
            <View key={venda.id} style={estilos.cartao}>
                <Text style={estilos.nome}>Venda #{venda.id}</Text>
                <Text style={estilos.suave}>{formatarData(venda.dataHora)}</Text>
                <Text style={estilos.texto}>
                    Total: {formatarMoeda(venda.totalVendido)}
                    {' | '}
                    Lucro: {formatarMoeda(venda.lucroTotal)}
                </Text>

                {(venda.itensVenda || []).map(mostrarItem)}
            </View>
        );
    }

    function atualizarVendas() {
        setEstaCarregando(true);
        carregarVendas();
    }

    return (
        <ScrollView
            style={estilos.tela}
            contentContainerStyle={estilos.conteudo}
            refreshControl={
                <RefreshControl refreshing={estaCarregando} onRefresh={atualizarVendas} />
            }
        >
            <Text style={estilos.titulo}>Vendas realizadas</Text>

            {mensagemDeErro !== '' && (
                <Text style={estilos.erro}>{mensagemDeErro}</Text>
            )}

            {listaDeVendas.length === 0 && mensagemDeErro === '' && !estaCarregando && (
                <Text style={estilos.vazio}>Nenhuma venda registrada.</Text>
            )}

            {listaDeVendas.map(mostrarVenda)}
        </ScrollView>
    );
}
