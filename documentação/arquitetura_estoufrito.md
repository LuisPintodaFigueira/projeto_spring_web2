# **Arquitetura \- EstouFrito**

## **Visão geral**

O projeto é dividido em duas partes que conversam pela internet (protocolo HTTP) trocando dados em formato JSON. A primeira é o aplicativo, que é o frontend e fica na pasta estoufritao. A segunda é a API, que é o backend e fica na pasta estoufrito. O aplicativo não mexe direto no banco de dados. Ele sempre pede para a API, e a API é quem guarda e busca as informações no banco PostgreSQL.

No repositório do GitHub (projeto\_spring\_web2) ficam três pastas: a documentacao, com os arquivos entregues, a estoufrito com o backend e a estoufritao com o frontend.

## **Backend**

O backend foi feito em Java 17 com Spring Boot, usando Maven para baixar as dependências e o JPA para conversar com o banco. Todo o código fica dentro do pacote br.edu.ifpr.estoufrito, e separados em pastas pelo tipo de trabalho que cada arquivo faz.

Na pasta model ficam as classes que representam os dados do sistema: Produto, Categoria, Venda, ItemVenda e Estatistica. Cada uma delas vira uma tabela no banco. Na pasta repository ficam as interfaces que falam com o banco. Elas estendem o JpaRepository, e por isso o Spring já cria sozinho os métodos de salvar, buscar e apagar. Quando precisamos de uma busca diferente, escrevemos só o nome do método, como o findByDataFechamentoIsNull da venda, que busca as vendas que ainda não foram fechadas.

Na pasta service ficam as regras do sistema. É aqui que validamos os dados e fazemos as contas. O ProdutoService, por exemplo, confere se o preço é maior que zero, se o custo e o estoque não são negativos e se a quantidade adicionada é maior que zero. Ao cadastrar um produto e ao trocar a categoria dele, o ProdutoService também consulta o CategoriaRepository para ver se a categoria existe, e recusa se não existir. O VendaService confere se tem estoque, desconta a quantidade vendida, calcula o total e o lucro e salva a venda. Depois chama o EstatisticaService para somar essa venda no total geral e montar os detalhes por categoria e produto. É no VendaService também que fica o método de finalizar o dia. Também existem o CategoriaService e o EstatisticaService.

Na pasta controller ficam as classes que recebem os pedidos que vêm do aplicativo. Elas não têm lógica, só recebem o que chegou e passam para o service. Existe um controller para cada assunto: categorias, produtos, vendas e estatísticas. Na pasta dto ficam classes pequenas que organizam os dados recebidos nas vendas e os dados enviados nas estatísticas. Por fim, a pasta config guarda as configurações, como o CorsConfig e o ApiExceptionHandler, que organiza as mensagens de erro.

### **Como as rotas funcionam**

Todas as rotas da API começam com /v1 e podem ser usadas sem login ou token, pois o aplicativo é de uso interno.

As categorias ficam em /v1/categorias. Se o aplicativo pedir essa rota com GET, recebe a lista de categorias em ordem alfabética, e se mandar com POST junto com o nome, a categoria nova é cadastrada.

Os produtos ficam em /v1/produtos. Com GET vem a lista de produtos em ordem alfabética e com POST um produto novo é cadastrado, mandando nome, categoria, preço, custo e quantidade em estoque. Para mexer em um produto que já existe usamos o id dele no meio da rota. Para mudar o preço, o app usa PUT em /v1/produtos/id/preco, e para trocar a categoria usa PUT em /v1/produtos/id/categoria. Para somar uma quantidade ao estoque, usa PATCH em /v1/produtos/id/estoque. Para excluir, usa DELETE em /v1/produtos/produtos/id.

As vendas ficam em /v1/vendas. Com GET em /v1/vendas/vendas vem a lista das vendas do dia, da mais nova para a mais antiga, e só aparecem as vendas que ainda não foram fechadas. Com POST na mesma rota uma venda nova é registrada, e o app manda uma lista com o id de cada produto e a quantidade vendida. Para finalizar o dia, o app usa POST em /v1/vendas/finalizar-dia. Essa rota marca todas as vendas em aberto com a data e hora do fechamento e zera as estatísticas. Se não existir nenhuma venda em aberto, ela responde com erro.

Por último, as estatísticas ficam em /v1/estatisticas. Com GET vem a quantidade total vendida e o lucro total.

### **Erros**

Quando algo dá errado, a API sempre responde com uma mensagem curta no formato JSON, com a palavra "erro". Os erros de validação (como estoque insuficiente ou nome vazio) voltam com o status 400 e qualquer outro problema inesperado volta com 500\.

### **Banco de dados e configurações**

O banco é o PostgreSQL, rodando na porta 5433\. As tabelas são criadas automaticamente pelo JPA quando o backend sobe, então não foi preciso escrever SQL. São cinco tabelas: categoria, produto, venda, item\_venda e estatistica. Uma venda tem vários itens, e cada item guarda o nome, o preço e o custo que o produto tinha na hora da venda, para a venda antiga não mudar se o preço do produto mudar depois. A venda guarda a data e hora em que foi feita e também a data de fechamento, que fica vazia até o dia ser finalizado. O produto guarda o nome da categoria como texto. A tabela de estatística tem só uma linha, com os totais.

Essas configurações ficam no arquivo application.yaml, que tem a conexão com o banco e a origem que o CORS libera. Para os testes existe um segundo arquivo, o application-test.yaml, que fica na pasta de testes e usa um banco H2 em memória. Assim o teste automático do backend roda sem precisar do PostgreSQL ligado.

## **Frontend**

O frontend foi feito com React Native e Expo, só com JavaScript. Ele roda no celular, usando o Expo Go, e também no navegador.

O arquivo principal é o App.js, que fica na raiz da pasta estoufritao. Ele mostra o título, o botão "Finalizar dia" e as quatro abas. É também no App.js que fica a função de finalizar o dia, que pede a confirmação, chama a API e recarrega as abas. Não utilizei nenhuma biblioteca de navegação. O App.js só guarda em um estado (useState) qual aba está escolhida e mostra a tela certa.

O resto do código fica dentro da pasta src. Lá tem o arquivo api.js, que é o único que conversa com o backend, e todas as telas usam as funções dele, como listarProdutos, realizarVenda e finalizarDia. O arquivo config.js tem o endereço da API, que vem da variável de ambiente EXPO\_PUBLIC\_API\_URL e, se ela não existir, usa http\://localhost:8080. O estilos.js guarda as cores do tema escuro e todos os estilos do aplicativo (botões, cabeçalho, abas, cartões e outros). Assim o App.js e as telas só usam o nome do estilo, como estilos.botaoCategoria, sem escrever estilo dentro do componente. O util.js tem as funções de apoio, como formatar o dinheiro em reais, formatar a data, ler números com vírgula e mostrar avisos e confirmações.

Dentro de src ainda tem a pasta componentes, que tem o Botao.js, usado no app inteiro, e a pasta telas, com quatro telas: TelaPrincipal (que é a aba de nova venda), TelaProdutos, TelaVendas e TelaEstatistica. Cada tela guarda os próprios dados em estados do React e busca as informações na API assim que abre. A TelaEstatistica recebe da API os totais por categoria e produto já calculados no backend.

## **Comunicação entre frontend e backend**

O aplicativo chama a API usando fetch, mandando e recebendo JSON. O endereço da API vem do config.js e, por padrão, é localhost:8080, o que funciona no navegador e no emulador. Do lado do backend, o CORS só libera a origem http\://localhost:8081, que é onde o Expo abre no navegador, e aceita os métodos GET, POST, PUT, PATCH e DELETE.

## **Padrão de nomenclatura**

No backend, os nomes das pastas (pacotes) ficam em minúsculo e no singular, como controller, service e repository. As classes são escritas com a primeira letra de cada palavra maiúscula, em português, e terminam com o tipo delas, como ProdutoController, ProdutoService e ProdutoRepository. As classes que só recebem dados terminam com Request. Os métodos e as variáveis ficam em camelCase e em português, com nomes que explicam o que fazem, como adicionarEstoque e quantidadeEstoque. As rotas da API começam com /v1 e usam o nome no plural e em minúsculo.

No frontend, as pastas também ficam em minúsculo (src, telas, componentes). Os arquivos das telas e dos componentes começam com letra maiúscula, e as telas sempre começam com a palavra Tela, como TelaProdutos.js. Os arquivos de apoio ficam em minúsculo, como api.js e util.js. As funções e as variáveis ficam em camelCase e em português, com nomes compridos para ficar fácil de entender, como listaDeProdutos e estaCarregando. Os estados do useState seguem o padrão nome e setNome, os estilos ficam todos no estilos.js, com nomes em camelCase que dizem o que estilizam (como botaoCategoria e barraDeAbas), e as constantes ficam todas em maiúsculo, como API\_URL e TODAS\_AS\_CATEGORIAS.

## **Como rodar o projeto**

Para rodar o backend, é preciso deixar o PostgreSQL ligado na porta 5433, entrar na pasta estoufrito e rodar o comando ./mvnw spring-boot:run. A API sobe em http\://localhost:8080.

Para rodar o frontend, basta na pasta estoufritao, rodar o comando npm install para baixar as dependências e depois npx expo start. Para abrir direto no navegador dá para usar npm run web.

