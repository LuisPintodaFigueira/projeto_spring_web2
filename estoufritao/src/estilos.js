import { StyleSheet } from 'react-native';

export const cores = {
  fundo: '#f4f4f5',
  cartao: '#ffffff',
  texto: '#18181b',
  suave: '#71717a',
  borda: '#d4d4d8',
  principal: '#d97706',
  perigo: '#dc2626',
  sucesso: '#16a34a',
};

export const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, paddingBottom: 40 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: cores.texto, marginBottom: 12 },
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 12,
    marginBottom: 12,
  },
  nome: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  texto: { fontSize: 14, color: cores.texto, marginTop: 2 },
  suave: { fontSize: 13, color: cores.suave, marginTop: 2 },
  entrada: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  linha: { flexDirection: 'row', alignItems: 'center' },
  erro: { color: cores.perigo, marginBottom: 8 },
  vazio: { textAlign: 'center', color: cores.suave, marginTop: 24 },
});
