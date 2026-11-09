import React, { useSatate, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import * as api from '../api';
import Botao from '../componentes/Botao';
import { estilos, cores } from '../estilos';
import { formatarMoeda, avisar } from '../util';

export default function NovaVendaTela() {
    const [produtos, setProdutos] = useState([]);
    const [quantidades, setQuantidades] = userState({});
    const [carregando, setCarregando] = useState(false);
    const [erro, serErro] = useState('');

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro('');
        try {
            setProdutos(await api.listarProdutos())
        } catch (e) {
            setErro('Não foi possível carregar os produtos')
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect (() => {
        carregar();
    }, [carregar]);

    function mudar(produto, delta) {
        const atual = quantidades[produto.id] || 0;
        const nova = Math.min(Math.max(atual + delta, 0), produto.quantidadeEstoque);
        setQuantidades({ ...quantidades, [produto]: nova });
    }

    const itens = produtos.filter((p) => (quantidades[p.id] || 0) > 0);
    const total = itens.reduce((soma, p) => soma + p.preco * quantidades[p.id], 0);

    async function finalizar() {
        if (itens.length === 0) return avisar('Pedido vazio', 'Escolha ao menos um produto');
        try {
            const venda = await api.realizarVenda(
                itens.map((p) => ({ produtoId: p.id, quantidade: quantidades[p.id] }))
            );
            avisar('Venda realizada!', `Total: ${formatarMoeda(venda ? venda.totalVendido : total)}`);
            setQuantidades({});
            carregar();
        } catch (e) {
            avisar('erro ao finalizar');
        }
    }

    return (

        <ScrollView
        
        style={estilos.tela}
        contentContainerStyle={estilos.conteudo}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar}></RefreshControl>}
        
        >

            <Text Style={estilos.titulo}>Nova Venda</Text>
            {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}
            {produtos.length === 0 && erro === '' && !carregando && (
                <Text style={estilos.vazios}>Cadastre produtos na aba Produtos</Text>
            )}

            {produtos.map((p) => {
                const qtd = quantidades[p.id] || 0;

                return(
                    <View key={p.id} style={[estilos.cartao, estilos.linha]}>

                        <View style={{ flex: 1 }}>

                            <Text style={estilos.nome}>{p.nome}</Text>
                            <Text style={estilos.texto}>{formatarMoeda(p.preco)}</Text>
                            <Text style={estilos.suave}>Estoque: {p.quantidadesEstoque}</Text>

                        </View>

                        <TouchableOpacity onPress={() => mudar(p, -1)} style={botaoRedondo}>
                            <Text style={textoRedondo}>-</Text>
                        </TouchableOpacity>

                        <Text style={{ width: 32, textAlign: 'center', fontSize: 16}}>{qtd}</Text>

                        <TouchableOpacity onPress={() => mudar(p, 1)} style={botaoRedondo}>
                            <Text style={textoRedondo}>+</Text>
                        </TouchableOpacity>

                    </View>
                );
            })}

            <Text style={[estilos.titulo, { marginTop: 8 }]}>Total: {formatarMoeda(total)}</Text>
            <Botao titulo="Finalizar Venda" aoApertar={finalizar} desativado={itens.length === 0}></Botao>

        </ScrollView>
    );

}

const botaoRedondo = {
  width: 36, height: 36, borderRadius: 18, backgroundColor: cores.principal, alignItems: 'center', justifyContent: 'center'
};
const textoRedondo = { color: '#fff', fontSize: 20, fontWeight: 'bold' };
