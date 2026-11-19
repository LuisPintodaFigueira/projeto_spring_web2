import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as api from '../api';
import Botao from '../componentes/Botao';
import { cores, estilos } from '../estilos';
import { avisar, formatarMoeda } from '../util';

const TODAS_AS_CATEGORIAS = 'TODAS';

export default function TelaPrincipal() {
    const [listaDeProdutos, setListaDeProdutos] = useState([]);
    const [listaDeCategorias, setListaDeCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(TODAS_AS_CATEGORIAS);
    const [quantidadesPorProduto, setQuantidadesPorProduto] = useState({});
    const [estaCarregando, setEstaCarregando] = useState(true);
    const [mensagemDeErro, setMensagemDeErro] = useState('');

    async function carregarProdutos() {
        try {
            const produtosRecebidos = await api.listarProdutos();
            setListaDeProdutos(produtosRecebidos);
            setMensagemDeErro('');
        } catch {
            setMensagemDeErro('Não foi possível carregar os produtos.');
        } finally {
            setEstaCarregando(false);
        }
    }

    useEffect(function carregarProdutosECategoriasAoAbrirTela() {
        Promise.all([api.listarProdutos(), api.listarCategorias()])
            .then(function receberProdutosECategorias(respostas) {
                setListaDeProdutos(respostas[0]);
                setListaDeCategorias(respostas[1]);
                setMensagemDeErro('');
            })
            .catch(function mostrarErroAoCarregar() {
                setMensagemDeErro('Não foi possível carregar os produtos e as categorias.');
            })
            .finally(function encerrarCarregamentoInicial() {
                setEstaCarregando(false);
            });
    }, []);

    function alterarQuantidadeDoProduto(produto, diferenca) {
        setQuantidadesPorProduto(function atualizarQuantidades(quantidadesAtuais) {
            const quantidadeAtual = quantidadesAtuais[produto.id] || 0;
            const novaQuantidade = Math.min(
                Math.max(quantidadeAtual + diferenca, 0),
                produto.quantidadeEstoque
            );

            return {
                ...quantidadesAtuais,
                [produto.id]: novaQuantidade,
            };
        });
    }

    function atualizarProdutos() {
        setEstaCarregando(true);
        carregarProdutosECategorias();
    }

    async function carregarProdutosECategorias() {
        try {
            const respostas = await Promise.all([
                api.listarProdutos(),
                api.listarCategorias(),
            ]);

            setListaDeProdutos(respostas[0]);
            setListaDeCategorias(respostas[1]);
            setMensagemDeErro('');
        } catch {
            setMensagemDeErro('Não foi possível atualizar os produtos e as categorias.');
        } finally {
            setEstaCarregando(false);
        }
    }

    function criarListaDeItensSelecionados() {
        const itensSelecionados = [];

        for (let indice = 0; indice < listaDeProdutos.length; indice += 1) {
            const produto = listaDeProdutos[indice];
            const quantidade = quantidadesPorProduto[produto.id] || 0;

            if (quantidade > 0) {
                itensSelecionados.push({
                    produto: produto,
                    quantidade: quantidade,
                });
            }
        }

        return itensSelecionados;
    }

    function calcularTotalDaVenda(itensSelecionados) {
        let total = 0;

        for (let indice = 0; indice < itensSelecionados.length; indice += 1) {
            const item = itensSelecionados[indice];
            total += item.produto.preco * item.quantidade;
        }

        return total;
    }

    async function finalizarVenda() {
        const itensSelecionados = criarListaDeItensSelecionados();

        if (itensSelecionados.length === 0) {
            avisar('Pedido vazio', 'Escolha ao menos um produto.');
            return;
        }

        const itensParaEnviar = [];

        for (let indice = 0; indice < itensSelecionados.length; indice += 1) {
            const item = itensSelecionados[indice];
            itensParaEnviar.push({
                produtoId: item.produto.id,
                quantidade: item.quantidade,
            });
        }

        try {
            const vendaCriada = await api.realizarVenda(itensParaEnviar);
            const totalDaVenda = vendaCriada
                ? vendaCriada.totalVendido
                : calcularTotalDaVenda(itensSelecionados);

            avisar('Venda realizada!', 'Total: ' + formatarMoeda(totalDaVenda));
            setQuantidadesPorProduto({});
            carregarProdutos();
        } catch {
            avisar('Erro ao finalizar a venda.');
        }
    }

    function mostrarCategoria(categoria) {
        const estaSelecionada = categoriaSelecionada === categoria.nome;
        let estiloDoBotao = estiloBotaoCategoria;
        let estiloDoTexto = estiloTextoCategoria;

        if (estaSelecionada) {
            estiloDoBotao = [estiloBotaoCategoria, estiloBotaoCategoriaSelecionado];
            estiloDoTexto = estiloTextoCategoriaSelecionado;
        }

        return (
            <TouchableOpacity
                key={categoria.id}
                style={estiloDoBotao}
                onPress={function selecionarCategoria() {
                    setCategoriaSelecionada(categoria.nome);
                }}
            >
                <Text style={estiloDoTexto}>{categoria.nome}</Text>
            </TouchableOpacity>
        );
    }

    function mostrarProduto(produto) {
        const quantidadeSelecionada = quantidadesPorProduto[produto.id] || 0;

        return (
            <View key={produto.id} style={[estilos.cartao, estilos.linha]}>
                <View style={{ flex: 1 }}>
                    <Text style={estilos.nome}>{produto.nome}</Text>
                    <Text style={estilos.suave}>
                        Categoria: {produto.categoria || 'Sem categoria'}
                    </Text>
                    <Text style={estilos.texto}>{formatarMoeda(produto.preco)}</Text>
                    <Text style={estilos.suave}>Estoque: {produto.quantidadeEstoque}</Text>
                </View>

                <TouchableOpacity
                    onPress={function diminuirQuantidade() {
                        alterarQuantidadeDoProduto(produto, -1);
                    }}
                    style={estiloBotaoRedondo}
                >
                    <Text style={estiloTextoRedondo}>-</Text>
                </TouchableOpacity>

                <Text style={estiloQuantidade}>{quantidadeSelecionada}</Text>

                <TouchableOpacity
                    onPress={function aumentarQuantidade() {
                        alterarQuantidadeDoProduto(produto, 1);
                    }}
                    style={estiloBotaoRedondo}
                >
                    <Text style={estiloTextoRedondo}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const itensSelecionados = criarListaDeItensSelecionados();
    const totalDaVenda = calcularTotalDaVenda(itensSelecionados);
    const produtosVisiveis = [];

    for (let indice = 0; indice < listaDeProdutos.length; indice += 1) {
        const produto = listaDeProdutos[indice];
        const mostrarTodasAsCategorias = categoriaSelecionada === TODAS_AS_CATEGORIAS;
        const produtoPertenceACategoria = produto.categoria === categoriaSelecionada;

        if (mostrarTodasAsCategorias || produtoPertenceACategoria) {
            produtosVisiveis.push(produto);
        }
    }

    let estiloDoBotaoTodas = estiloBotaoCategoria;
    let estiloDoTextoTodas = estiloTextoCategoria;

    if (categoriaSelecionada === TODAS_AS_CATEGORIAS) {
        estiloDoBotaoTodas = [estiloBotaoCategoria, estiloBotaoCategoriaSelecionado];
        estiloDoTextoTodas = estiloTextoCategoriaSelecionado;
    }

    return (
        <View style={estilos.tela}>
            <View style={estiloCabecalhoCategorias}>
                <Text style={estilos.titulo}>Produtos por categoria</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={estiloListaDeCategorias}
                >
                    <TouchableOpacity
                        style={estiloDoBotaoTodas}
                        onPress={function mostrarTodasAsCategorias() {
                            setCategoriaSelecionada(TODAS_AS_CATEGORIAS);
                        }}
                    >
                        <Text style={estiloDoTextoTodas}>Todas</Text>
                    </TouchableOpacity>

                    {listaDeCategorias.map(mostrarCategoria)}
                </ScrollView>
            </View>

            <ScrollView
                style={estiloConteudoDaVenda}
                contentContainerStyle={estilos.conteudo}
                refreshControl={
                    <RefreshControl refreshing={estaCarregando} onRefresh={atualizarProdutos} />
                }
            >
                <Text style={estilos.titulo}>Nova venda</Text>

                {mensagemDeErro !== '' && (
                    <Text style={estilos.erro}>{mensagemDeErro}</Text>
                )}

                {produtosVisiveis.length === 0 && mensagemDeErro === '' && !estaCarregando && (
                    <Text style={estilos.vazio}>Nenhum produto nesta categoria.</Text>
                )}

                {produtosVisiveis.map(mostrarProduto)}

                <Text style={[estilos.titulo, { marginTop: 8 }]}>Total: {formatarMoeda(totalDaVenda)}</Text>
                <Botao
                    titulo="Finalizar venda"
                    aoApertar={finalizarVenda}
                    desativado={itensSelecionados.length === 0}
                />
            </ScrollView>
        </View>
    );
}

const estiloCabecalhoCategorias = {
    backgroundColor: cores.fundo,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
};

const estiloListaDeCategorias = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
};

const estiloBotaoCategoria = {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cores.principal,
    backgroundColor: '#fff',
};

const estiloBotaoCategoriaSelecionado = {
    backgroundColor: cores.principal,
};

const estiloTextoCategoria = {
    color: cores.principal,
    fontWeight: 'bold',
};

const estiloTextoCategoriaSelecionado = {
    color: '#fff',
    fontWeight: 'bold',
};

const estiloConteudoDaVenda = {
    flex: 1,
};

const estiloBotaoRedondo = {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cores.principal,
    alignItems: 'center',
    justifyContent: 'center',
};

const estiloTextoRedondo = {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
};

const estiloQuantidade = {
    width: 32,
    textAlign: 'center',
    fontSize: 16,
};
