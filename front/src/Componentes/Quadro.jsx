import React, { useState, useEffect } from "react";
import axios from "axios";
import { Coluna } from "./Coluna";
import { DndContext } from "@dnd-kit/core"; 
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'

export function Quadro() {
    const [tarefas, setTarefas] = useState([]); // Estado para armazenar tarefas

    useEffect(() => {
        // Busca tarefas na API ao montar o componente
        const apiURL = 'http://127.0.0.1:8000/api/tarefa/';
        axios.get(apiURL)
            .then(response => setTarefas(response.data))
            .catch(error => console.error("Algo seu errado", error));
    }, []);

    function handleDragEnd(event) {
        const { active, over } = event;
        if (over && active) {
            const tarefaId = active.id;       // ID da tarefa arrastada
            const novaColuna = over.id;       // ID da coluna destino

            // Atualiza localmente o status da tarefa
            setTarefas(prev =>
                prev.map(tarefa => tarefaId === tarefa.id ? { ...tarefa, status: novaColuna } : tarefa)
            );

            // Atualiza o status da tarefa na API
            axios.patch(`http://127.0.0.1:8000/api/tarefa/${tarefaId}/`, { status: novaColuna })
                .catch(err => console.error("Erro ao atualizar status: ", err));
        }
    }

    // Filtra tarefas por status para cada coluna
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === 'a fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'fazendo');
    const tarefasFeito = tarefas.filter(tarefa => tarefa.status === 'feito');

    return (
        // Contexto para drag-and-drop com restrição de scroll
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToFirstScrollableAncestor]}>
            <main className="container">
                <h1 id="quadro-titulo">Minhas Tarefas</h1>
                
                {/* Seção com as colunas de tarefas */}
                <section className="atividades" role="region" aria-labelledby="quadro-titulo">
                    <Coluna id='a fazer' titulo="A fazer" tarefas={tarefasAfazer} />
                    <Coluna id='fazendo' titulo="Fazendo" tarefas={tarefasFazendo} />
                    <Coluna id='feito' titulo="Feito" tarefas={tarefasFeito} />
                </section>
            </main>
        </DndContext>
    );
}
