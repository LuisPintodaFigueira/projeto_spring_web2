package br.edu.ifpr.estoufrito.config;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import br.edu.ifpr.estoufrito.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Autowired
    private JwtService jwtService;

    @Override 
    public boolean preHandle(HttpServletRequest requisicao, HttpServletResponse resposta, Object controlador) throws Exception{
        if ("OPTIONS".equalsIgnoreCase(requisicao.getMethod())) {
            return true;
        }

        String cabecalhoDeAutorizacao = requisicao.getHeader("Authorization");

        if (cabecalhoDeAutorizacao == null || !cabecalhoDeAutorizacao.startsWith("Bearer ")) {
            enviarErroDeAutenticacao(resposta, "Token ausente");
            return false;
        }

        String token = cabecalhoDeAutorizacao.substring(7);
        Long idDoUsuario = jwtService.validarExtrairId(token);

        if (idDoUsuario == null) {
            enviarErroDeAutenticacao(resposta, "Token inválido ou expirado");
            return false;
        }

        requisicao.setAttribute("usuarioId", idDoUsuario);
        return true;
    }

    private void enviarErroDeAutenticacao(HttpServletResponse resposta, String mensagem) throws IOException {
        resposta.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        resposta.setContentType("application/json;charset=UTF-8");
        resposta.getWriter().write("{\"erro\":\"" + mensagem + "\"}");
    }
    
}
