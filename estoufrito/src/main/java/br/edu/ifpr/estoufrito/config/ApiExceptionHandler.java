package br.edu.ifpr.estoufrito.config;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.ResponseEntity;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> erroDeEntrada(IllegalArgumentException erro) {
        return ResponseEntity.badRequest().body(Map.of("erro", erro.getMessage()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> corpoInvalido() {
        return ResponseEntity.badRequest().body(Map.of("erro", "Corpo da requisição inválido."));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> erroDeStatus(ResponseStatusException erro) {
        return ResponseEntity.status(erro.getStatusCode()).body(Map.of("erro", erro.getReason()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> erroInterno(Exception erro) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("erro", "Não foi possível concluir a requisição."));
    }
}