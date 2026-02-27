package com.BarberList.BarberList.Controller;

import com.BarberList.BarberList.Model.Servico;
import com.BarberList.BarberList.Repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@CrossOrigin(origins = "*")
public class ServicoController {

    @Autowired
    private ServicoRepository servicoRepo;

    @GetMapping
    public List<Servico> listar() {
        return servicoRepo.findAll();
    }

    @PostMapping
    public Servico criar(@RequestBody Servico servico) {
        return servicoRepo.save(servico);
    }
}