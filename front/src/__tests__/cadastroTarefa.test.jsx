import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { beforeEach, describe, expect } from 'vitest';
import { CadTarefa } from '../Paginas/CadTarefa';
import axios from 'axios';

describe("Cadastro de Tarefas", () => {
    beforeEach(() => {
        render(<CadTarefa />);
    });

    it("A tela é exibida", () => {
        const descricaoInput = screen.getE
    })
})