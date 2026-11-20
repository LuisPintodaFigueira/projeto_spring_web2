import { Alert, Platform } from 'react-native';

export function formatarMoeda(valor) {
    const valorNumerico = Number(valor) || 0;
    const valorComDuasCasas = valorNumerico.toFixed(2);
    const valorComVirgula = valorComDuasCasas.replace('.', ',');

    return 'R$ ' + valorComVirgula;
}

export function lerNumero(texto) {
    const textoSemEspacos = String(texto).trim();
    const textoComPontoDecimal = textoSemEspacos.replace(',', '.');

    if (textoComPontoDecimal === '') {
        return NaN;
    }

    return Number(textoComPontoDecimal)
}

export function formatarData(dataHora) {
    if(!dataHora) return '';

    let data;

    if (Array.isArray(dataHora)) {
        const ano = dataHora[0];
        const mes = dataHora[1];
        const dia = dataHora[2];
        const hora = dataHora[3] || 0;
        const minuto = dataHora[4] || 0;
        const segundo = dataHora[5] || 0;

        data = new Date(ano, mes -1, dia, hora, minuto, segundo);
    } else {
        data = new Date(dataHora);
    }

    if (isNaN(data.getTime())) {
        return String(dataHora);
    }

    const diaFormatado = String(data.getDate()).padStart(2, '0');
    const mesFormatado = String(data.getMonth() + 1).padStart(2, '0');
    const horaFormatada = String(data.getHours()).padStart(2, '0');
    const minutoFormatado = String(data.getMinutes()).padStart(2, '0');

    return diaFormatado + '/' + mesFormatado + '/' + data.getFullYear() + ' ' + horaFormatada + ':' + minutoFormatado;    
}

export function avisar(titulo, mensagem) {
    if (Platform.OS === 'web') {
        let textoDoAviso = titulo;

        if (mensagem) {
            textoDoAviso = textoDoAviso + '\n' + mensagem;
        }

        window.alert(textoDoAviso);
        return;
    }

    Alert.alert(titulo, mensagem);
}

export function confirmar(titulo, mensagem, funcaoDeConfirmar) {
    if(Platform.OS === 'web') {
        const usuarioConfirmou = window.confirm(titulo + '\n' + mensagem);

        if (usuarioConfirmou) {
            funcaoDeConfirmar();
        }

        return;
    }

    Alert.alert(titulo, mensagem, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', style: 'destructive', onPress: funcaoDeConfirmar },        
    ]);
}
