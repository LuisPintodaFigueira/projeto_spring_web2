package br.edu.ifpr.estoufrito.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import br.edu.ifpr.estoufrito.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    
    private final SecretKey chaveDeAssinatura;

    private final long tempoDeExpiracaoEmMilisegundos;

    public JwtService(@Value("${jwt.secret}") String segredo, @Value("${jwt.expiracao-minutos:60}") long minutosAteExpirar) {
        byte[] segredoEmBytes = segredo.getBytes(StandardCharsets.UTF_8);
        this.chaveDeAssinatura = Keys.hmacShaKeyFor(segredoEmBytes);
        this.tempoDeExpiracaoEmMilisegundos = minutosAteExpirar * 60 * 1000;
    }

    public String gerarToken(Usuario usuario) {
        Date horarioAtual = new Date();
        long horarioDeExpiracao = horarioAtual.getTime() + tempoDeExpiracaoEmMilisegundos;
        Date dataDeExpiracao = new Date(horarioDeExpiracao);

        return Jwts.builder()
                .subject(String.valueOf(usuario.getId()))
                .issuedAt(horarioAtual)
                .expiration(dataDeExpiracao)
                .signWith(chaveDeAssinatura)
                .compact();
    }

    public Long validarExtrairId(String token) {
        try {
            Claims dadosDoToken = Jwts.parser()
                    .verifyWith(chaveDeAssinatura)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            String idDoUsuario = dadosDoToken.getSubject();
            return Long.valueOf(idDoUsuario);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}
