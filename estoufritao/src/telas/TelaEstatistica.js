import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import * as api from '../api';
import { estilos, cores } from '../estilos';
import { formatarMoeda } from '../util';

export default function TelaEStatistica() {
    const [estatistica, setEstatistica] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [MensagemDeErro, setMensagemDeErro] = useState('');

    async function carregarEstatisticas() {
        try {
            const dadosRecebidos = await api.buscarEstatisticas();
            setEstatistica(dadosRecebidos);
            setMensagemDeErro('');
        } catch {
            setMensagemDeErro('Não foi possível carregar as estatísticas')
        } finally {
            setCarregando(false);
        }
    }

    function atualizarEstatisticas() {
        setCarregando(true);
        carregarEstatisticas();
    }

    useEffect(function carregarAoAbrirTela())

    return (
        <ScrollView
        
        style={estilos.tela}
        contentConrainerStyle={estilos.conteudo}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar}></RefreshControl>}

        >
            <Text style={estilos.titulo}>Estatístiscas</Text>
            {erro !== '' && <Text Style={estilos.erro}>{erro}</Text>}

            {estatistica && (
                <View>
                    <View style={estilos.cartao}>
                        <Text style={estilos.suave}>Quantidade total de vendida</Text>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: cores.texto }}>
                            {estatistica.quantidadeTotalVendida}
                        </Text>
                    </View>

                    <View style={estilos.cartao}>
                        <Text style={estilos.suave}>Lucro total</Text>
                        <Text style={{ fontSize: 32, fontWeight: 'bold', color: cores.sucesso }}>
                            {formatarMoeda(estatistica.lucroTotal)}
                        </Text>
                    </View>
                </View>
            )}

            <Text style={estilos.suave}>Puxe a tela para baixo para atualizar</Text>
        </ScrollView>
    )
}