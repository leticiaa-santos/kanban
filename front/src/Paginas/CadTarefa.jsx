import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PRIORIDADE_CHOICES = ["baixa", "media", "alta"];

// Esquema de validação com Zod
const schemaCadTarefa = z.object({
    descricao: z.string()
        .trim()
        .min(5, { message: 'Insira ao menos 5 caracteres' })
        .max(255, { message: 'Insira até 255 caracteres' }),

    nomeSetor: z.string()
        .trim()
        .min(1, { message: 'Insira ao menos 1 caractere' })
        .max(90, { message: 'Insira até 90 caracteres' })
        .regex(/^[^0-9]*$/, { message: "Este campo não pode conter números" }),

    prioridade: z.enum(PRIORIDADE_CHOICES, {
        errorMap: () => ({ message: 'Escolha uma prioridade válida' }),
    }),

    idUsuario: z.coerce.number()
        .min(1, { message: 'Selecione um usuário' }),

    status: z.string().default("a fazer")
});

export function CadTarefa() {
    const [usuarios, setUsuarios] = useState([]);
    const [serverError, setServerError] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(schemaCadTarefa),
        mode: "onChange",
        defaultValues: {
            status: "a fazer"
        }
    });

    // Buscar usuários cadastrados
    useEffect(() => {
        async function buscarUsuario() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/usuario/');
                setUsuarios(response.data);
            } catch (error) {
                console.error("Erro ao buscar usuários", error);
            }
        }
        buscarUsuario();
    }, []);

    async function obterDados(data) {
        setServerError("");
        setSucesso(false);

        try {
            await axios.post("http://127.0.0.1:8000/api/tarefa/", data);
            setSucesso(true);
            reset({ status: "a fazer" }); // mantém status fixo
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            setServerError("Erro inesperado. Tente novamente.");
            console.log("Erro backend:", error);
        }
    }

    return (
        <form className="formularios" onSubmit={handleSubmit(obterDados)} noValidate>
            <h2>Cadastro de Tarefa</h2>

            {/* Campo Descrição */}
            <label htmlFor="descricao">
                Descrição <span aria-hidden="true">*</span>
            </label>
            <textarea
                id="descricao"
                placeholder="Descreva a tarefa"
                aria-required="true"
                aria-invalid={errors.descricao ? "true" : "false"}
                aria-describedby={errors.descricao ? "erro-descricao" : undefined}
                {...register("descricao")}
                className={errors.descricao ? "erro-input" : ""}
            />
            {errors.descricao && (
                <p id="erro-descricao" role="alert" className="erro-msg">
                    {errors.descricao.message}
                </p>
            )}

            {/* Campo Nome do Setor */}
            <label htmlFor="nomeSetor">
                Nome do Setor <span aria-hidden="true">*</span>
            </label>
            <input
                type="text"
                id="nomeSetor"
                placeholder="Setor A"
                aria-required="true"
                aria-invalid={errors.nomeSetor ? "true" : "false"}
                aria-describedby={errors.nomeSetor ? "erro-nomeSetor" : undefined}
                {...register("nomeSetor")}
                className={errors.nomeSetor ? "erro-input" : ""}
            />
            {errors.nomeSetor && (
                <p id="erro-nomeSetor" role="alert" className="erro-msg">
                    {errors.nomeSetor.message}
                </p>
            )}

            {/* Campo Prioridade */}
            <label htmlFor="prioridade">
                Prioridade <span aria-hidden="true">*</span>
            </label>
            <select
                id="prioridade"
                aria-required="true"
                aria-invalid={errors.prioridade ? "true" : "false"}
                aria-describedby={errors.prioridade ? "erro-prioridade" : undefined}
                {...register("prioridade")}
                className={errors.prioridade ? "erro-input" : ""}
            >
                <option value="" disabled>Selecione a prioridade...</option>
                {PRIORIDADE_CHOICES.map((prioridade) => (
                    <option key={prioridade} value={prioridade}>
                        {prioridade}
                    </option>
                ))}
            </select>
            {errors.prioridade && (
                <p id="erro-prioridade" role="alert" className="erro-msg">
                    {errors.prioridade.message}
                </p>
            )}

            <label htmlFor="status">
                Status <span aria-hidden="true">*</span>
            </label>
            <input
                type="text"
                id="status"
                value="a fazer"
                readOnly
                aria-readonly="true"
                aria-required="true"
                {...register("status")}
                className="campo-bloqueado"
            />

            {/* Campo Usuário */}
            <label htmlFor="idUsuario">
                Usuário <span aria-hidden="true">*</span>
            </label>
            <select
                id="idUsuario"
                aria-required="true"
                aria-invalid={errors.idUsuario ? "true" : "false"}
                aria-describedby={errors.idUsuario ? "erro-idUsuario" : undefined}
                {...register("idUsuario")}
                className={errors.idUsuario ? "erro-input" : ""}
            >
                <option value="">Selecione um usuário</option>
                {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                        {usuario.nome}
                    </option>
                ))}
            </select>
            {errors.idUsuario && (
                <p id="erro-idUsuario" role="alert" className="erro-msg">
                    {errors.idUsuario.message}
                </p>
            )}

            <button type="submit">Cadastrar</button>

            {/* Mensagem de erro do servidor */}
            {serverError && (
                <p role="alert" className="erro-server">{serverError}</p>
            )}

            {/* Mensagem de sucesso */}
            {sucesso && (
                <p role="status" className="sucesso-msg">
                    Tarefa cadastrada com sucesso!
                </p>
            )}
        </form>
    );
}
