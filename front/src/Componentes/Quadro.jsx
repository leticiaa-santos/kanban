import React, { useState, useEffect } from "react";
import axios from "axios";
import { Coluna } from "./Coluna";
import { DndContext } from "@dnd-kit/core"; //Uso da biblioteca drag and drop 

export function Quadro () {
    const [tarefas, setTarefas] = useState([]);

    // o Effect é um hook que permite a renderização de algo na tela
    useEffect (() => {

        //construção de uma variável para guardar a url da API
        const apiURL = 'http://127.0.0.1:8000/api/tarefa/';

        //permite a chamada do endereço
        axios.get(apiURL)

            //se a resposta for positiva
            .then(response => {setTarefas(response.data)
            })

            //se a resposta for negativa
            .catch(error => {
                console.error("Algo seu errado", error)
            });
    }, []);

    function handleDragEnd(event){
        const { active, over } =event;
 
        if(over && active){
            const tarefaId = active.id; //Armazena o ID da tarefa que está sofrendo o evento
            const novaColuna =over.id; //Armazena a coluna da tarefa
            setTarefas (prev=>
                prev.map(tarefa => tarefaId === tarefa.id ? {...tarefa, status: novaColuna} : tarefa)
            );
 
            //Atualiza o status do card (muda a situação do card {a fazer/ fazendo / pronto})
            axios.patch(`http://127.0.0.1:8000/api/tarefa/${tarefaId}/`,{
                status: novaColuna
            })
            .catch(err => console.error("Erro ao  atualizar status: ", err));
        }
    }


    //armazenando em variáveis o resultado de uma função callback que procura tarefas com um certo status
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === 'a fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'fazendo');
    const tarefasFeito = tarefas.filter(tarefa => tarefa.status === 'feito');

    return (
        <>
            {/* Onde estão os elementos que podem ser movidos */}
            <DndContext onDragEnd={handleDragEnd}>

                <main className="container">
                    <h1>Meu Quadro</h1>
                    <section className="atividades">
                        <Coluna id = 'a fazer' titulo = "A fazer" tarefas={tarefasAfazer}/>
                        <Coluna id = 'fazendo' titulo = "Fazendo" tarefas={tarefasFazendo}/>
                        <Coluna id = 'feito' titulo = "Feito" tarefas={tarefasFeito}/>
                    </section>
                    
                </main>

            </DndContext>
        </>
        
    );

}