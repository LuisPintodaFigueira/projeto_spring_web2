import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

const CHAVE_TOKEN = 'estoufrito_token';

let token = null;

let aoSessaoExpirar = null;

export async function definirToken(novoToken) {
    token = novoToken;
    if (novoToken) {
        await AsyncStorage.setItem(CHAVE_TOKEN, novoToken);
    } else {
        await AsyncStorage.removeItem(CHAVE_TOKEN);
    }
}

export async function carregarTokenSalvo() {
    const salvo = await AsyncStorage.getItem(CHAVE_ITEM);
    token = salvo;
    return salvo !== null;
}

export function registrarAoSessaoExpirar(funcao) {
    aoSessaoExpirar = funcao;
}

async function requisicao(caminho, metodo = 'GET', corpo) {

    const cabecalhos = {
        'Content-Type': 'application/json'
    }

    if (token) {
        cabecalhos['Authorization'] = 'Bearer ' + token;
    }

    const opcoes = {
        method: metodo,
        headers: cabecalhos
    }

    if (corpo !== undefined) {
        opcoes.body = JSON.stringify(corpo);
    }

    const resposta = await fetch(API_URL + caminho, opcoes);

    if (resposta.status === 401 && token) {
        await definirToken(null);
        if (aoSessaoExpirar) {
            aoSessaoExpirar();
            throw new Error('Sessão expirada');
        }
    }
    const texto = await resposta.text();

    try {
        return texto ? JSON.parse(texto) : null;
    } catch (e) {
        return texto;
    }

}

export const logarUsuario = (dados) => requisicao('/v1/usuarios/login', 'POST', dados);

export const cadastrarUsuario = (dados) => requisicao('/v1/usuarios/cadastro', 'POST', dados);

export const listarProdutos = () => requisicao('/v1/produtos');

export const adicionarProduto = (produto) => requisicao('/v1/produtos', 'POST', produto);

export const alterarProduto = (id, preco) => requisicao(`/v1/produtos/${id}/preco`, 'PUT', { preco });

export const adicionarEstoque = (id, quantidadeEstoque) => requisicao(`/v1/produtos/${id}/estoque`, 'PATCH', { quantidadeEstoque });

export const excluirProduto = (id) => requisicao(`/v1/produtos/produtos/${id}`, 'DELETE');

export const listarVendas = () => requisicao('/v1/vendas/vendas');

export const realizarVenda = (itens) => requisicao('/v1/vendas/vendas', 'POST', { itensPedido: itens });

export const buscarEstatisticas = () => requisicao('/v1/estatisticas');