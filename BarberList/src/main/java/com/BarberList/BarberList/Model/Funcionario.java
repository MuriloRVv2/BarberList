package com.BarberList.BarberList.Model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "funcionarios")
public class Funcionario extends Usuario {

    private String especialidade;

    private double avaliacao = 0.0;

    @Column(name = "total_avaliacoes")
    private int totalAvaliacoes = 0;

    @Column(name = "horario_inicio")
    private String horarioInicio = "09:00";

    @Column(name = "horario_fim")
    private String horarioFim = "17:00";

    @Column(name = "horario_almoco_inicio")
    private String horarioAlmocoInicio = "12:00";

    @Column(name = "horario_almoco_fim")
    private String horarioAlmocoFim = "13:00";

    @ElementCollection
    @CollectionTable(name = "funcionario_dias_trabalho",
        joinColumns = @JoinColumn(name = "funcionario_id"))
    @Column(name = "dia_semana")
    private List<Integer> diasTrabalho = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));

    @OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BloqueioHorario> bloqueios = new ArrayList<>();

    public Funcionario() {
        setTipo(TipoUsuario.FUNCIONARIO);
    }

    public void atualizarAvaliacao(double novaNota) {
        double total = this.avaliacao * this.totalAvaliacoes + novaNota;
        this.totalAvaliacoes++;
        this.avaliacao = Math.round((total / this.totalAvaliacoes) * 10.0) / 10.0;
    }

    // Getters e Setters
    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    public double getAvaliacao() { return avaliacao; }
    public void setAvaliacao(double avaliacao) { this.avaliacao = avaliacao; }
    public int getTotalAvaliacoes() { return totalAvaliacoes; }
    public void setTotalAvaliacoes(int totalAvaliacoes) { this.totalAvaliacoes = totalAvaliacoes; }
    public String getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(String horarioInicio) { this.horarioInicio = horarioInicio; }
    public String getHorarioFim() { return horarioFim; }
    public void setHorarioFim(String horarioFim) { this.horarioFim = horarioFim; }
    public String getHorarioAlmocoInicio() { return horarioAlmocoInicio; }
    public void setHorarioAlmocoInicio(String s) { this.horarioAlmocoInicio = s; }
    public String getHorarioAlmocoFim() { return horarioAlmocoFim; }
    public void setHorarioAlmocoFim(String s) { this.horarioAlmocoFim = s; }
    public List<Integer> getDiasTrabalho() { return diasTrabalho; }
    public void setDiasTrabalho(List<Integer> diasTrabalho) { this.diasTrabalho = diasTrabalho; }
    public List<BloqueioHorario> getBloqueios() { return bloqueios; }
    public void setBloqueios(List<BloqueioHorario> bloqueios) { this.bloqueios = bloqueios; }
}