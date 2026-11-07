import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { estilos } from '../estilos';
import { formatarData, formatarMoeda } from '../utils';
import * as api from '../api';

export default function TelaVendas() {
    const [vendas, setVendas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro('');
        try {
            const lista = await api.listarVendas();
            setVendas([...lista].reverse());
        } catch (error) {
            setErro('Erro ao carregar vendas.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    return (
        <ScrollView 

            style={estilos.tela}
            contentContainerStyle={estilos.conteudo}
            refreshControl={<RefreshControl refreshing={carregando} onRefresh={carregar}></RefreshControl>}
        
        >
            <Text style={estilos.titulo}>Vendas realizadas</Text>
            {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}
            {vendas.length === 0 && erro === '' && !carregando && (
                <Text style={estilos.vazio}>Nenhuma venda registrada</Text>
            )}

            {vendas.map((venda) => (
                <View key={venda.id} style={estilos.cartao}>
                    <Text style={estilos.nome}>Venda #{venda.id}</Text>
                    <Text style={estilos.suave}>{formatarData(venda.dataHora)}</Text>
                    <Text style={estilos.texto}>
                        Total: {formatarMoeda(venda.totalVendido)} | Lucro: {formatarMoeda(venda.lucroTotal)}
                    </Text>

                    {(venda.itensVenda || []).map((item) => (
                        <Text key={item.id} style={estilos.suave}>
                            • {item.quantidade} x {item.nomeProduto} - ({formatarMoeda(item.precoUnitario)})
                        </Text>
                    ))}

                </View>
            ))}
            
        </ScrollView>
    );
}