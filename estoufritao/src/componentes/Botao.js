import React from 'react';
import { TouchableOpacity, Text} from 'react-native';
import { estilos } from '../estilos';

export default function Botao({ titulo, aoApertar, tipo = 'principal', pequeno, desativado }) {

    let estiloDaCorDoBotao = estilos.botaoPrincipal;

    if (tipo === 'perigo') {
        estiloDaCorDoBotao = estilos.botaoPerigo;
    } else if (tipo === 'neutro') {
        estiloDaCorDoBotao = estilos.botaoNeutro;
    }

    const estiloDoBotao = [estilos.botao, estiloDaCorDoBotao];
    const estiloDoTexto = [estilos.textoDoBotao];

    if (pequeno) {
        estiloDoBotao.push(estilos.botaoPequeno);
        estiloDoTexto.push(estilos.textoDoBotaoPequeno);
    }

    if (desativado) {
        estiloDoBotao.push(estilos.botaoDesativado);
    }

    return (
        <TouchableOpacity onPress={aoApertar} disabled={desativado} style={estiloDoBotao}>
            <Text style={estiloDoTexto}>{titulo}</Text>
        </TouchableOpacity>
    );
}
