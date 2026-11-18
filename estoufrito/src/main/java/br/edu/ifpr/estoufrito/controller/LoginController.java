package br.edu.ifpr.estoufrito.controller;

import br.edu.ifpr.estoufrito.dto.LoginRequest;
import br.edu.ifpr.estoufrito.model.Usuario;
import br.edu.ifpr.estoufrito.service.JwtService;
import br.edu.ifpr.estoufrito.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/usuarios")
public class LoginController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public String fazerLogin(@RequestBody(required = false) LoginRequest dadosDeLogin) {
        if (dadosDeLogin == null) {
            throw new IllegalArgumentException("informe nome e senha");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dadosDeLogin.getNome());
        usuario.setSenha(dadosDeLogin.getSenha());

        Usuario usuarioAutenticado = usuarioService.logar(usuario);
        return jwtService.gerarToken(usuarioAutenticado);
    }
}
