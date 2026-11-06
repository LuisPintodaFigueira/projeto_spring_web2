import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, ScrollView, RefreshControl } from "react-native";
import * as api from '../api';
import Botao from '../componentes/Botao';
import { estilos } from '../estilos';
import { formatarMoeda, lerNumero, avisar, confirmar } from '../utils';

function ProdutoItem({produto, aoMudar}) {
    const [novoPreco, setNovoPreco] = useState('');
    const [qtdAdicionar, setQtdAdicionar] = useState('');
    async function salvarPreco() {
        const preco = lerNumero(novoPreco);
        if (isNaN(preco) || preco <= 0) return avisar('preço inválido');
        try {
            await api.alterarPreco(produto.id, preco);
            setNovoPreco('');
            aoMudar();
        } catch (e) {
            avisar('erro ao alterar preço');
        }
    }

    async function salvarEstoque() {
        const qtd = lerNumero(qtdAdicionar);
        if (!Number.isInteger(qtd) || qtd <= 0) return avisar('quantidade inválida');
        try {
            await api.adicionarEstoque(produto.id, qtd);
            setQtdAdicionar('');
            aoMudar();
        } catch (e) {
            avisar('erro ao adicionar estoque');
        }
    }

    async function excluir() {
        confirmar('remover do estoque', async () => {
            try {
                await api.excluirProduto(produto.id);
                aoMudar();
            } catch (e) {
                avisar('erro ao remover produto');
            }
        });
        
    }

    return (
        <View style={estilos.cartao}>

            <Text style={estilos.nome}>{produto.nome}</Text>
            <Text style={estilos.texto}>
                Preço: {formatarMoeda(produto.preco)} | custo: {formatarMoeda(produto.custo)}
            </Text>
            <Text style={estilos.texto}> Estoque: {produto.quantidade} </Text>

            <View>
                <TextInput
                    style={[estilos.entrada, { flex: 1, marginRight: 8, marginBottom: 0 }]}
                    placeholder="novo preço"
                    keyboardType="decimal-pad"
                    value={novoPreco}
                    onChangeText={setNovoPreco}
                ></TextInput>
                <Botao titulo="Alterar preço" pequeno aoAperta={salvarPreco}></Botao>
            </View>

            <View style={[estilos.linha, { marginTop: 8}]}>
                <TextInput>
                    style={[estilos.entrada, { flex: 1, marginRight: 8, marginBottom: 0 }]}
                    placeholder="quantidade a adicionar"
                    keyboardType="number-pad"
                    value={qtdAdicionar}
                    onChangeText={setQtdAdicionar}
                </TextInput>
                <Botao titulo="Adicionar estoque" pequeno aoAperta={salvarEstoque}></Botao>
            </View>

            <View style={{marginTop: 10}}>
                <Botão titulo="Excluir produto" tipo="perigo" pequeno aoApertar={excluir}></Botão>
            </View>

        </View>
    );

}

export default ProdutosTela() {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [custo, setCusto] = useState('');
    const [estoque, setEstoque] = useState('');

    const carregar = usecallback(async () => {
        setCarregando(true);
        setErro('');
        try {
            setProdutos(await api.listarProdutos());
        } catch (e) {
            setErro('erro ao carregar produtos');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    async function adicionarProduto() {
        const precoNum = lerNumero(preco);
        const custoNum = custo.trim() === '' ? 0 : lerNumero(custo);
        const estoqueNum = estoque.trim() === '' ? 0 : lerNumero(estoque);
        if (nome.trim() === '') return avisar('nome inválido', 'Digite o nome do produto');
        if (isNaN(precoNum) || precoNum < 0) return avisar('preço inválido', 'Digite um preço válido (ex: 8,50)');
        if (isNaN(custoNum) || custoNum < 0) return avisar('custo inválido', 'Digite um número maior ou igual a 0');
        if (!Number.isInteger(estoqueNum) || estoqueNum < 0) return avisar('estoque inválido', 'Digite um número inteiro maior ou igual a 0');
        try {
            await api.adcionarProduto({nome: nome.trim(), preco: precoNum, custo: custoNum, quantidade: estoqueNum});
            setNome('');
            setPreco('');
            setCusto('');
            setEstoque('');
            carregar();
        } catch (e) {
            avisar('erro ao adicionar produto');
        }
    }

    return (

        <ScrollView
        
        style={estilos.tela}
        contentContainerStyle={estilos.conteudo}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar}></RefreshControl>}
        
        >

            <Text style={estilos.titulo}>Novo produto</Text>
            <View style={estilos.cartao}>
                <TextInput style={estilos.entrada} placeholder='Nome (ex: Pastel de carne)' value={nome} onChangeText={setNome}></TextInput>
                <TextInput style={estilos.entrada} placeholder="Preço de venda" keyboardType="decimal-pad" value={preco} onChangeText={setPreco}></TextInput>
                <TextInput style={estilos.entrada} placeholder="Custo (opcional)" keyboardType="decimal-pad" value={custo} onChangeText={setCusto}></TextInput>
                <TextInput style={estilos.entrada} placeholder="Estoque inicial (opcional)" keyboardType="number-pad" value={estoque} onChangeText={setEstoque}></TextInput>
                <Botao titulo="Adicionar produto" aoApertar={adicionar}></Botao>
            </View>

            <Text style={estilos.titulo}>Produtos cadastrados</Text>
            {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}
            {produtos.length === 0 && erro === '' && !carregando && (<Text style={estilos.vazio}>Nenhum produto cadastrado</Text>)}
            {produtos.map((produto) => (
                <ProdutoItem key={produto.id} produto={produto} aoMudar={carregar}></ProdutoItem>
            ))}
        </ScrollView>
    )
}
