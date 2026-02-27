package com.BarberList.BarberList.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private String horario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAgendamento status = StatusAgendamento.AGENDADO;

    private double preco;

    private boolean gratuito = false;

    private Integer avaliacao;

    private String comentario;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public Funcionario getFuncionario() { return funcionario; }
    public void setFuncionario(Funcionario funcionario) { this.funcionario = funcionario; }
    public Servico getServico() { return servico; }
    public void setServico(Servico servico) { this.servico = servico; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public StatusAgendamento getStatus() { return status; }
    public void setStatus(StatusAgendamento status) { this.status = status; }
    public double getPreco() { return preco; }
    public void setPreco(double preco) { this.preco = preco; }
    public boolean isGratuito() { return gratuito; }
    public void setGratuito(boolean gratuito) { this.gratuito = gratuito; }
    public Integer getAvaliacao() { return avaliacao; }
    public void setAvaliacao(Integer avaliacao) { this.avaliacao = avaliacao; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}