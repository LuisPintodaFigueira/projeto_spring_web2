package br.edu.ifpr.estoufrito.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import br.edu.ifpr.estoufrito.model.Usuario;
import br.edu.ifpr.estoufrito.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder criptografia = new BCryptPasswordEncoder();

    public Usuario cadastrar(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getNome().isBlank() || usuario.getSenha() == null
                || usuario.getSenha().isBlank()) {
            System.out.println("informe nome e senha");
        }

        if (usuarioRepository.existByNome(usuario.getNome())) {
            System.out.println("esse nome já está em uso");
        }

        usuario.setId(null);

        String senhaCriptografada = criptografia.encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);

        return usuarioRepository.save(usuario);
    }

    public String logar(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getSenha() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nome ou senha inválidos");
        }

        Usuario usuarioDoBanco = usuarioRepository.findByNome(usuario.getNome());

        if (usuarioDoBanco == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nome ou senha inválidos");
        }

        if (!criptografia.matches(usuario.getSenha(), usuarioDoBanco.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nome ou senha inválidos");
        }

        return usuarioDoBanco;
    }
}
