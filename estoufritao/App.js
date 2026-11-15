import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import TelaPrincipal from './src/telas/TelaPrincipal';
import TelaEstatistica from './src/telas/TelaEstatistica';
import { cores } from './src/estilos';
import TelaVendas from './src/telas/TelaVendas';
import TelaProdutos from './src/telas/TelaProdutos';
import TelaLogin from './src/telas/TelaLogin';
import Botao from './src/componentes/Botao';
import * as api from './src/api';

const ABAS = [
  { id: 'venda', titulo: 'Nova venda' },
    { id: 'produtos', titulo: 'Produtos' },
  { id: 'vendas', titulo: 'Vendas' },
  { id: 'estatisticas', titulo: 'Estatísticas' },
];

export default function App() {
  const [logado, setLogado] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [abaAtual, setAbaAtual] = useState('produtos');

  useEffect(() => {
    api.registrarAoSessaoExpirar(() => setLogado(false));

    async function restaurarSessao() {
      const temToken = await api.carregarTokenSalvo();
      setLogado(temToken);
      setVerificando(false);
    }
    restaurarSessao();
  }, []);

  async function sair() {
    await api.definirToken(null);
    setLogado(false);
  }

  if (verificando) {                                       // NOVO (item 3)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!logado) {
    return <TelaLogin aoLogar={() => setLogado(true)} />;
  }

  let tela;
  if (abaAtual === 'venda') tela = <TelaPrincipal></TelaPrincipal>;
  else if (abaAtual === 'produtos') tela = <TelaProdutos></TelaProdutos>;
  else if (abaAtual === 'vendas') tela = <TelaVendas></TelaVendas>;
  else tela = <TelaEstatistica></TelaEstatistica>;

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo, paddingTop: 40 }}>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: cores.principal, paddingVertical: 8 }}>
          EstouFrito
        </Text>
        <Botao titulo="Sair" tipo="perigo" pequeno aoApertar={sair} />
      </View>

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
