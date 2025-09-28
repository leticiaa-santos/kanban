import axios from 'axios'; // Biblioteca para requisições HTTP
import { useForm } from 'react-hook-form'; // Hook para manipulação e validação de formulários
import { z } from 'zod'; // Definição de regras de validação
import { zodResolver } from '@hookform/resolvers/zod'; // Integração entre react-hook-form e zod
import { useState } from 'react';


// Esquema de validação do formulário com Zod
const schemaCadUsuario = z.object({
    nome: z.string()
        .trim()
        .min(1,'Insira ao menos 1 caractere')
        .max(40, 'Insira até 40 caracteres')
        .regex(
            /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
            "Digite nome completo (nome e sobrenome), sem números ou símbolos, sem espaços no início/fim"
        ),
    email:z.string()
        .trim()
        .min(1, 'Insira seu email')
        .max(40, 'Insira um endereço de email com até 40 carateres')
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Formato de email inválido"
        ),
})
 
 
export function CadUsuario(){
    const [serverError, setServerError] = useState("");
    const [sucesso, setSucesso] = useState(false);

    // Configuração do hook de formulário
    const {
        register,       // Registra os inputs no formulário
        handleSubmit,   // Dispara a validação e a submissão
        setValue,       // Permite atualizar valores manualmente
        formState: { errors }, // Armazena os erros de validação
        reset,          // Reseta o formulário
        setError,       // Define erros manualmente (ex: vindos do backend)
    } = useForm({
        resolver: zodResolver(schemaCadUsuario),
        mode: "onChange", // Validação a cada mudança
    });

    // Ao digitar em qualquer campo, a mensagem de sucesso desaparece
    const handleInputChange = (e, handler) => {
    setSucesso(false);
    handler(e);
    };

    // Tratamento para o campo nome (filtra caracteres inválidos em tempo real)
    const handleNomeChange = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, ""); // remove tudo que não seja letra ou espaço
        valor = valor.replace(/\s{2,}/g, " "); // evita espaços duplos
        if (valor.length > 40) valor = valor.slice(0, 40); // máximo 40 chars
        setValue("nome", valor);
    };


    // Tratamento para o campo email (remove espaços extras e limita tamanho)
    const handleEmailChange = (e) => {
        let valor = e.target.value.trim();
        if (valor.length > 40) valor = valor.slice(0, 40); // máximo 40 chars
        setValue("email", valor);
    };

    // Função para submissão do formulário
    async function obterDados(data) {
        setServerError("");
        setSucesso(false);
 
        try {
            await axios.post("http://127.0.0.1:8000/api/usuario/", data);
            setSucesso(true);
            reset(); // limpar o formulário após o cadastro
        } catch (error) {
            if (error.response?.data?.email) {
                setError("email", { message: "Este email já está cadastrado" });
            } else {
                setServerError("Erro inesperado. Tente novamente.");
            }
        }
    }

    return(
        <form className="formularios" onSubmit={handleSubmit(obterDados)} noValidate>
            <h2>Cadastro do Usuário</h2>
 
            <label htmlFor='nome'>
                Nome <span aria-hidden="true">*</span>
            </label>
            <input 
                type='text' 
                placeholder='Jose da Silva' 
                id='nome'
                aria-required="true"
                aria-invalid={errors.nome ? "true" : "false"}
                aria-describedby={errors.nome ? "erro-nome" : undefined}
                {...register("nome")} 
                onChange={(e) => handleInputChange(e, handleNomeChange)}
                className={errors.nome ? "erro-input" : ""}
            />
            {errors.nome && (
                <p id='erro-nome' role='alert' className='erro-msg'>
                    {errors.nome.message}
                </p>
            )}
 
            <label htmlFor='email'>
                E-mail <span aria-hidden="true">*</span>
            </label>
            <input 
                type='email' 
                placeholder='email@email.com' 
                id='email'
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "erro-email" : undefined}
                {...register("email")} 
                onChange={(e) => handleInputChange(e, handleEmailChange)}
                className={errors.email ? "erro-input" : ""}
            />
            {errors.email && (
                <p id='erro-email' role='alert' className='erro-msg'>
                    {errors.email.message}
                </p>
            )}
 
            <button type='submit'>Cadastrar</button>

            {/* Erro do servidor */}
            {serverError && (
                <p role="alert" className="erro-server">{serverError}</p>
            )}

            {/* Mensagem de sucesso (mais acessível) */}
            {sucesso && (
                <p role="status" className="sucesso-msg">
                Usuário cadastrado com sucesso!
                </p>
                
            )}
 
        </form>
    )
}