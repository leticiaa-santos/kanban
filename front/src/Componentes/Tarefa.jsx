import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//fazendo o uso do Drag
import { useDraggable } from '@dnd-kit/core'; //usando a biblioteca de arrastar
import drag from '../assets/drag.png';

export function Tarefa({ tarefa }){
    const navigate = useNavigate();
    const [status, setStatus] = useState(tarefa.status || "");

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: tarefa.id,
    });


    //pega os pontos cartesianos X e Y para dar a sensação de arrasto para o usuário
    const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;
 
    //fazendo a exclusão de uma tarefa
    //async é pq eu nao sei exatamente o tempo de resposta  
    // as funções deve ter nome que remeta a sua funcionalidade
    async function excluirTarefa(id) {
        if(confirm("Tem certeza mesmo que quer excluir?")){
            try{
                await axios.delete(`http://127.0.0.1:8000/api/tarefa/${id}/`);
                alert("Tarefa excluida com sucesso");
                window.location.reload();//refrash
            }catch(error){
                console.error("Erro ao excluir a tarefa", error);
                alert("Erro ao excluir");
            }
        }        
    }
 
    async function alterarStatus() {
        event.preventDefault();
        try {
            console.log("veio editar")
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
 
 
    return(
        <article className="tarefa" ref ={setNodeRef} style={style}>
            <header 
            {...listeners}
            {...attributes}
            className={isDragging ? "dragging" : ""}
            tabIndex={0}
            >
                <h3 id={`tarefa: ${tarefa.id}`}>{tarefa.descricao}</h3>
                <img src={drag} alt="icone que permite arrastar a tarefa para outra coluna" />
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
                    onClick={() => navigate(`/editarTarefa/${tarefa.id}`)}>Editar
                </button>

                <button onClick={()=> excluirTarefa(tarefa.id)}>Excluir</button>
            </div> 

            <form className='tarefa_status'>
                <label>Status:</label>
                 <select
                    id={`status-${tarefa.id}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Selecione </option>
                    <option value="a fazer">A fazer</option>
                    <option value="fazendo">Fazendo</option>
                    <option value="feito">Feito</option>                    
                </select>
                <button type='button' onClick={alterarStatus}>Alterar Status</button>
            </form>
 
 
        </article>
    )
 
}