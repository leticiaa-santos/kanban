import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { beforeEach, describe, expect } from 'vitest';
import { CadUsuario } from '../Paginas/CadUsuario';
import axios from 'axios';

// Renderiza componentes, permite acessar elementos, simula ações do usuário e espera por atualizações

vi.mock('axios'); // Mocka o axios para simular chamadas HTTP

describe("Cadastro de Usuário", () => {

    beforeEach(() => {
        render(<CadUsuario />); // Renderiza a tela antes de cada teste
    });
    
    it("A tela é exibida", () => {    
        // Verifica se os campos e botão estão presentes na tela
        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getAllByLabelText(/E-mail/i);
        const botao = screen.getByRole("button", {name:/Cadastrar/i });

        expect(nomeInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(botao).toBeTruthy();
    });

    it("deve resetar os campos após submissão", async () => {
        // Simula preenchimento dos campos, submissão e verifica se são resetados
        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.input(nomeInput, { target: { value: "Leticia Oliveira" } });
        fireEvent.input(emailInput, { target: { value: "le@email.com" } });

        axios.post.mockResolvedValue({data: {} }); // Mock da resposta de sucesso

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(nomeInput.value).toBe("");
            expect(emailInput.value).toBe("");
        });
    });

    // Testes de validação de campos vazios, formatos inválidos, limites de caracteres e mensagens de erro

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
        // Testa vários emails válidos com caracteres especiais permitidos
        const emailInput = screen.getByLabelText(/E-mail/i);
        const emailsValidos = [
            "email.valido@dominio.com",
            "email_valido@dominio.com",
            "email-valido@dominio.com",
            "email@dominio.co.br",
            "email@sub.dominio.com"
        ];

        for (let email of emailsValidos) {
            fireEvent.input(emailInput, { target: { value: email } });

            await waitFor(() => {
                expect(emailInput.value).toBe(email);
            });
        }
    });

    it("deve mostrar erro quando o email já estiver cadastrado", async () => {
        // Simula erro do backend para email duplicado
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Leticia Oliveira" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "leticia@email.com" } });

        axios.post.mockRejectedValueOnce({
            response: { data: { email: ["Este email já está cadastrado"] } },
        });

        fireEvent.submit(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Este email já está cadastrado/i)).toBeTruthy();
        });
    });

    it("deve mostrar erro quando o nome tiver formato inválido", async () => {
        // Valida nome completo e sem caracteres inválidos
        fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Leticia" } });
        fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "leticia@email.com" } });
        fireEvent.submit(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/Digite nome completo \(nome e sobrenome\), sem números ou símbolos, sem espaços no início\/fim/i)).toBeTruthy();
        });
    });

    it("Não deve permitir adicionar mais que 40 caracteres no campo nome", async () => {
        // Limita o tamanho máximo do nome a 40 caracteres
        const nomeInput = screen.getByLabelText(/Nome/i);
        const nomeExcedido = "Leticia Oliveira dos Santos, um nome bem longo";

        fireEvent.input(nomeInput, { target: { value: nomeExcedido } });

        await waitFor(() => {
            expect(nomeInput.value.length).toBe(40);
        });
    });

    it("Não deve permitir adicionar mais que 40 caracteres no campo email", async () => {
        // Limita o tamanho máximo do email a 40 caracteres
        const emailInput = screen.getByLabelText(/E-mail/i);
        const emailExcedido = "emailmuitoextensocompletoqueexcede40caract@email.com";

        fireEvent.input(emailInput, { target: { value: emailExcedido } });

        await waitFor(() => {
            expect(emailInput.value.length).toBe(40);
        });
    });

    it("adiciona classe de erro (borda vermelha) nos campos inválidos", async () => {
        // Verifica se campos inválidos ganham classe CSS de erro visual
        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(nomeInput.classList.contains("erro-input")).toBe(true);
            expect(emailInput.classList.contains("erro-input")).toBe(true);
        });
    });

    it("adiciona classe de erro no nome quando inválido e não no email", async () => {
        // Valida que só o campo nome inválido recebe a classe de erro
        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.input(emailInput, {target: {value: "email@email.com"} });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(nomeInput.classList.contains("erro-input")).toBe(true);
            expect(emailInput.classList.contains("erro-input")).toBe(false);
        });
    });

    it("adiciona classe de erro no email quando inválido e não no nome", async () => {
        // Valida que só o campo email inválido recebe a classe de erro
        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);

        fireEvent.input(nomeInput, {target: {value: "leticia oliveira"} });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(nomeInput.classList.contains("erro-input")).toBe(false);
            expect(emailInput.classList.contains("erro-input")).toBe(true);
        });
    });

});