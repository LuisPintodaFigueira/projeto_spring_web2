import React from 'react';
import { TouchableOpacity, Text} from 'react-native';
import { cores } from '../estilos';

export default function Botao( {titulo, aoApertar, tipo = 'principal', pequeno, desativado}) {
    const titulo = props.titulo;
    const aoApertar = props.aoApertar;
    const tipo = props.tipo || 'principal';
    const pequeno = props.pequeno;
    const desativado = props.desativado;

    let corDeFundo = cores.principal;

    if (tipo === 'perigo') {
        corDeFundo = cores.perigo;
    } else if (tipo === 'neutro') {
        corDeFundo = cores.suave;
    }

    let espacamentoVertical = 12;
    let espacamentoHorizontal = 16;
    let tamanhoDoTexto = 15;

    if (pequeno) {
        espacamentoVertical = 8;
        espacamentoHorizontal = 12;
        tamanhoDoTexto = 13;
    }

    const estiloDoBotao = {
        backgroundColor: corDeFundo,
        opacity: desativado ? 0.5 : 1,
        paddingVertical: espacamentoVertical,
        paddingHorizontal: espacamentoHorizontal,
        borderRadius: 6,
        alignItems: 'center',
    };

    const estiloDoTexto = {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: tamanhoDoTexto,
    };

    return (
        <TouchableOpacity onPress={aoApertar} disabled={desativado} style={estiloDoBotao}>
            <Text style={estiloDoTexto}>{titulo}</Text>
        </TouchableOpacity>
    );
}