package br.edu.ifpr.estoufrito.service;

import br.edu.ifpr.estoufrito.model.Usuario;
import br.edu.ifpr.estoufrito.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService implements CommandLineRunner {

    private static final String NOME_DO_USUARIO_FIXO = "luis";
    private static final String SENHA_DO_USUARIO_FIXO = "123";

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder codificadorDeSenha = new BCryptPasswordEncoder();

    @Override
    public void run(String... argumentos) {
        if (usuarioRepository.findByNome(NOME_DO_USUARIO_FIXO) != null) {
            return;
        }

        Usuario usuarioFixo = new Usuario();
        usuarioFixo.setNome(NOME_DO_USUARIO_FIXO);

        String senhaCodificada = codificadorDeSenha.encode(SENHA_DO_USUARIO_FIXO);
        usuarioFixo.setSenha(senhaCodificada);

        usuarioRepository.save(usuarioFixo);
    }

    public Usuario logar(Usuario dadosDeLogin) {
        validarDadosDeLogin(dadosDeLogin);

        Usuario usuarioSalvo = usuarioRepository.findByNome(dadosDeLogin.getNome());

        if (usuarioSalvo == null) {
            throw criarErroDeLogin();
        }

        String senhaDigitada = dadosDeLogin.getSenha();
        String senhaSalva = usuarioSalvo.getSenha();
        boolean senhaEstaCorreta = codificadorDeSenha.matches(senhaDigitada,senhaSalva);

        if (!senhaEstaCorreta) {
            throw criarErroDeLogin();
        }

        return usuarioSalvo;
    }

    private void validarDadosDeLogin(Usuario dadosDeLogin) {
        if (dadosDeLogin == null) {
            throw criarErroDeLogin();
        }

        String nomeDigitado = dadosDeLogin.getNome();
        String senhaDigitada = dadosDeLogin.getSenha();

        if (nomeDigitado == null || nomeDigitado.isBlank() || senhaDigitada == null || senhaDigitada.isBlank()) {
            throw criarErroDeLogin();
        }
    }

    private ResponseStatusException criarErroDeLogin() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "nome ou senha inválidos");
    }
}
