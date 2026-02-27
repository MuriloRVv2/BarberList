package com.BarberList.BarberList.Controller;

import com.BarberList.BarberList.Model.Avaliacao;
import com.BarberList.BarberList.Repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoRepository avaliacaoRepo;

    @GetMapping
    public List<Avaliacao> listar() {
        return avaliacaoRepo.findAllByOrderByDataDesc();
    }

    @GetMapping("/funcionario/{nome}")
    public List<Avaliacao> porFuncionario(@PathVariable String nome) {
        return avaliacaoRepo.findByFuncionarioNome(nome);
    }

    @PostMapping
    public Avaliacao criar(@RequestBody Avaliacao avaliacao) {
        avaliacao.setData(LocalDate.now());
        return avaliacaoRepo.save(avaliacao);
    }
}