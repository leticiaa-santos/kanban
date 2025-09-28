import React, { useState, useEffect } from "react";
import axios from "axios";
import { Coluna } from "./Coluna";
import { DndContext } from "@dnd-kit/core"; 
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'

export function Quadro() {
    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        const apiURL = 'http://127.0.0.1:8000/api/tarefa/';
        axios.get(apiURL)
            .then(response => setTarefas(response.data))
            .catch(error => console.error("Algo seu errado", error));
    }, []);

    function handleDragEnd(event) {
        const { active, over } = event;
        if (over && active) {
            const tarefaId = active.id;
            const novaColuna = over.id;
            setTarefas(prev =>
                prev.map(tarefa => tarefaId === tarefa.id ? { ...tarefa, status: novaColuna } : tarefa)
            );

            axios.patch(`http://127.0.0.1:8000/api/tarefa/${tarefaId}/`, { status: novaColuna })
                .catch(err => console.error("Erro ao atualizar status: ", err));
        }
    }

    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === 'a fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'fazendo');
    const tarefasFeito = tarefas.filter(tarefa => tarefa.status === 'feito');

    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToFirstScrollableAncestor]}>
            <main className="container">
                <h1 id="quadro-titulo">Meu Quadro</h1>
                
                <section className="atividades" role="region" aria-labelledby="quadro-titulo">
                    <Coluna id='a fazer' titulo="A fazer" tarefas={tarefasAfazer} />
                    <Coluna id='fazendo' titulo="Fazendo" tarefas={tarefasFazendo} />
                    <Coluna id='feito' titulo="Feito" tarefas={tarefasFeito} />
                </section>
            </main>
        </DndContext>
    );
}
