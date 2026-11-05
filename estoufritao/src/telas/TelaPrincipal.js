function ProdutoItem({produto, aoMudar}) {
    const [novoPreco, setNovoPreco] = useState('');
    const [qtdAdicionar, serQtdAdicionar] = useState('');

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
                <Botão ></Botão>
            </View>

        </View>
    );

}