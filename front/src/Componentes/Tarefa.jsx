import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';
import drag from '../assets/drag.png';

export function Tarefa({ tarefa }) {
    const navigate = useNavigate();
    const [status, setStatus] = useState(tarefa.status || "");

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: tarefa.id,
    });

    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
        : undefined;

    async function excluirTarefa(id) {
        if (confirm("Tem certeza mesmo que quer excluir?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/tarefa/${id}/`);
                alert("Tarefa excluída com sucesso");
                window.location.reload();
            } catch (error) {
                console.error("Erro ao excluir a tarefa", error);
                alert("Erro ao excluir");
            }
        }
    }

    async function alterarStatus(event) {
        event.preventDefault();
        try {
            await axios.patch(`http://127.0.0.1:8000/api/tarefa/${tarefa.id}/`, {
                status: status,
            });
            alert("Status alterado com sucesso!");
            window.location.reload();
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status.");
        }
    }

    return (
        <article 
            className="tarefa" 
            ref={setNodeRef} 
            style={style} 
            role="listitem"
            aria-label={`Tarefa: ${tarefa.descricao}. Arrastável.`}
        >
            <header
                {...listeners}
                {...attributes}
                className={isDragging ? "dragging" : ""}
                tabIndex={0}
                aria-label={`Tarefa: ${tarefa.descricao}. Arraste para mudar de coluna.`}
            >
                <h3 id={`tarefa-${tarefa.id}`}>{tarefa.descricao}</h3>
                <img 
                    src={drag} 
                    alt="Ícone que permite arrastar a tarefa para outra coluna" 
                />
            </header>

            <dl>
                <dt>Setor:</dt>
                <dd>{tarefa.nomeSetor}</dd>

                <dt>Prioridade:</dt>
                <dd>{tarefa.prioridade}</dd>
            </dl>  

            <div className='tarefa_acoes'>
                <button 
                    type='button' 
                    onClick={() => navigate(`/editarTarefa/${tarefa.id}`)}
                    aria-label={`Editar tarefa: ${tarefa.descricao}`}
                >
                    Editar
                </button>

                <button 
                    type='button' 
                    onClick={() => excluirTarefa(tarefa.id)}
                    aria-label={`Excluir tarefa: ${tarefa.descricao}`}
                >
                    Excluir
                </button>
            </div> 

            <form className='tarefa_status' onSubmit={alterarStatus}>
                <label htmlFor={`status-${tarefa.id}`}>Status:</label>
                <select
                    id={`status-${tarefa.id}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Selecione </option>
                    <option value="a fazer">A fazer</option>
                    <option value="fazendo">Fazendo</option>
                    <option value="feito">Feito</option>                    
                </select>
                <button type='submit'>Alterar Status</button>
            </form>
        </article>
    );
}
