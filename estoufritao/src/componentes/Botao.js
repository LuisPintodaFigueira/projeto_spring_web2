import React from 'react';
import { TouchableOpacity, Text} from 'react-native';
import { cores } from '../estilos';

export default function Botao( {titulo, aoApertar, tipo = 'principal', pequeno, desativado}) {

    const fundo = 
    tipo === 'perigo' ? cores.perigo : tipo === 'neutro' ? cores.suave : cores.principal;

    return (
        <TouchableOpacity
        onPress={aoApertar}
        disabled={desativado}
        style={{
            backgroundColor: fundo,
            opacity: desativado ? 0.5 : 1,
            paddingVertical: pequeno ? 8 : 12,
            paddingHorizontal: pequeno ? 12 : 16,
            borderRadius: 6,
            alignItems: 'center',
            }}
        >
        
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: pequeno ? 13 : 15}}>
            {titulo}
        </Text>

        </TouchableOpacity>
    )
}