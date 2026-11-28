# **Interface \- EstouFrito**

## **Ideia geral**

A interface é simples, com poucas telas e botões grandes. O aplicativo usa um tema escuro, com fundo quase preto, e o laranja como cor de destaque, para lembrar a cor do pastel. Ele funciona na horizontal.

## **Cores**

As cores estão no arquivo estilos.js. O fundo das telas é um preto bem escuro (\#0f0f0f) e os cartões são um cinza escuro um pouco mais claro (\#212121). Os campos de texto têm um fundo ainda mais escuro (\#121212) e as bordas são cinza (\#303030). O texto principal é quase branco (\#f1f1f1) e o texto de apoio é cinza claro (\#aaaaaa). O laranja (\#d97706) é a cor principal e aparece no título, nos botões, nos botões de categoria e na aba selecionada. O vermelho (\#dc2626) é usado nos botões "Finalizar dia" e "Excluir produto" e nas mensagens de erro.

## **Fontes**

Não escolhi uma fonte, então o aplicativo usa a fonte padrão de cada aparelho. O título do aplicativo tem tamanho 22, os títulos das seções 20, o nome dos produtos 16 e os textos normais 14\. Os textos de apoio têm tamanho 13 e o nome das abas 12\.

## **Telas**

Ao abrir o aplicativo, aparece o nome "EstouFrito" no topo, à esquerda, e o botão vermelho pequeno "Finalizar dia" à direita. Embaixo ficam as quatro abas: Nova venda, Produtos, Vendas e Estatísticas. A aba escolhida fica em laranja e negrito.

Na aba Nova venda, que é a primeira, aparecem os botões de categoria no topo e a lista de produtos em cartões, cada um com nome, categoria, preço e estoque. Do lado direito de cada cartão ficam os botões redondos "-" e "+" para escolher a quantidade. No fim da lista aparece o total e o botão "Finalizar venda".

Na aba Produtos ficam os botões de categoria, os cartões para criar uma categoria e um produto, e a lista de produtos cadastrados. Em cada produto dá para trocar a categoria, mudar o preço, adicionar estoque ou excluir.

Na aba Vendas aparece um cartão para cada venda do dia, com o número, a data e hora, o total, o lucro e os itens vendidos.

Na aba Estatísticas aparecem no topo a quantidade total vendida e o lucro total. Logo abaixo vem um cartão para cada categoria, com a quantidade vendida e o total vendido, e um botão "Detalhes" que mostra cada produto da categoria com a quantidade e o lucro.

## **Diretrizes**

O conteúdo fica sempre em cartões escuros com cantos arredondados. Todos os botões são iguais, laranjas para as ações normais e vermelhos para as ações perigosas, e ficam meio apagados quando não podem ser usados. O dinheiro aparece sempre no formato R\$ 0,00. Quando o usuário erra alguma coisa, o aplicativo mostra um aviso dizendo o que corrigir, e antes de excluir um produto ou de finalizar o dia ele pede confirmação. Nas listas dá para puxar a tela para baixo para atualizar. Todo o texto está em português.

