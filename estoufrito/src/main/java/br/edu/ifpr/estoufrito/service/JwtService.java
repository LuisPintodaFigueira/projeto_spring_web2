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
    
    private final SecretKey chave;

    private final long expiracaoMs;

    public JwtService(@Value("${jwt.secret}") String segredo, @Value("${jwt.expiracao-minutos:60}") long minutos) {
        this.chave = Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));

        this.expiracaoMs = minutos * 60 * 1000;
    }

    public String gerarToken(Usuario usuario) {
        Date agora = new Date();
        return Jwts.builder()
                .subject(String.valueOf(usuario.getId()))
                .issuedAt(agora)
                .expiration(new Date(agora.getTime() + expiracaoMs))
                .signWith(chave)
                .compact();
    }

    public Long validarExtrairId(String token) {
        try {
            Claims dados = Jwts.parser()
                    .verifyWith(chave)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Long.valueOf(dados.getSubject());
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}
