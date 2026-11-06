import { Alert, Plataform } from 'react-native';

export function formatarMoeda(valor) {
    const numero = Number(valor) || 0;
    return 'R$ ' + numero.toFixed(2).replace('.', ',');
}

export function lerNumero(texto) {
    const limpo = String(texto).trim().replace(',', '.');
    if (limpo === '') return NaN;
    return Number(limpo);
}

export function fomatarData(dataHora) {
    if(!dataHora) return '';
    let data;
    if (Array.isArray(dataHora)) {
        const [ano, mes, dia, hora = 0, minuto = 0, segundo = 0] = dataHora;
        data = new Date(ano, mes -1, dia, hora, minuto, segundo);
    } else {
        data = new Date(dataHora);
    }
    
}