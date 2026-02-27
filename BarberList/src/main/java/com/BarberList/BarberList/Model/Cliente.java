package com.BarberList.BarberList.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "clientes")
public class Cliente extends Usuario {

    @Column(name = "cortes_realizados")
    private int cortesRealizados = 0;

    @Column(name = "fidelidade_atual")
    private int fidelidadeAtual = 0;

    public Cliente() {
        setTipo(TipoUsuario.CLIENTE);
    }

    public void incrementarFidelidade() {
        this.cortesRealizados++;
        this.fidelidadeAtual++;
        if (this.fidelidadeAtual > 10) {
            this.fidelidadeAtual = 0;
        }
    }

    public boolean temCorteGratis() {
        return this.fidelidadeAtual >= 10;
    }

    // Getters e Setters
    public int getCortesRealizados() { return cortesRealizados; }
    public void setCortesRealizados(int cortesRealizados) { this.cortesRealizados = cortesRealizados; }
    public int getFidelidadeAtual() { return fidelidadeAtual; }
    public void setFidelidadeAtual(int fidelidadeAtual) { this.fidelidadeAtual = fidelidadeAtual; }
}