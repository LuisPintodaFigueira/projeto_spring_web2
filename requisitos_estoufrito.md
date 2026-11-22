# **Requisitos \- EstouFrito**

Prioridade: Alta é o que o sistema não pode ficar sem, Média é importante e Baixa ajuda mas não é essencial.

## **Requisitos Funcionais**

RF01 – Fazer login com nome e senha. (Prioridade: Alta)

RF02 – Sair da conta. (Prioridade: Média)

RF03 – Cadastrar e listar categorias. (Prioridade: Alta)

RF04 – Cadastrar produto com nome, categoria (que já precisa estar cadastrada), preço, custo e estoque. (Prioridade: Alta)

RF05 – Listar os produtos e filtrar por categoria. (Prioridade: Alta)

RF06 – Alterar o preço de um produto. (Prioridade: Média)

RF07 – Adicionar quantidade ao estoque de um produto. (Prioridade: Alta)

RF08 – Trocar a categoria de um produto por outra categoria que já exista. (Prioridade: Baixa)

RF09 – Excluir um produto, pedindo confirmação. (Prioridade: Média)

RF10 – Realizar venda com vários produtos, descontando o estoque e sem deixar vender mais do que tem. (Prioridade: Alta)

RF11 – Calcular o total e o lucro de cada venda. (Prioridade: Alta)

RF12 – Listar as vendas do dia, da mais recente para a mais antiga. (Prioridade: Média)

RF13 – Mostrar a quantidade total vendida e o lucro total. (Prioridade: Média)

RF14 – Mostrar nas estatísticas o quanto cada categoria vendeu, com o detalhe de quantidade e lucro de cada produto. (Prioridade: Média)

RF15 – Finalizar o dia, pedindo confirmação: as vendas deixam de aparecer no aplicativo (mas continuam no banco) e as estatísticas voltam para zero. (Prioridade: Média)

## **Requisitos Não Funcionais**

RNF01 – O backend é uma API REST feita com Spring Boot e Java 17\. (Prioridade: Alta)

RNF02 – Os dados ficam em um banco PostgreSQL. (Prioridade: Alta)

RNF03 – A senha é guardada criptografada (BCrypt). (Prioridade: Alta)

RNF04 – O login gera um token JWT que vale por 90 minutos, e as outras rotas só funcionam com ele. (Prioridade: Alta)

RNF05 – O frontend é feito em React Native com Expo e usa a API. (Prioridade: Alta)

RNF06 – Se a venda der erro, nada é salvo (a venda é feita em uma transação). (Prioridade: Alta)

RNF07 – O projeto usa Git com commits durante todo o desenvolvimento. (Prioridade: Alta)

RNF08 – Os erros da API voltam com uma mensagem clara e o status 400, 401 ou 500\. (Prioridade: Média)

RNF09 – A interface é simples, com poucas telas, tema escuro e valores em reais. (Prioridade: Média)

RNF10 – O endereço da API usado pelo aplicativo pode ser trocado por uma variável de ambiente, sem mexer no código. (Prioridade: Baixa)

RNF11 – O código é separado em camadas e os nomes são em português. (Prioridade: Baixa)

RNF12 – O teste automático do backend usa um banco H2 em memória, para não depender do PostgreSQL. (Prioridade: Baixa)

