import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import TelaPrincipal from './src/telas/TelaPrincipal';
import TelaEstatistica from './src/telas/TelaEstatistica';
import { cores } from './src/estilos';
import TelaVendas from './src/telas/TelaVendas';
import TelaNovaVenda from './src/telas/TelaNovaVenda';

const ABAS = [
  { id: 'produtos', titulo: 'Produtos' },
  { id: 'venda', titulo: 'Nova venda' },
  { id: 'vendas', titulo: 'Vendas' },
  { id: 'estatisticas', titulo: 'Estatísticas' },
];

export default function App() {
  const [abaAtual, setAbaAtual] = useState('produtos');

  let tela;
  if (abaAtual === 'produtos') tela = <TelaPrincipal></TelaPrincipal>;
  else if (abaAtual === 'venda') tela = <TelaNovaVenda></TelaNovaVenda>;
  else if (abaAtual === 'vendas') tela = <TelaVendas></TelaVendas>;
  else tela = <TelaEstatistica></TelaEstatistica>;

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo, paddingTop: 40 }}>
      <StatusBar barStyle="dark-content" />
      <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', paddingVertical: 8, color: cores.principal }}>
        EstouFrito
      </Text>

      <View style={{ flex: 1 }}>{tela}</View>

      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: cores.borda, backgroundColor: '#fff', paddingBottom: 12 }}>
        {ABAS.map((aba) => {
          const ativa = aba.id === abaAtual;
          return (
            <TouchableOpacity
              key={aba.id}
              style={{ flex: 1, paddingVertical: 14, alignItems: 'center' }}
              onPress={() => setAbaAtual(aba.id)}
            >
              <Text style={{ fontSize: 12, fontWeight: ativa ? 'bold' : 'normal', color: ativa ? cores.principal : cores.suave }}>
                {aba.titulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
