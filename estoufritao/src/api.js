import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

const CHAVE_TOKEN = 'estoufrito_token';

let tokenAtual = null;
let funcaoExecutadaQuandoSessaoExpirar = null;

export async function salvarTokenNoDispositivo(novoToken) {
    if(Platform.OS === 'web') {
        await AsyncStorage.setItem(CHAVE_TOKEN, novoToken);
        return
    }

    await SecureStore.setItemAsync(CHAVE_TOKEN, novoToken);
}

export async function lerTokenDoDispositivo() {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(CHAVE_DO_TOKEN);
    }

    return await SecureStore.getItemAsync(CHAVE_DO_TOKEN);
}

async function apagarTokenDoDispositivo() {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(CHAVE_DO_TOKEN);
        return;
    }

    await SecureStore.deleteItemAsync(CHAVE_DO_TOKEN);
}

export async function definirToken(novoToken) {
    tokenAtual = novoToken;

    if (novoToken) {
        await salvarTokenNoDispositivo(novoToken);
    } else {
        await apagarTokenDoDispositivo();
    }
}

export function registrarAoSessaoExpirar(funcao) {
    funcaoExecutadaQuandoSessaoExpirar = funcao;
}

export async function carregarTokenSalvo() {
    const tokenSalvo = await lerTokenDoDispositivo();
    tokenAtual = tokenSalvo;
    return tokenSalvo !== null;
}

async function requisicao(caminho, metodo = 'GET', corpo) {

    const cabecalhos = {
        'Content-Type': 'application/json'
    }

    if (tokenAtual) {
        cabecalhos.Authorization = 'Bearer ' + tokenAtual;
    }

    const opcoesDaRequisicao = {
        method: metodo,
        headers: cabecalhos
    }

    if (corpo !== undefined) {
        opcoesDaRequisicao.body = JSON.stringify(corpo);
    }

    const resposta = await fetch(API_URL + caminho, opcoesDaRequisicao);

    if (resposta.status === 401 && token) {
        await definirToken(null);

        if (funcaoExecutadaQuandoSessaoExpirar) {
            funcaoExecutadaQuandoSessaoExpirar();
        }

    }
    const textoDaResposta = await resposta.text();
    let dadosDaResposta;

    try {
        dadosDaResposta = textoDaResposta ? JSON.parse(textoDaResposta) : null;
    } catch (e) {
        dadosDaResposta = textoDaResposta;
    }

    if (!resposta.ok) {
        let mensagem = 'erro HTTP ' + resposta.status;

        if (dadosDaResposta && dadosDaResposta.erro) {
            mensagem = dadosDaResposta.erro;
        } else if (dadosDaResposta && dadosDaResposta.message) {
            mensagem = dadosDaResposta.mensage
        }

        const erro = new Error(mensagem);
        erro.status = resposta.status;
        throw erro;
    }

    return dadosDaResposta;
}

export const logarUsuario = (dadosDelogin) => requisicao('/v1/usuarios/login', 'POST', dadosDelogin);

export const listarProdutos = () => requisicao('/v1/produtos');

export const adicionarProduto = (produto) => requisicao('/v1/produtos', 'POST', produto);

export const alterarProduto = (idDoProduto, novoPreco) => requisicao(`/v1/produtos/${idDoProduto}/preco`, 'PUT', { novoPreco });

export const adicionarEstoque = (id, quantidadeEstoque) => requisicao(`/v1/produtos/${id}/estoque`, 'PATCH', { quantidadeEstoque });

export const excluirProduto = (id) => requisicao(`/v1/produtos/produtos/${id}`, 'DELETE');

export const listarVendas = () => requisicao('/v1/vendas/vendas');

export const realizarVenda = (itens) => requisicao('/v1/vendas/vendas', 'POST', { itensPedido: itens });

export const buscarEstatisticas = () => requisicao('/v1/estatisticas');