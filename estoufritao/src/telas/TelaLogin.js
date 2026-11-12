import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import * as api from '../api';
import Botao from '../componentes/Botao';
import { estilos } from '../estilos';
import { avisar } from '../util';

export default function TelaLogin({ aoLogar }) {
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    async function entrar() {
        if (nome === '' || senha === '') {
            return avisar('Campos vazios', 'preencha o nome e a senha');
        }

        setCarregando(true);
        setErro('');

        try {

            const resultado = await api.logarUsuario({ nome, senha });

            if (typeof resultado === 'string' && resultado !== '') {
                api.definirToken(resultado);
                aoLogar();
            } else {
                setErro(resultado);
            }

        } catch (e) {
            setErro('não foi possível conectar ao servidor');
        } finally {
            setCarregando(false);
        }

    }

    async function cadastrar() {
        if (nome === '' || senha === '') {
            return avisar('Campos vazios', 'Digite um nome e uma senha para criar a conta');
        }

        setCarregando(true);
        setErro('');

        try {

            const resultado = await api.cadastrarUsuario({ nome, senha });

            if (resultado && resultado.id) {
              avisar('Conta Criada!', 'Agora aperte em Entrar para acessar');
              setSenha('');
            } else {
              avisar('Erro ao cadastrar', 'Esse nome já pode estar em uso');
            }



        } catch (e) {
            avisar('Erro ao cadastrar');
        } finally {
            setCarregando(false);
        }
    }

      return (
    <ScrollView
      style={estilos.tela}
      contentContainerStyle={[estilos.conteudo, { justifyContent: 'center', flexGrow: 1 }]}
    >
      <Text style={estilos.titulo}>Acesso ao Sistema</Text>

      {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

      <View style={estilos.cartao}>
        <Text style={estilos.texto}>Nome</Text>
        <TextInput
          style={estilos.entrada}
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="none"
        />

        <Text style={estilos.texto}>Senha</Text>
        <TextInput
          style={estilos.entrada}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
      </View>

      <Botao
        titulo="Entrar"
        aoApertar={entrar}
        desativado={carregando || nome === '' || senha === ''}
      />

      <View style={{ marginTop: 8 }}>
        <Botao
          titulo="Criar Nova Conta"
          aoApertar={cadastrar}
          desativado={carregando || nome === '' || senha === ''}
        />
      </View>
    </ScrollView>
  );
}
