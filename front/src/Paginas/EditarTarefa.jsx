import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Validação do formulário com zod
const schemaEditarTarefas = z.object({
    prioridade: z.enum(["baixa", "media", "alta"], {
        errorMap: () => ({ message: "Escolha uma prioridade válida" }),
    }),
    status: z.enum(["a fazer", "fazendo", "feito"], {
        errorMap: () => ({ message: "Escolha um status válido" }),
    }),
});

export function EditarTarefa() {
    const { id } = useParams();              // Pega o ID da tarefa pela URL
    const [tarefa, setTarefa] = useState(null); // Estado para armazenar a tarefa
    const navigate = useNavigate();

    // Configura react-hook-form com validação zod
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(schemaEditarTarefas),
        mode: "onChange",
    });

    // Busca a tarefa na API ao carregar o componente
    useEffect(() => {
        async function buscarTarefa() {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/tarefa/${id}/`);
                setTarefa(res.data);

                // Preenche o formulário com os dados da tarefa
                reset({
                    prioridade: res.data.prioridade,
                    status: res.data.status,
                });
            } catch (err) {
                console.error("Erro ao buscar tarefa", err);
            }
        }

        buscarTarefa();
    }, [id, reset]);

    // Envia as alterações para a API e navega para a home
    async function salvarEdicao(data) {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/tarefa/${id}/`, data);
            alert("Tarefa atualizada com sucesso!");
            navigate("/");
        } catch (err) {
            console.error("Erro ao editar tarefa", err);
            alert("Houve um erro ao editar a tarefa");
        }
    }

    // Exibe mensagem enquanto carrega tarefa
    if (!tarefa) {
        return <p>Carregando tarefa...</p>;
    }

    return (
        <section>
            <form className="formularios" onSubmit={handleSubmit(salvarEdicao)}>
                <h2>Editar Tarefa</h2>

                {/* Campos somente leitura */}
                <label htmlFor="descricao">Descrição:</label>
                <textarea
                    id="descricao"
                    value={tarefa.descricao}
                    readOnly
                    aria-readonly="true"
                />

                <label htmlFor="setor">Setor:</label>
                <input
                    id="setor"
                    type="text"
                    value={tarefa.nomeSetor}
                    readOnly
                    aria-readonly="true"
                />

                {/* Campo prioridade com validação */}
                <label htmlFor="prioridade">Prioridade:</label>
                <select
                    id="prioridade"
                    {...register("prioridade")}
                    aria-invalid={errors.prioridade ? "true" : "false"}
                    aria-describedby={errors.prioridade ? "prioridade-erro" : undefined}
                    defaultValue={tarefa.prioridade}
                >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                </select>
                {errors.prioridade && (
                    <p id="prioridade-erro" className="errors">
                        {errors.prioridade.message}
                    </p>
                )}

                {/* Campo status com validação */}
                <label htmlFor="status">Status:</label>
                <select
                    id="status"
                    {...register("status")}
                    aria-invalid={errors.status ? "true" : "false"}
                    aria-describedby={errors.status ? "status-erro" : undefined}
                    defaultValue={tarefa.status}
                >
                    <option value="a fazer">A fazer</option>
                    <option value="fazendo">Fazendo</option>
                    <option value="feito">Feito</option>
                </select>
                {errors.status && (
                    <p id="status-erro" className="errors">
                        {errors.status.message}
                    </p>
                )}

                <button type="submit">Editar</button>
            </form>
        </section>
    );
}
