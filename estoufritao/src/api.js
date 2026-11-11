import { API_URL } from './config';

async function requisicao(caminho, metodo = 'GET', corpo) {

    const opcoes = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (corpo !== undefined) {
        opcoes.body = JSON.stringify(corpo);
    }

    const resposta = await fetch(API_URL + caminho, opcoes);
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