package com.BarberList.BarberList.Config;

import com.BarberList.BarberList.Model.*;
import com.BarberList.BarberList.Repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            FuncionarioRepository funcRepo,
            ServicoRepository servicoRepo) {
        return args -> {
            // Só inicializa se o banco estiver vazio
            if (funcRepo.count() > 0) return;

            // Funcionários
            Funcionario f1 = new Funcionario();
            f1.setNome("Carlos Silva");
            f1.setEmail("carlos@barbercall.com");
            f1.setSenha("123456");
            f1.setTelefone("(11) 99999-1111");
            f1.setEspecialidade("Cortes Clássicos e Degradê");
            f1.setAvaliacao(4.8);
            f1.setTotalAvaliacoes(127);
            f1.setDiasTrabalho(List.of(1, 2, 3, 4, 5, 6));
            funcRepo.save(f1);

            Funcionario f2 = new Funcionario();
            f2.setNome("Ricardo Santos");
            f2.setEmail("ricardo@barbercall.com");
            f2.setSenha("123456");
            f2.setTelefone("(11) 99999-2222");
            f2.setEspecialidade("Barbas e Cuidados Faciais");
            f2.setAvaliacao(4.6);
            f2.setTotalAvaliacoes(98);
            f2.setHorarioInicio("08:00");
            f2.setHorarioFim("18:00");
            f2.setDiasTrabalho(List.of(1, 2, 3, 4, 5));
            funcRepo.save(f2);

            Funcionario f3 = new Funcionario();
            f3.setNome("André Oliveira");
            f3.setEmail("andre@barbercall.com");
            f3.setSenha("123456");
            f3.setTelefone("(11) 99999-3333");
            f3.setEspecialidade("Cortes Modernos e Coloração");
            f3.setAvaliacao(4.9);
            f3.setTotalAvaliacoes(156);
            f3.setHorarioInicio("10:00");
            f3.setHorarioFim("20:00");
            f3.setHorarioAlmocoInicio("13:00");
            f3.setHorarioAlmocoFim("14:00");
            f3.setDiasTrabalho(List.of(2, 3, 4, 5, 6));
            funcRepo.save(f3);

            // Serviços
            servicoRepo.saveAll(List.of(
                criarServico("Corte Clássico", 45, 30, "Corte tradicional com tesoura e máquina"),
                criarServico("Corte + Barba", 65, 45, "Corte completo com barba na navalha"),
                criarServico("Degradê", 50, 40, "Degradê perfeito com acabamento premium"),
                criarServico("Barba", 30, 20, "Barba feita na navalha com toalha quente"),
                criarServico("Sobrancelha", 15, 10, "Design de sobrancelha masculina"),
                criarServico("Corte Infantil", 35, 25, "Corte para crianças até 12 anos"),
                criarServico("Pigmentação", 80, 60, "Pigmentação capilar profissional"),
                criarServico("Platinado", 120, 90, "Descoloração e platinado completo")
            ));

            System.out.println("✅ Dados iniciais carregados!");
        };
    }

    private Servico criarServico(String nome, double preco, int duracao, String desc) {
        Servico s = new Servico();
        s.setNome(nome);
        s.setPreco(preco);
        s.setDuracao(duracao);
        s.setDescricao(desc);
        return s;
    }
}