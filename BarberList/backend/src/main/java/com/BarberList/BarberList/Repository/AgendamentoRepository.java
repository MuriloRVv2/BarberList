package com.BarberList.BarberList.Repository;

import com.BarberList.BarberList.Model.Agendamento;
import com.BarberList.BarberList.Model.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByClienteId(Long clienteId);

    List<Agendamento> findByFuncionarioIdAndData(Long funcionarioId, LocalDate data);

    List<Agendamento> findByFuncionarioIdAndDataAndStatus(
        Long funcionarioId, LocalDate data, StatusAgendamento status);

    List<Agendamento> findByClienteIdAndStatus(Long clienteId, StatusAgendamento status);
}