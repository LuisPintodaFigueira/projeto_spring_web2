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
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String cabecalho = request.getHeader("Authorization");

        if (cabecalho == null || !cabecalho.startsWith("Bearer ")) {
            negar(response, "Token ausente");
            return false;
        }

        String token = cabecalho.substring(7);

        Long usuarioId = jwtService.validarExtrairId(token);

        if (usuarioId == null) {
            negar(response, "Token inválido ou expirado");
            return false;
        }

        request.setAttribute("usuarioId", usuarioId);
        return true;
    }

    private void negar(HttpServletResponse response, String mensagem) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"erro\":\"" + mensagem + "\"}");
    }
    
}
