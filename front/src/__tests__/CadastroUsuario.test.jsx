import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { describe, expect } from 'vitest';
import { CadUsuario } from '../Paginas/CadUsuario';

//render: renderiza a minha tela
//screen: eu vejo os elementos que estão sendo exibidos
//fireEvent: simula o que o usuário pode fazer em tela
//waitFor: espera o resultado do evento

describe("Cadastro de Usuário", () => {

    it("A tela é exibida", () => {
        render(<CadUsuario/>);

        const nomeInput = screen.getByLabelText(/Nome/i);
        const emailInput = screen.getAllByLabelText(/E-mail/i);
        const botao = screen.getByRole("button", {name: /Cadastrar/i });

        expect(nomeInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(botao).toBeTruthy();
    });
})