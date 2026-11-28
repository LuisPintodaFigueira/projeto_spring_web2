import { API_URL } from './config';

async function requisicao(caminho, metodo = 'GET', corpo) {

    const cabecalhos = {
        'Content-Type': 'application/json'
    }

    const opcoesDaRequisicao = {
        method: metodo,
        headers: cabecalhos
    }

    if (corpo !== undefined) {
        opcoesDaRequisicao.body = JSON.stringify(corpo);
    }

    const resposta = await fetch(API_URL + caminho, opcoesDaRequisicao);

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
            mensagem = dadosDaResposta.message;
        }

        const erro = new Error(mensagem);
        erro.status = resposta.status;
        throw erro;
    }

    return dadosDaResposta;
}

export const listarProdutos = () => requisicao('/v1/produtos');

export const listarCategorias = () => requisicao('/v1/categorias');

export const adicionarCategoria = (nome) => requisicao('/v1/categorias', 'POST', { nome });

export const adicionarProduto = (produto) => requisicao('/v1/produtos', 'POST', produto);

export const alterarPrecoDoProduto = (idDoProduto, novoPreco) => requisicao(`/v1/produtos/${idDoProduto}/preco`, 'PUT', { preco: novoPreco });

export const adicionarProdutosAoEstoque = (id, quantidadeEstoque) => requisicao(`/v1/produtos/${id}/estoque`, 'PATCH', { quantidadeEstoque });

export const alterarCategoriaDoProduto = (id, categoria) => requisicao(`/v1/produtos/${id}/categoria`, 'PUT', { categoria });

export const excluirProduto = (id) => requisicao(`/v1/produtos/produtos/${id}`, 'DELETE');

export const listarVendas = () => requisicao('/v1/vendas/vendas');

export const realizarVenda = (itens) => requisicao('/v1/vendas/vendas', 'POST', { itensPedido: itens });

export const finalizarDia = () => requisicao('/v1/vendas/finalizar-dia', 'POST');

export const buscarEstatisticas = () => requisicao('/v1/estatisticas');
