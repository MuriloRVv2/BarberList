package com.BarberList.BarberList.Repository;

import com.BarberList.BarberList.Model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
}