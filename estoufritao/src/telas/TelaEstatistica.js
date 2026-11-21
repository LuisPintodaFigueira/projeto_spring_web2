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
            const [dados, categorias, produtos, vendas] = await Promise.all([
                api.buscarEstatisticas(),
                api.listarCategorias(),
                api.listarProdutos(),
                api.listarVendas(),
            ]);

            if (!Array.isArray(categorias) || !Array.isArray(produtos) || !Array.isArray(vendas)) {
                throw new Error('Dados inválidos.');
            }

            const categoriasValidas = categorias.filter((categoria) =>
                categoria && typeof categoria.nome === 'string' && categoria.nome !== ''
            );
            const totais = categoriasValidas.map((categoria) => ({
                nome: categoria.nome,
                quantidadeVendida: 0,
                totalVendido: 0,
                produtosVendidos: [],
            }));

            vendas.forEach((venda) => {
                const itensDaVenda = venda && Array.isArray(venda.itensVenda) ? venda.itensVenda : [];

                itensDaVenda.forEach((item) => {
                    if (!item) {
                        return;
                    }

                    const produto = produtos.find((produtoDaLista) =>
                        produtoDaLista && String(produtoDaLista.id) === String(item.produtoId)
                    );
                    const quantidade = Number(item.quantidade);
                    const precoUnitario = Number(item.precoUnitario);
                    const custoUnitario = Number(item.custoUnitario);

                    if (!Number.isFinite(quantidade) || quantidade <= 0 ||
                        !Number.isFinite(precoUnitario) || precoUnitario < 0) {
                        return;
                    }

                    const categoria = totais.find((total) =>
                        total.nome === (produto ? produto.categoria : 'Sem categoria')
                    );
                    const categoriaSemCadastro = categoria || totais.find((total) => total.nome === 'Sem categoria');
                    const totalDaCategoria = categoriaSemCadastro || {
                        nome: 'Sem categoria',
                        quantidadeVendida: 0,
                        totalVendido: 0,
                        produtosVendidos: [],
                    };
                    const nomeProduto = item.nomeProduto || (produto && produto.nome) || 'Produto sem nome';
                    let produtoVendido = totalDaCategoria.produtosVendidos.find((produtoDaLista) =>
                        String(produtoDaLista.id) === String(item.produtoId) && produtoDaLista.nome === nomeProduto
                    );

                    if (!produtoVendido) {
                        produtoVendido = {
                            id: item.produtoId || nomeProduto,
                            nome: nomeProduto,
                            quantidadeVendida: 0,
                            lucroTotal: 0,
                            lucroDisponivel: true,
                        };
                        totalDaCategoria.produtosVendidos.push(produtoVendido);
                    }

                    totalDaCategoria.quantidadeVendida += quantidade;
                    totalDaCategoria.totalVendido += quantidade * precoUnitario;
                    produtoVendido.quantidadeVendida += quantidade;

                    const custoValido = item.custoUnitario !== null &&
                        item.custoUnitario !== undefined &&
                        item.custoUnitario !== '' &&
                        Number.isFinite(custoUnitario) &&
                        custoUnitario >= 0;

                    if (custoValido) {
                        produtoVendido.lucroTotal += quantidade * (precoUnitario - custoUnitario);
                    } else {
                        produtoVendido.lucroDisponivel = false;
                    }

                    if (!categoriaSemCadastro) {
                        totais.push(totalDaCategoria);
                    }
                });
            });

            setEstatisticas(dados);
            setTotaisPorCategoria(totais);
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
