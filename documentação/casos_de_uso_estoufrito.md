# **Casos de uso \- EstouFrito**

O sistema é de uso interno e não tem contas ou login. O atendente abre o aplicativo e usa as funções disponíveis.

## **1\. Cadastrar categoria**

Ator: Atendente

Pré-condição: o aplicativo e o backend estão funcionando.

Fluxo principal:

1. Na aba "Produtos", o usuário digita o nome da categoria.  
2. Aperta "Adicionar categoria".  
3. A categoria é salva, aparece na lista e fica selecionada. Aparece o aviso "Categoria adicionada.".

Fluxos alternativos:

* Se o nome estiver vazio, aparece "Digite o nome da categoria.".  
* Se a categoria já existir (maiúscula e minúscula contam igual), aparece "Essa categoria já existe.".

## **2\. Cadastrar produto**

Ator: Atendente

Pré-condição: o aplicativo e o backend estão funcionando e há pelo menos uma categoria cadastrada.

Fluxo principal:

1. Na aba "Produtos", o usuário preenche o nome, escolhe a categoria e digita o preço. O custo e o estoque inicial são opcionais.  
2. Aperta "Adicionar produto".  
3. O backend confere se a categoria existe e salva o produto, que aparece na lista de produtos cadastrados.

Fluxos alternativos:

* Se não houver categoria, aparece "Adicione uma categoria primeiro." e o botão fica desativado.  
* Se o nome estiver vazio ou o preço for zero, negativo ou estiver em branco, aparece um aviso pedindo para corrigir.  
* Se o custo for negativo ou o estoque não for um número inteiro, também aparece um aviso.  
* Se o backend recusar o produto (por exemplo, porque a categoria não existe), aparece "Não foi possível cadastrar o produto.".

## **3\. Consultar e filtrar produtos**

Ator: Atendente

Pré-condição: o aplicativo e o backend estão funcionando.

Fluxo principal:

1. O usuário abre a aba "Nova venda" ou "Produtos".  
2. O aplicativo mostra os produtos com nome, categoria, preço e estoque.  
3. O usuário aperta em uma categoria no topo para ver só os produtos dela. O botão "Todas" mostra tudo de novo.

Fluxos alternativos:

* Se a categoria não tiver produtos, aparece "Nenhum produto nesta categoria.".  
* Se der erro ao carregar, aparece uma mensagem em vermelho.

## **4\. Alterar um produto (preço, estoque ou categoria)**

Ator: Atendente

Pré-condição: o aplicativo e o backend estão funcionando e há um produto cadastrado.

Fluxo principal:

1. Na aba "Produtos", o usuário vai no cartão do produto.  
2. Para mudar o preço, digita o valor novo e aperta "Alterar preço". Para repor estoque, digita a quantidade e aperta "Adicionar estoque". Para trocar a categoria, aperta na categoria desejada em "Mudar categoria".  
3. O aplicativo atualiza a lista com o valor novo.

Fluxos alternativos:

* Se o preço for vazio, zero ou negativo, aparece "Preço inválido.".  
* Se a quantidade não for um número inteiro maior que zero, aparece "Digite uma quantidade inteira maior que zero.".  
* Se a categoria escolhida não existir no banco, o backend recusa e aparece o aviso "A categoria informada não existe.".  
* Se outra coisa der errado no backend, aparece um aviso dizendo que não foi possível fazer a alteração.

## **5\. Excluir produto**

Ator: Atendente

Pré-condição: o aplicativo e o backend estão funcionando e há um produto cadastrado.

Fluxo principal:

1. No cartão do produto, o usuário aperta o botão vermelho "Excluir produto".  
2. O aplicativo pergunta se ele quer mesmo remover o produto.  
3. O usuário confirma e o produto some da lista.

Fluxo alternativo: se o usuário cancelar, nada é apagado.

## **6\. Realizar venda**

Ator: Atendente

Pré-condição: o aplicativo e o backend estão funcionando e há produtos com estoque.

Fluxo principal:

1. Na aba "Nova venda", o usuário aperta o "+" de cada produto que o cliente pediu. O "-" diminui a quantidade.  
2. O aplicativo mostra o total da venda.  
3. O usuário aperta "Finalizar venda".  
4. O backend desconta o estoque, calcula o total e o lucro, salva a venda e atualiza as estatísticas.  
5. O aplicativo mostra "Venda realizada\!" com o total e atualiza o estoque na tela.

Fluxos alternativos:

* O botão "+" não deixa passar da quantidade que existe em estoque.  
* Se nenhum produto foi escolhido, o botão fica desativado.  
* Se faltar estoque quando a venda chega no backend, a venda não é salva, o estoque não muda e aparece "Erro ao finalizar a venda.".

## **7\. Consultar vendas e estatísticas**

Ator: Atendente

Pré-condição: o aplicativo e o backend estão funcionando.

Fluxo principal:

1. Na aba "Vendas", o usuário vê as vendas do dia, da mais recente para a mais antiga, com data, total, lucro e os itens vendidos.  
2. Na aba "Estatísticas", vê a quantidade total vendida e o lucro total, e embaixo um cartão para cada categoria com a quantidade vendida e o total vendido.  
3. Para ver os produtos de uma categoria, aperta "Detalhes". Aparece cada produto vendido com a quantidade e o lucro dele. Apertando "Ocultar detalhes" a lista some.

Fluxos alternativos:

* Se ainda não houve venda, a aba "Vendas" mostra "Nenhuma venda registrada." e as estatísticas aparecem zeradas.  
* Se uma categoria não vendeu nada, o detalhe mostra "Nenhum produto vendido nesta categoria.".  
* Se der erro ao carregar, aparece uma mensagem em vermelho.

## **8\. Finalizar o dia**

Ator: Atendente

Pré-condição: o aplicativo e o backend estão funcionando e há pelo menos uma venda registrada.

Fluxo principal:

1. O usuário aperta o botão vermelho "Finalizar dia" no topo da tela.  
2. O aplicativo avisa que as abas Vendas e Estatísticas serão zeradas, que as vendas ficam salvas no banco e que não aparecem mais no aplicativo, e pergunta se ele quer continuar.  
3. O usuário confirma.  
4. O backend marca todas as vendas em aberto com a data e hora do fechamento e zera as estatísticas.  
5. O aplicativo recarrega as telas e mostra o aviso "Dia finalizado".

Fluxos alternativos:

* Se o usuário cancelar, nada muda.  
* Se não houver nenhuma venda em aberto, o backend responde com o erro "Não há vendas para finalizar." e o aplicativo mostra o aviso "Não foi possível finalizar o dia" com essa mensagem.

