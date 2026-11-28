import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import * as api from '../api';
import Botao from '../componentes/Botao';
import { estilos } from '../estilos';
import { formatarMoeda } from '../util';

export default function TelaEstatistica() {
    const [estatisticas, setEstatisticas] = useState(null);
    const [totaisPorCategoria, setTotaisPorCategoria] = useState([]);
    const [categoriaAberta, setCategoriaAberta] = useState('');
    const [estaCarregando, setEstaCarregando] = useState(true);
    const [mensagemDeErro, setMensagemDeErro] = useState('');

    const carregarEstatisticas = useCallback(async () => {
        try {
            const dados = await api.buscarEstatisticas();
            setEstatisticas(dados);
            setTotaisPorCategoria(dados.totaisPorCategoria || []);
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

                    {totaisPorCategoria.map((categoria) => (
                        <View key={categoria.nome} style={estilos.cartao}>
                            <Text style={estilos.nome}>{categoria.nome}</Text>
                            <Text style={estilos.texto}>
                                Quantidade vendida: {categoria.quantidadeVendida}
                            </Text>
                            <Text style={estilos.texto}>
                                Total vendido: {formatarMoeda(categoria.totalVendido)}
                            </Text>
                            <Botao
                                titulo={categoriaAberta === categoria.nome ? 'Ocultar detalhes' : 'Detalhes'}
                                pequeno
                                aoApertar={() => setCategoriaAberta(
                                    categoriaAberta === categoria.nome ? '' : categoria.nome
                                )}
                            />

                            {categoriaAberta === categoria.nome && categoria.produtosVendidos.map((produto) => (
                                <View key={produto.id}>
                                    <Text style={estilos.texto}>{produto.nome}</Text>
                                    <Text style={estilos.suave}>
                                        Quantidade: {produto.quantidadeVendida}
                                    </Text>
                                    <Text style={estilos.suave}>
                                        Lucro: {produto.lucroDisponivel
                                            ? formatarMoeda(produto.lucroTotal)
                                            : 'Não disponível'}
                                    </Text>
                                </View>
                            ))}

                            {categoriaAberta === categoria.nome && categoria.produtosVendidos.length === 0 && (
                                <Text style={estilos.suave}>Nenhum produto vendido nesta categoria.</Text>
                            )}
                        </View>
                    ))}
                </>
            )}

            {!estaCarregando && !mensagemDeErro && !estatisticas && (
                <Text style={estilos.vazio}>Nenhuma estatística disponível.</Text>
            )}
        </ScrollView>
    );
}
