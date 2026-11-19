import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import * as api from '../api';
import Botao from '../componentes/Botao';
import { cores, estilos } from '../estilos';
import { avisar, confirmar, formatarMoeda, lerNumero } from '../util';

const TODAS_AS_CATEGORIAS = 'TODAS';

export function ProdutoItem(props) {
    const produto = props.produto;
    const aoAlterarProduto = props.aoMudar;
    const listaDeCategorias = props.categorias;
    const [textoDoNovoPreco, setTextoDoNovoPreco] = useState('');
    const [textoDaQuantidade, setTextoDaQuantidade] = useState('');
    const [estaAlterandoCategoria, setEstaAlterandoCategoria] = useState(false);

    async function mudarCategoria(nomeDaCategoria) {
        if (nomeDaCategoria === produto.categoria || estaAlterandoCategoria) {
            return;
        }

        setEstaAlterandoCategoria(true);

        try {
            await api.alterarCategoriaDoProduto(produto.id, nomeDaCategoria);
            aoAlterarProduto();
        } catch (erro) {
            avisar(erro.message || 'Não foi possível mudar a categoria.');
        } finally {
            setEstaAlterandoCategoria(false);
        }
    }

    function mostrarCategoriaParaProduto(categoria) {
        const categoriaEstaSelecionada = categoria.nome === produto.categoria;
        const estiloDoBotao = categoriaEstaSelecionada
            ? [estiloBotaoCategoria, estiloBotaoCategoriaSelecionado]
            : estiloBotaoCategoria;
        const estiloDoTexto = categoriaEstaSelecionada
            ? estiloTextoCategoriaSelecionado
            : estiloTextoCategoria;

        return (
            <TouchableOpacity
                key={categoria.id}
                style={estiloDoBotao}
                disabled={estaAlterandoCategoria}
                onPress={function selecionarCategoriaDoProduto() {
                    mudarCategoria(categoria.nome);
                }}
            >
                <Text style={estiloDoTexto}>{categoria.nome}</Text>
            </TouchableOpacity>
        );
    }

    async function salvarNovoPreco() {
        const novoPreco = lerNumero(textoDoNovoPreco);

        if (isNaN(novoPreco) || novoPreco <= 0) {
            avisar('Preço inválido.');
            return;
        }

        try {
            await api.alterarPrecoDoProduto(produto.id, novoPreco);
            setTextoDoNovoPreco('');
            aoAlterarProduto();
        } catch {
            avisar('Não foi possível alterar o preço.');
        }
    }

    async function adicionarQuantidadeAoEstoque() {
        const quantidade = lerNumero(textoDaQuantidade);

        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            avisar('Digite uma quantidade inteira maior que zero.');
            return;
        }

        try {
            await api.adicionarProdutosAoEstoque(produto.id, quantidade);
            setTextoDaQuantidade('');
            aoAlterarProduto();
        } catch {
            avisar('Não foi possível adicionar ao estoque.');
        }
    }

    function pedirConfirmacaoParaExcluir() {
        const mensagem = 'Deseja remover ' + produto.nome + ' do estoque?';

        confirmar('Remover produto', mensagem, async function excluirProdutoConfirmado() {
            try {
                await api.excluirProduto(produto.id);
                aoAlterarProduto();
            } catch {
                avisar('Não foi possível remover o produto.');
            }
        });
    }

    return (
        <View style={estilos.cartao}>
            <Text style={estilos.nome}>{produto.nome}</Text>
            <Text style={estilos.suave}>Categoria: {produto.categoria || 'Sem categoria'}</Text>
            {listaDeCategorias.length > 0 && (
                <View style={estiloSeletorDeCategoria}>
                    <Text style={estilos.suave}>Mudar categoria</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={estiloListaDeCategorias}
                    >
                        {listaDeCategorias.map(mostrarCategoriaParaProduto)}
                    </ScrollView>
                </View>
            )}
            <Text style={estilos.texto}>
                Preço: {formatarMoeda(produto.preco)} | Custo: {formatarMoeda(produto.custo)}
            </Text>
            <Text style={estilos.texto}>Estoque: {produto.quantidadeEstoque}</Text>

            <View style={[estilos.linha, estiloLinhaDeEntrada]}>
                <TextInput
                    style={[estilos.entrada, estiloEntradaCompacta]}
                    placeholder="Novo preço"
                    keyboardType="decimal-pad"
                    value={textoDoNovoPreco}
                    onChangeText={setTextoDoNovoPreco}
                />
                <Botao titulo="Alterar preço" pequeno aoApertar={salvarNovoPreco} />
            </View>

            <View style={[estilos.linha, estiloLinhaDeEntrada]}>
                <TextInput
                    style={[estilos.entrada, estiloEntradaCompacta]}
                    placeholder="Quantidade para adicionar"
                    keyboardType="number-pad"
                    value={textoDaQuantidade}
                    onChangeText={setTextoDaQuantidade}
                />
                <Botao
                    titulo="Adicionar estoque"
                    pequeno
                    aoApertar={adicionarQuantidadeAoEstoque}
                />
            </View>

            <View style={estiloBotaoExcluir}>
                <Botao
                    titulo="Excluir produto"
                    tipo="perigo"
                    pequeno
                    aoApertar={pedirConfirmacaoParaExcluir}
                />
            </View>
        </View>
    );
}

export default function TelaProdutos() {
    const [listaDeProdutos, setListaDeProdutos] = useState([]);
    const [listaDeCategorias, setListaDeCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(TODAS_AS_CATEGORIAS);
    const [categoriaDoNovoProduto, setCategoriaDoNovoProduto] = useState('');
    const [estaCarregando, setEstaCarregando] = useState(true);
    const [mensagemDeErro, setMensagemDeErro] = useState('');

    const [nomeDaNovaCategoria, setNomeDaNovaCategoria] = useState('');
    const [nomeDoProduto, setNomeDoProduto] = useState('');
    const [textoDoPreco, setTextoDoPreco] = useState('');
    const [textoDoCusto, setTextoDoCusto] = useState('');
    const [textoDoEstoqueInicial, setTextoDoEstoqueInicial] = useState('');

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

    useEffect(function carregarDadosAoAbrirTela() {
        Promise.all([api.listarProdutos(), api.listarCategorias()])
            .then(function receberProdutosECategorias(respostas) {
                const produtosRecebidos = respostas[0];
                const categoriasRecebidas = respostas[1];

                setListaDeProdutos(produtosRecebidos);
                setListaDeCategorias(categoriasRecebidas);
                setMensagemDeErro('');

                if (categoriasRecebidas.length > 0) {
                    setCategoriaDoNovoProduto(categoriasRecebidas[0].nome);
                }
            })
            .catch(function mostrarErroAoCarregar() {
                setMensagemDeErro('Não foi possível carregar os produtos e as categorias.');
            })
            .finally(function encerrarCarregamentoInicial() {
                setEstaCarregando(false);
            });
    }, []);

    async function cadastrarCategoria() {
        const nomeLimpo = nomeDaNovaCategoria.trim();

        if (nomeLimpo === '') {
            avisar('Digite o nome da categoria.');
            return;
        }

        try {
            const categoriaCriada = await api.adicionarCategoria(nomeLimpo);
            const categoriasRecebidas = await api.listarCategorias();

            setListaDeCategorias(categoriasRecebidas);
            setCategoriaDoNovoProduto(categoriaCriada.nome);
            setCategoriaSelecionada(categoriaCriada.nome);
            setNomeDaNovaCategoria('');
            avisar('Categoria adicionada.');
        } catch (erro) {
            avisar(erro.message || 'Não foi possível adicionar a categoria.');
        }
    }

    async function cadastrarProduto() {
        const preco = lerNumero(textoDoPreco);
        let custo = 0;
        let estoqueInicial = 0;

        if (textoDoCusto.trim() !== '') {
            custo = lerNumero(textoDoCusto);
        }

        if (textoDoEstoqueInicial.trim() !== '') {
            estoqueInicial = lerNumero(textoDoEstoqueInicial);
        }

        if (nomeDoProduto.trim() === '') {
            avisar('Informe o nome do produto.');
            return;
        }

        if (categoriaDoNovoProduto === '') {
            avisar('Crie e escolha uma categoria antes de cadastrar o produto.');
            return;
        }

        if (isNaN(preco) || preco <= 0) {
            avisar('Digite um preço maior que zero.');
            return;
        }

        if (isNaN(custo) || custo < 0) {
            avisar('O custo precisa ser zero ou maior.');
            return;
        }

        if (!Number.isInteger(estoqueInicial) || estoqueInicial < 0) {
            avisar('O estoque precisa ser um número inteiro zero ou maior.');
            return;
        }

        const novoProduto = {
            nome: nomeDoProduto.trim(),
            categoria: categoriaDoNovoProduto,
            preco: preco,
            custo: custo,
            quantidadeEstoque: estoqueInicial,
        };

        try {
            await api.adicionarProduto(novoProduto);
            setNomeDoProduto('');
            setTextoDoPreco('');
            setTextoDoCusto('');
            setTextoDoEstoqueInicial('');
            await carregarProdutos();
        } catch {
            avisar('Não foi possível cadastrar o produto.');
        }
    }

    async function atualizarTela() {
        setEstaCarregando(true);

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

    function mostrarCategoria(categoria) {
        const estaSelecionada = categoriaSelecionada === categoria.nome;
        const estiloDoBotao = estaSelecionada
            ? [estiloBotaoCategoria, estiloBotaoCategoriaSelecionado]
            : estiloBotaoCategoria;
        const estiloDoTexto = estaSelecionada
            ? estiloTextoCategoriaSelecionado
            : estiloTextoCategoria;

        return (
            <TouchableOpacity
                key={categoria.nome}
                style={estiloDoBotao}
                onPress={function selecionarCategoria() {
                    setCategoriaSelecionada(categoria.nome);
                }}
            >
                <Text style={estiloDoTexto}>{categoria.nome}</Text>
            </TouchableOpacity>
        );
    }

    function mostrarOpcaoDeCategoriaParaNovoProduto(categoria) {
        const estaSelecionada = categoriaDoNovoProduto === categoria.nome;
        const estiloDoBotao = estaSelecionada
            ? [estiloBotaoCategoria, estiloBotaoCategoriaSelecionado]
            : estiloBotaoCategoria;
        const estiloDoTexto = estaSelecionada
            ? estiloTextoCategoriaSelecionado
            : estiloTextoCategoria;

        return (
            <TouchableOpacity
                key={categoria.id}
                style={estiloDoBotao}
                onPress={function escolherCategoriaDoProduto() {
                    setCategoriaDoNovoProduto(categoria.nome);
                }}
            >
                <Text style={estiloDoTexto}>{categoria.nome}</Text>
            </TouchableOpacity>
        );
    }

    function mostrarProduto(produto) {
        return (
            <ProdutoItem
                key={produto.id}
                produto={produto}
                categorias={listaDeCategorias}
                aoMudar={carregarProdutos}
            />
        );
    }

    const produtosVisiveis = [];

    for (let indice = 0; indice < listaDeProdutos.length; indice += 1) {
        const produto = listaDeProdutos[indice];
        const mostrarTodas = categoriaSelecionada === TODAS_AS_CATEGORIAS;
        const produtoEstaNaCategoria = produto.categoria === categoriaSelecionada;

        if (mostrarTodas || produtoEstaNaCategoria) {
            produtosVisiveis.push(produto);
        }
    }

    const estiloBotaoTodas = categoriaSelecionada === TODAS_AS_CATEGORIAS
        ? [estiloBotaoCategoria, estiloBotaoCategoriaSelecionado]
        : estiloBotaoCategoria;
    const estiloTextoTodas = categoriaSelecionada === TODAS_AS_CATEGORIAS
        ? estiloTextoCategoriaSelecionado
        : estiloTextoCategoria;

    return (
        <View style={estilos.tela}>
            <View style={estiloCabecalhoCategorias}>
                <Text style={estilos.titulo}>Categorias</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={estiloListaDeCategorias}
                >
                    <TouchableOpacity
                        style={estiloBotaoTodas}
                        onPress={function mostrarTodosOsProdutos() {
                            setCategoriaSelecionada(TODAS_AS_CATEGORIAS);
                        }}
                    >
                        <Text style={estiloTextoTodas}>Todas</Text>
                    </TouchableOpacity>

                    {listaDeCategorias.map(mostrarCategoria)}
                </ScrollView>
            </View>

            <ScrollView
                style={estiloConteudoProdutos}
                contentContainerStyle={estilos.conteudo}
                refreshControl={
                    <RefreshControl refreshing={estaCarregando} onRefresh={atualizarTela} />
                }
            >
                <Text style={estilos.titulo}>Nova categoria</Text>
                <View style={estilos.cartao}>
                    <TextInput
                        style={estilos.entrada}
                        placeholder="Nome da categoria"
                        value={nomeDaNovaCategoria}
                        onChangeText={setNomeDaNovaCategoria}
                    />
                    <Botao titulo="Adicionar categoria" aoApertar={cadastrarCategoria} />
                </View>

                <Text style={estilos.titulo}>Novo produto</Text>
                <View style={estilos.cartao}>
                    <TextInput
                        style={estilos.entrada}
                        placeholder="Nome do produto"
                        value={nomeDoProduto}
                        onChangeText={setNomeDoProduto}
                    />
                    <Text style={estilos.suave}>Escolha a categoria do produto</Text>

                    {listaDeCategorias.length === 0 ? (
                        <Text style={estilos.vazio}>Adicione uma categoria primeiro.</Text>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={estiloListaDeCategorias}
                        >
                            {listaDeCategorias.map(mostrarOpcaoDeCategoriaParaNovoProduto)}
                        </ScrollView>
                    )}

                    <TextInput
                        style={estilos.entrada}
                        placeholder="Preço de venda"
                        keyboardType="decimal-pad"
                        value={textoDoPreco}
                        onChangeText={setTextoDoPreco}
                    />
                    <TextInput
                        style={estilos.entrada}
                        placeholder="Custo (opcional)"
                        keyboardType="decimal-pad"
                        value={textoDoCusto}
                        onChangeText={setTextoDoCusto}
                    />
                    <TextInput
                        style={estilos.entrada}
                        placeholder="Estoque inicial (opcional)"
                        keyboardType="number-pad"
                        value={textoDoEstoqueInicial}
                        onChangeText={setTextoDoEstoqueInicial}
                    />
                    <Botao
                        titulo="Adicionar produto"
                        aoApertar={cadastrarProduto}
                        desativado={listaDeCategorias.length === 0}
                    />
                </View>

                <Text style={estilos.titulo}>Produtos cadastrados</Text>

                {mensagemDeErro !== '' && (
                    <Text style={estilos.erro}>{mensagemDeErro}</Text>
                )}

                {produtosVisiveis.length === 0 && mensagemDeErro === '' && !estaCarregando && (
                    <Text style={estilos.vazio}>Nenhum produto nesta categoria.</Text>
                )}

                {produtosVisiveis.map(mostrarProduto)}
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

const estiloConteudoProdutos = {
    flex: 1,
};

const estiloLinhaDeEntrada = {
    marginTop: 8,
};

const estiloEntradaCompacta = {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
};

const estiloBotaoExcluir = {
    marginTop: 10,
};

const estiloSeletorDeCategoria = {
    marginTop: 8,
};
