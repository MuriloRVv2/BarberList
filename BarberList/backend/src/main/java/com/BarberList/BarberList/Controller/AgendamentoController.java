package com.BarberList.BarberList.Controller;

import com.BarberList.BarberList.Model.*;
import com.BarberList.BarberList.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    @Autowired private AgendamentoRepository agendamentoRepo;
    @Autowired private ClienteRepository clienteRepo;
    @Autowired private FuncionarioRepository funcRepo;
    @Autowired private ServicoRepository servicoRepo;

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> body) {
        Long clienteId = Long.valueOf(body.get("clienteId").toString());
        Long funcId = Long.valueOf(body.get("funcionarioId").toString());
        Long servicoId = Long.valueOf(body.get("servicoId").toString());
        String data = body.get("data").toString();
        String horario = body.get("horario").toString();

        Cliente cliente = clienteRepo.findById(clienteId).orElseThrow();
        Funcionario func = funcRepo.findById(funcId).orElseThrow();
        Servico servico = servicoRepo.findById(servicoId).orElseThrow();

        Agendamento ag = new Agendamento();
        ag.setCliente(cliente);
        ag.setFuncionario(func);
        ag.setServico(servico);
        ag.setData(LocalDate.parse(data));
        ag.setHorario(horario);

        if (cliente.temCorteGratis()) {
            ag.setPreco(0);
            ag.setGratuito(true);
        } else {
            ag.setPreco(servico.getPreco());
        }

        return ResponseEntity.ok(agendamentoRepo.save(ag));
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Agendamento> porCliente(@PathVariable Long clienteId) {
        return agendamentoRepo.findByClienteId(clienteId);
    }

    @GetMapping("/funcionario/{funcId}")
    public List<Agendamento> porFuncionarioDia(
            @PathVariable Long funcId,
            @RequestParam String data) {
        return agendamentoRepo.findByFuncionarioIdAndData(funcId, LocalDate.parse(data));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Long id) {
        Agendamento ag = agendamentoRepo.findById(id).orElseThrow();
        ag.setStatus(StatusAgendamento.CANCELADO);
        return ResponseEntity.ok(agendamentoRepo.save(ag));
    }

    @PutMapping("/{id}/concluir")
    public ResponseEntity<?> concluir(@PathVariable Long id) {
        Agendamento ag = agendamentoRepo.findById(id).orElseThrow();
        ag.setStatus(StatusAgendamento.CONCLUIDO);
        ag.getCliente().incrementarFidelidade();
        clienteRepo.save(ag.getCliente());
        return ResponseEntity.ok(agendamentoRepo.save(ag));
    }

    @PutMapping("/{id}/remarcar")
    public ResponseEntity<?> remarcar(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Agendamento ag = agendamentoRepo.findById(id).orElseThrow();
        ag.setData(LocalDate.parse(body.get("data")));
        ag.setHorario(body.get("horario"));
        return ResponseEntity.ok(agendamentoRepo.save(ag));
    }

    @PutMapping("/{id}/avaliar")
    public ResponseEntity<?> avaliar(@PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Agendamento ag = agendamentoRepo.findById(id).orElseThrow();
        int nota = Integer.parseInt(body.get("nota").toString());
        String comentario = body.get("comentario").toString();

        ag.setAvaliacao(nota);
        ag.setComentario(comentario);
        ag.getFuncionario().atualizarAvaliacao(nota);
        funcRepo.save(ag.getFuncionario());

        return ResponseEntity.ok(agendamentoRepo.save(ag));
    }

    @GetMapping("/disponibilidade")
    public List<String> horariosDisponiveis(
            @RequestParam Long funcionarioId,
            @RequestParam String data) {

        Funcionario func = funcRepo.findById(funcionarioId).orElseThrow();
        LocalDate date = LocalDate.parse(data);
        int dayOfWeek = date.getDayOfWeek().getValue() % 7;

        if (!func.getDiasTrabalho().contains(dayOfWeek)) {
            return Collections.emptyList();
        }

        // Gerar todos os slots de 30 min
        List<String> todos = new ArrayList<>();
        int startH = Integer.parseInt(func.getHorarioInicio().split(":")[0]);
        int endH = Integer.parseInt(func.getHorarioFim().split(":")[0]);
        int almH1 = Integer.parseInt(func.getHorarioAlmocoInicio().split(":")[0]);
        int almH2 = Integer.parseInt(func.getHorarioAlmocoFim().split(":")[0]);

        for (int h = startH; h < endH; h++) {
            for (int m = 0; m < 60; m += 30) {
                if (h >= almH1 && h < almH2) continue;
                todos.add(String.format("%02d:%02d", h, m));
            }
        }

        // Remover ocupados
        Set<String> ocupados = agendamentoRepo
            .findByFuncionarioIdAndDataAndStatus(funcionarioId, date, StatusAgendamento.AGENDADO)
            .stream().map(Agendamento::getHorario).collect(Collectors.toSet());

        // Remover bloqueados
        Set<String> bloqueados = func.getBloqueios().stream()
            .filter(b -> b.getData().equals(date))
            .map(BloqueioHorario::getHorario)
            .collect(Collectors.toSet());

        return todos.stream()
            .filter(s -> !ocupados.contains(s) && !bloqueados.contains(s))
            .collect(Collectors.toList());
    }
}