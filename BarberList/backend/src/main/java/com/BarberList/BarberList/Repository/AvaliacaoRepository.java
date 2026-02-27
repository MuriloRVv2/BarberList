package com.BarberList.BarberList.Repository;

import com.BarberList.BarberList.Model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByFuncionarioNome(String funcionarioNome);
    List<Avaliacao> findAllByOrderByDataDesc();
}