package br.edu.ifpr.estoufrito.controller;

import br.edu.ifpr.estoufrito.model.Usuario;
import br.edu.ifpr.estoufrito.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

@RestController 
@RequestMapping ("/v1/usuarios")
public class LoginController {
    
    @Autowired 
    private UsuarioService usuarioService;

    @PostMapping("/cadastro")
    public Usuario cadastrarNovoUsuario(@RequestBody Usuario usuario) {
        System.out.println("salvando no banco: " + usuario.getNome());
        return usuarioService.cadastrar(usuario);
    }

    @PostMapping("/login")
    public String fazerLogin(@RequestBody Usuario usuario) {
        System.out.println("tentando logar com: " + usuario.getNome());
        return usuarioService.logar(usuario);
    }
}
