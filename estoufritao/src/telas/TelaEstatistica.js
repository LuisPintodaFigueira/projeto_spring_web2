import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text } from 'react-native';
import * as api from '../api';
import { estilos } from '../estilos';
import { formatarMoeda } from '../util';

export default function TelaEstatistica() {
    const [estatisticas, setEstatisticas] = useState(null);
    const [estaCarregando, setEstaCarregando] = useState(true);
    const [mensagemDeErro, setMensagemDeErro] = useState('');

    const carregarEstatisticas = useCallback(async () => {
        try {
            const dados = await api.buscarEstatisticas();
            setEstatisticas(dados);
            setMensagemDeErro('');
        } catch {
            setMensagemDeErro('Não foi possível carregar as estatísticas.');
        } finally {
            setEstaCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarEstatisticas();
    }, [carregarEstatisticas]);

    function atualizarEstatisticas() {
        setEstaCarregando(true);
        carregarEstatisticas();
    }

    return (
        <ScrollView
            style={estilos.tela}
            contentContainerStyle={estilos.conteudo}
            refreshControl={
                <RefreshControl refreshing={estaCarregando} onRefresh={atualizarEstatisticas} />
            }
        >
            <Text style={estilos.titulo}>Estatísticas</Text>

            {mensagemDeErro !== '' && <Text style={estilos.erro}>{mensagemDeErro}</Text>}

            {estatisticas && (
                <>
                    <Text style={estilos.texto}>
                        Quantidade total vendida: {estatisticas.quantidadeTotalVendida}
                    </Text>
                    <Text style={estilos.texto}>
                        Lucro total: {formatarMoeda(estatisticas.lucroTotal)}
                    </Text>
                </>
            )}

            {!estaCarregando && !mensagemDeErro && !estatisticas && (
                <Text style={estilos.vazio}>Nenhuma estatística disponível.</Text>
            )}
        </ScrollView>
    );
}
