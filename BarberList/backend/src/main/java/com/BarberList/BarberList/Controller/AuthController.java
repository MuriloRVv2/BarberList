package com.BarberList.BarberList.Controller;

import com.BarberList.BarberList.Model.*;
import com.BarberList.BarberList.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private ClienteRepository clienteRepo;

    @Autowired
    private FuncionarioRepository funcRepo;

    @PostMapping("/login/cliente")
    public ResponseEntity<?> loginCliente(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String senha = body.get("senha");

        return clienteRepo.findByEmail(email)
            .filter(c -> c.getSenha().equals(senha))
            .map(c -> {
                Map<String, Object> resp = new HashMap<>();
                resp.put("id", c.getId());
                resp.put("nome", c.getNome());
                resp.put("email", c.getEmail());
                resp.put("telefone", c.getTelefone());
                resp.put("tipo", "CLIENTE");
                resp.put("cortesRealizados", c.getCortesRealizados());
                resp.put("fidelidadeAtual", c.getFidelidadeAtual());
                return ResponseEntity.ok(resp);
            })
            .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/login/funcionario")
    public ResponseEntity<?> loginFuncionario(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String senha = body.get("senha");

        return funcRepo.findByEmail(email)
            .filter(f -> f.getSenha().equals(senha))
            .map(f -> ResponseEntity.ok((Object) f))
            .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        if (clienteRepo.existsByEmail(body.get("email"))) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email já cadastrado"));
        }

        Cliente cliente = new Cliente();
        cliente.setNome(body.get("nome"));
        cliente.setEmail(body.get("email"));
        cliente.setSenha(body.get("senha"));
        cliente.setTelefone(body.get("telefone"));

        Cliente saved = clienteRepo.save(cliente);

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", saved.getId());
        resp.put("nome", saved.getNome());
        resp.put("email", saved.getEmail());
        resp.put("tipo", "CLIENTE");
        return ResponseEntity.ok(resp);
    }
}