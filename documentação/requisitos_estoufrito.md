# **Requisitos \- EstouFrito**

Prioridade: Alta é o que o sistema não pode ficar sem, Média é importante e Baixa ajuda mas não é essencial.

## **Requisitos Funcionais**

RF01 – Cadastrar e listar categorias. (Prioridade: Alta)

RF02 – Cadastrar produto com nome, categoria (que já precisa estar cadastrada), preço, custo e estoque. (Prioridade: Alta)

RF03 – Listar os produtos e filtrar por categoria. (Prioridade: Alta)

RF04 – Alterar o preço de um produto. (Prioridade: Média)

RF05 – Adicionar quantidade ao estoque de um produto. (Prioridade: Alta)

RF06 – Trocar a categoria de um produto por outra categoria que já exista. (Prioridade: Baixa)

RF07 – Excluir um produto, pedindo confirmação. (Prioridade: Média)

RF08 – Realizar venda com vários produtos, descontando o estoque e sem deixar vender mais do que tem. (Prioridade: Alta)

RF09 – Calcular o total e o lucro de cada venda. (Prioridade: Alta)

RF10 – Listar as vendas do dia, da mais recente para a mais antiga. (Prioridade: Média)

RF11 – Mostrar a quantidade total vendida e o lucro total. (Prioridade: Média)

RF12 – Mostrar nas estatísticas o quanto cada categoria vendeu, com o detalhe de quantidade e lucro de cada produto. (Prioridade: Média)

RF13 – Finalizar o dia, pedindo confirmação: as vendas deixam de aparecer no aplicativo (mas continuam no banco) e as estatísticas voltam para zero. (Prioridade: Média)

## **Requisitos Não Funcionais**

RNF01 – O backend é uma API REST feita com Spring Boot e Java 17\. (Prioridade: Alta)

RNF02 – Os dados ficam em um banco PostgreSQL. (Prioridade: Alta)

RNF03 – O frontend é feito em React Native com Expo e usa a API. (Prioridade: Alta)

RNF04 – Se a venda der erro, nada é salvo (a venda é feita em uma transação). (Prioridade: Alta)

RNF05 – O projeto usa Git com commits durante todo o desenvolvimento. (Prioridade: Alta)

RNF06 – Os erros da API voltam com uma mensagem clara e o status 400 ou 500\. (Prioridade: Média)

RNF07 – A interface é simples, com poucas telas, tema escuro e valores em reais. (Prioridade: Média)

RNF08 – O endereço da API usado pelo aplicativo pode ser trocado por uma variável de ambiente, sem mexer no código. (Prioridade: Baixa)

RNF09 – O código é separado em camadas e os nomes são em português. (Prioridade: Baixa)

RNF10 – O teste automático do backend usa um banco H2 em memória, para não depender do PostgreSQL. (Prioridade: Baixa)

