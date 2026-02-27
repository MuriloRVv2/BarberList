package com.BarberList.BarberList.Repository;

import com.BarberList.BarberList.Model.BloqueioHorario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BloqueioHorarioRepository extends JpaRepository<BloqueioHorario, Long> {
    List<BloqueioHorario> findByFuncionarioIdAndData(Long funcionarioId, LocalDate data);
    List<BloqueioHorario> findByFuncionarioId(Long funcionarioId);
}