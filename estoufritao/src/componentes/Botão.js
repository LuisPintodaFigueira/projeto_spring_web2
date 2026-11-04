import React from 'react';
import { TouchableOpacity, Text} from 'react-native';
import { cores } from '../estilos';

export default function Botao( {titulo, aoApertar, tipo = 'principal', pequeno, desativado}) {

    const fundo = 
    tipo === 'perigo' 
}