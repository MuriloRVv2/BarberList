package com.BarberList.BarberList.Controller;

import com.BarberList.BarberList.Model.*;
import com.BarberList.BarberList.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    @Autowired private FuncionarioRepository funcRepo;
    @Autowired private BloqueioHorarioRepository bloqueioRepo;

    @GetMapping
    public List<Funcionario> listar() {
        return funcRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscar(@PathVariable Long id) {
        return funcRepo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @SuppressWarnings("unchecked")
    @PutMapping("/{id}/horarios")
    public ResponseEntity<?> atualizarHorarios(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Funcionario func = funcRepo.findById(id).orElseThrow();

        if (body.containsKey("diasTrabalho"))
            func.setDiasTrabalho((List<Integer>) body.get("diasTrabalho"));
        if (body.containsKey("horarioInicio"))
            func.setHorarioInicio(body.get("horarioInicio").toString());
        if (body.containsKey("horarioFim"))
            func.setHorarioFim(body.get("horarioFim").toString());
        if (body.containsKey("horarioAlmocoInicio"))
            func.setHorarioAlmocoInicio(body.get("horarioAlmocoInicio").toString());
        if (body.containsKey("horarioAlmocoFim"))
            func.setHorarioAlmocoFim(body.get("horarioAlmocoFim").toString());

        return ResponseEntity.ok(funcRepo.save(func));
    }

    @PostMapping("/{id}/bloqueios")
    public ResponseEntity<?> adicionarBloqueio(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Funcionario func = funcRepo.findById(id).orElseThrow();

        BloqueioHorario bloqueio = new BloqueioHorario();
        bloqueio.setFuncionario(func);
        bloqueio.setData(LocalDate.parse(body.get("data")));
        bloqueio.setHorario(body.get("horario"));
        bloqueio.setMotivo(body.getOrDefault("motivo", "Indisponível"));

        return ResponseEntity.ok(bloqueioRepo.save(bloqueio));
    }

    @DeleteMapping("/{id}/bloqueios/{bloqueioId}")
    public ResponseEntity<?> removerBloqueio(
            @PathVariable Long id,
            @PathVariable Long bloqueioId) {
        bloqueioRepo.deleteById(bloqueioId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/bloqueios")
    public List<BloqueioHorario> listarBloqueios(@PathVariable Long id) {
        return bloqueioRepo.findByFuncionarioId(id);
    }
}