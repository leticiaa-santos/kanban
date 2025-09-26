import axios from 'axios'; //é o hook que faz a comunicação com a internet (HTTP)
//hooks que permitem a validação de interação com o usuário
import { useForm } from 'react-hook-form'; // Hook (use) prmite a validação de formulários
import { z } from 'zod'; //descrição de como validar, quais são as regras
import { zodResolver } from '@hookform/resolvers/zod'; //é o que liga o hook form com o zod

//validação de formulário - usando as regras do zod
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

    const {
        register, // registra o que o usuário faz
        handleSubmit, // no momento que é feito o submit
        setValue,
        formState:{ errors }, // no formulário, se der errado, guarda os erros na variável "errors"
        reset
    }=useForm({
        resolver: zodResolver(schemaCadUsuario),
        mode: "onChange",
    });

    // Tratamento para o campo nome (apenas para prevenir entrada inválida antes do submit)
    const handleNomeChange = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, ""); // só letras e espaço
        valor = valor.replace(/\s{2,}/g, " "); // evita espaços duplos
        if (valor.length > 30) valor = valor.slice(0, 30); // máximo 30 chars
        setValue("name", valor);
    };


    // Tratamento para o campo email

    const handleEmailChange = (e) => {
        let valor = e.target.value.trim();
        if (valor.length > 50) valor = valor.slice(0, 50); // máximo 50 chars
        setValue("email", valor);
    };

    async function obterDados(data) {
        console.log('dados informados pelo user:', data)
 
        // Para grande parte das interações com outra plataforma é necessário usar o try
        try {
            await axios.post("http://127.0.0.1:8000/api/usuario/", data);
            alert("Usuário cadastrado com sucesso");
            reset(); // limpar o formulário após o cadastro
        } catch (error) {
            alert("Éeee, não rolou, na proxima talvez")
            console.log("Erros", error)
        }
    }

    return(
        <form className="formularios" onSubmit={handleSubmit(obterDados)}>
            <h2>Cadastro do Usuário</h2>
 
            <label htmlFor='nome'>Nome:</label>
            <input 
                type='text' 
                placeholder='Jose da Silva' 
                id='nome'
                {...register("nome")} 
                onChange={handleNomeChange}/>
            {/*Vejo a variável errors no campo e exibo a mensagem para o usuário*/}
            {errors.nome  && <p>{errors.nome.message}</p>}
 
            <label htmlFor='email'>E-mail:</label>
            <input 
                type='email' 
                placeholder='email@email.com' 
                id='email'
                {...register("email")} 
                onChange={handleEmailChange}/>
            {errors.email && <p>{errors.email.message}</p>}
 
            <button type='submit'>Cadastrar</button>
 
        </form>
    )
}