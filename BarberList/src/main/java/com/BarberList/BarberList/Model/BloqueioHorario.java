package com.BarberList.BarberList.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bloqueios_horario")
public class BloqueioHorario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private String horario;

    private String motivo;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Funcionario getFuncionario() { return funcionario; }
    public void setFuncionario(Funcionario funcionario) { this.funcionario = funcionario; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}