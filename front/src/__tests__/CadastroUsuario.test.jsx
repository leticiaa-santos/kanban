import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { beforeEach, describe, expect } from 'vitest';
import { CadUsuario } from '../Paginas/CadUsuario';

//render: renderiza a minha tela
//screen: eu vejo os elementos que estão sendo exibidos
//fireEvent: simula o que o usuário pode fazer em tela
//waitFor: espera o resultado do evento

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

    it("Erro quando o campo estiver vazio", async () => {

        fireEvent.click(screen.getByRole("button", {name:/Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText("Insira ao menos 1 caractere")).toBeTruthy();
            expect(screen.getByText("Insira seu email")).toBeTruthy();
        });
    });
})