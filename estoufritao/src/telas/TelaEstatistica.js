import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import * as api from '../api';
import Botao from '../componentes/Botao';
import { estilos } from '../estilos';

export default function TelaLogin(props) {
    const [nomeDoUsuario, setNomeDoUsuario] = useState('luis');
    const [senhaDoUsuario, setSenhaDoUsuario] = useState('123');
    const [estaCarregando, setEstaCarregando] = useState(false);
    const [mensagemDeErro, setMensagemDeErro] = useState('');

    async function entrarNaConta() {
        if (nomeDoUsuario === '' || senhaDoUsuario === '') {
            setMensagemDeErro('Preencha o nome e a senha.');
            return;
        }

        setEstaCarregando(true);
        setMensagemDeErro('');

        try {
            const tokenRecebido = await api.logarUsuario({
                nome: nomeDoUsuario,
                senha: senhaDoUsuario,
            });

            if (typeof tokenRecebido !== 'string' || tokenRecebido === '') {
                setMensagemDeErro('Nome ou senha inválidos.');
                return;
            }

            await api.definirToken(tokenRecebido);
            props.aoLogar();
        } catch (erro) {
            if (erro.status === 401) {
                setMensagemDeErro('Nome ou senha inválidos.');
            } else {
                setMensagemDeErro('Não foi possível conectar ao servidor.');
            }
        } finally {
            setEstaCarregando(false);
        }
    }

    return (
        <ScrollView
            style={estilos.tela}
            contentContainerStyle={[estilos.conteudo, { justifyContent: 'center', flexGrow: 1 }]}
        >
            <Text style={estilos.titulo}>Acesso ao Sistema</Text>

            {mensagemDeErro !== '' && (
                <Text style={estilos.erro}>{mensagemDeErro}</Text>
            )}

            <View style={estilos.cartao}>
                <Text style={estilos.texto}>Nome</Text>
                <TextInput
                    style={estilos.entrada}
                    placeholder="Digite seu nome"
                    value={nomeDoUsuario}
                    onChangeText={setNomeDoUsuario}
                    autoCapitalize="none"
                />

                <Text style={estilos.texto}>Senha</Text>
                <TextInput
                    style={estilos.entrada}
                    placeholder="Digite sua senha"
                    value={senhaDoUsuario}
                    onChangeText={setSenhaDoUsuario}
                    secureTextEntry
                />
            </View>

            <Botao
                titulo="Entrar"
                aoApertar={entrarNaConta}
                desativado={estaCarregando || nomeDoUsuario === '' || senhaDoUsuario === ''}
            />
        </ScrollView>
    );
}
