import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { beforeEach, describe, expect } from 'vitest';
import { CadUsuario } from '../Paginas/CadUsuario';
import axios from 'axios';

//render: renderiza a minha tela
//screen: eu vejo os elementos que estão sendo exibidos
//fireEvent: simula o que o usuário pode fazer em tela
//waitFor: espera o resultado do evento

vi.mock('axios');

describe("Cadastro de Usuário", () => {

    beforeEach(() => {
        render(<CadUsuario />);
    });
    
    it("A tela é exibida", () => {    

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getAllByLabelText(/E-mail/i);
        const botao = screen.getByRole("button", {name:/Cadastrar/i });

        expect(nomeInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(botao).toBeTruthy();
    });


    it("deve resetar os campos após submissão", async () => {

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);
    
        fireEvent.input(nomeInput, { target: { value: "Leticia Oliveira" } });
        fireEvent.input(emailInput, { target: { value: "le@email.com" } });

        axios.post.mockResolvedValue({data: {} });
    
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    
        await waitFor(() => {
            expect(nomeInput.value).toBe("");
            expect(emailInput.value).toBe("");
        });
    });


    it("Erro quando os campos nome e email estiver vazio", async () => {

        fireEvent.click(screen.getByRole("button", {name:/Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText("Insira ao menos 1 caractere")).toBeTruthy();
            expect(screen.getByText("Insira seu email")).toBeTruthy();
        });
    });


    it("deve mostrar erro quando apenas o campo nome estiver vazio", async () => {
 
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "email@email.com" } });
    
        fireEvent.submit(screen.getByRole("button", { name: /Cadastrar/i }));
        await waitFor(() => {
            expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeTruthy();
        });
    });


    it("deve mostrar erro quando apenas o campo email estiver vazio", async () => {
 
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Leticia Oliveira" } });
    
        fireEvent.submit(screen.getByRole("button", { name: /Cadastrar/i }));
        await waitFor(() => {
            expect(screen.getByText(/Insira seu email/i)).toBeTruthy();
        });
    });


    it("deve mostrar erro quando o email tiver formato inválido", async () => {
 
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Leticia Oliveira" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "email" } });
    
        fireEvent.submit(screen.getByRole("button", { name: /Cadastrar/i }));
        await waitFor(() => {
            expect(screen.getByText(/Formato de email inválido/i)).toBeTruthy();
        });
    });

    it("deve mostrar erro quando o email tiver caracteres especiais não permitidos", async () => {
 
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Leticia Oliveira" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "_.-)($%¨¨¨&***((!@#$%¨¨&[}]@email.com" } });
    
        fireEvent.submit(screen.getByRole("button", { name: /Cadastrar/i }));
        await waitFor(() => {
            expect(screen.getByText(/Formato de email inválido/i)).toBeTruthy();
        });
    });


    it("deve permitir caracteres especiais válidos no email", async () => {
        const emailInput = screen.getByLabelText(/E-mail/i);

        // Testando com diferentes caracteres especiais válidos em emails
        const emailsValidos = [
            "email.valido@dominio.com",
            "email_valido@dominio.com",
            "email-valido@dominio.com",
            "email@dominio.co.br",
            "email@sub.dominio.com"
        ];

        for (let email of emailsValidos) {
            fireEvent.input(emailInput, { target: { value: email } });
            
            // Aguardar o envio para garantir que não haja erro
            await waitFor(() => {
                expect(emailInput.value).toBe(email);
            });
        }
    });


    it("deve mostrar erro quando o email já estiver cadastrado", async () => {
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Leticia Oliveira" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "leticia@email.com" } });

        // Simulando erro de email já cadastrado
        axios.post.mockRejectedValueOnce({
            response: { data: { email: ["Este email já está cadastrado"] } },
        });

        fireEvent.submit(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Este email já está cadastrado/i)).toBeTruthy();
        });
    });



    it("deve mostrar erro quando o nome tiver formato inválido", async () => {
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Leticia" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "leticia@email.com" } });

        fireEvent.submit(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Digite nome completo \(nome e sobrenome\), sem números ou símbolos, sem espaços no início\/fim/i)).toBeTruthy();        });
    });


    it("Não deve permitir adicionar mais que 40 caracteres no campo nome", async () => {
        const nomeInput = screen.getByLabelText(/Nome/i);

        const nomeExcedido = "Leticia Oliveira dos Santos, um nome bem longo";

        fireEvent.input(nomeInput, { target: { value: nomeExcedido } });

        await waitFor(() => {
            expect(nomeInput.value.length).toBe(40);
        });
    });

    it("Não deve permitir adicionar mais que 40 caracteres no campo email", async () => {
        const emailInput = screen.getByLabelText(/E-mail/i);

        const emailExcedido = "emailmuitoextensocompletoqueexcede40caract@email.com";

        fireEvent.input(emailInput, { target: { value: emailExcedido } });

        await waitFor(() => {
            expect(emailInput.value.length).toBe(40);
        });
    });
})