import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import TelaPrincipal from './src/telas/TelaPrincipal';
import TelaEstatistica from './src/telas/TelaEstatistica';
import { estilos } from './src/estilos';
import TelaVendas from './src/telas/TelaVendas';
import TelaProdutos from './src/telas/TelaProdutos';
import Botao from './src/componentes/Botao';
import { avisar, confirmar } from './src/util';

const ABAS = [
  { id: 'venda', titulo: 'Nova venda' },
    { id: 'produtos', titulo: 'Produtos' },
  { id: 'vendas', titulo: 'Vendas' },
  { id: 'estatisticas', titulo: 'Estatísticas' },
];

export default function App() {
  const [abaAtual, setAbaAtual] = useState('venda');
  const [finalizandoDia, setFinalizandoDia] = useState(false);
  const [versaoDasAbas, setVersaoDasAbas] = useState(0);

  async function finalizarDia() {
    setFinalizandoDia(true);

    try {
      await api.finalizarDia();
      setVersaoDasAbas(versaoDasAbas + 1);
      avisar('Dia finalizado', 'As vendas foram guardadas no banco e as estatísticas foram zeradas.');
    } catch (erro) {
      avisar('Não foi possível finalizar o dia', erro.message);
    } finally {
      setFinalizandoDia(false);
    }
  }

  function pedirConfirmacaoParaFinalizarDia() {
    confirmar(
      'Finalizar dia',
      'As abas Vendas e Estatísticas serão zeradas. As vendas ficarão salvas no banco e não aparecerão mais no aplicativo. Deseja continuar?',
      finalizarDia
    );
  }

  let tela;
  if (abaAtual === 'venda') tela = <TelaPrincipal></TelaPrincipal>;
  else if (abaAtual === 'produtos') tela = <TelaProdutos></TelaProdutos>;
  else if (abaAtual === 'vendas') tela = <TelaVendas></TelaVendas>;
  else tela = <TelaEstatistica></TelaEstatistica>;

  return (
    <View style={estilos.aplicativo}>

      <View style={estilos.cabecalhoAplicativo}>
        <Text style={estilos.tituloAplicativo}>
          EstouFrito
        </Text>
        <View style={estilos.botoesDoCabecalho}>
          <Botao
            titulo="Finalizar dia"
            tipo="perigo"
            pequeno
            desativado={finalizandoDia}
            aoApertar={pedirConfirmacaoParaFinalizarDia}
          />
        </View>
      </View>

      <View key={versaoDasAbas} style={estilos.conteudoAba}>{tela}</View>

      <View style={estilos.barraDeAbas}>
        {ABAS.map((aba) => {
          const ativa = aba.id === abaAtual;
          return (
            <TouchableOpacity
              key={aba.id}
              style={estilos.botaoDaAba}
              onPress={() => setAbaAtual(aba.id)}
            >
              <Text style={ativa
                ? [estilos.textoDaAba, estilos.textoDaAbaAtiva]
                : estilos.textoDaAba}
              >
                {aba.titulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
