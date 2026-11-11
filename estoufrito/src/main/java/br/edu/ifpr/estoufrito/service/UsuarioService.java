package br.edu.ifpr.estoufrito.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import br.edu.ifpr.estoufrito.model.Usuario;
import br.edu.ifpr.estoufrito.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    
    @Autowired 
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder criptografia = new BCryptPasswordEncoder();

    public Usuario cadastrar(Usuario usuario) {
        String senhaComHash = criptografia.encode(usuario.getSenha());
        usuario.setSenha(senhaComHash);

        return usuarioRepository.save(usuario);
    }

    public String logar(Usuario dadosDigitados) {
        Usuario usuarioDoBanco = usuarioRepository.findByNome(dadosDigitados.getNome());

        if (usuarioDoBanco == null) {
            return "Erro: usuário não encontrado";
        }

        Boolean senhaCorreta = criptografia.matches(dadosDigitados.getSenha(), usuarioDoBanco.getSenha());

        if (senhaCorreta) {
            return "Login realizado com sucesso";
        } else {
            return "Senha incorreta!";
        }
    }
}
