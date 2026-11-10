import { Alert, Platform } from 'react-native';

export function formatarMoeda(valor) {
    const numero = Number(valor) || 0;
    return 'R$ ' + numero.toFixed(2).replace('.', ',');
}

export function lerNumero(texto) {
    const limpo = String(texto).trim().replace(',', '.');
    if (limpo === '') return NaN;
    return Number(limpo);
}

export function formatarData(dataHora) {
    if(!dataHora) return '';
    let data;
    if (Array.isArray(dataHora)) {
        const [ano, mes, dia, hora = 0, minuto = 0, segundo = 0] = dataHora;
        data = new Date(ano, mes -1, dia, hora, minuto, segundo);
    } else {
        data = new Date(dataHora);
    }

    if (isNaN(data.getTime())) return String(dataHora);
    const dois = (n) => String(n).padStart(2, '0');
    return (
        `${dois(data.getDate())}/${dois(data.getMonth() + 1)}/${data.getFullYear()}` +
        `${dois(data.getHours())}:${dois(data.getMinutes())}`
    );
    
}

export function avisar(titulo, mensagem) {
    if (Plataform.OS === 'web') {
        window.alert(titulo + (mensagem ? '\n' + mensagem : ''));
    } else {
        Alert.alert(titulo, mensagem);
    }
}

export function confirmar(titulo, mensagem, aoConfirmar) {
    if(Plataform.OS === 'web') {
        if (window.confirm(titulo + '\n' + mensagem)) aoConfirmar();        
    } else {
        Alert.alert(titulo, mensagem, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Confirmar', style: 'destructive', onPress: aoConfirmar },            
        ])
    }
}