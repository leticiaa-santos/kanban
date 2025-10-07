import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';
import { CadTarefa } from '../Paginas/CadTarefa';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom'

vi.mock('axios'); // mocka o axios globalmente


describe("Cadastro de Tarefas", () => {

  beforeEach(() => {
    // Mock da requisição GET de usuários para popular o select
    axios.get.mockResolvedValue({
      data: [{ id: 1, nome: 'Usuário Teste' }]
    });

    render(
      <MemoryRouter>
        <CadTarefa />
      </MemoryRouter>
    );
  });

  it("A tela é exibida", () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const prioridadeInput = screen.getByLabelText(/Prioridade/i);
    const statusInput = screen.getByLabelText(/Status/i);
    const usuarioInput = screen.getByLabelText(/Usuário/i);
    const botao = screen.getByRole("button", { name: /Cadastrar/i });

    expect(descricaoInput).toBeTruthy();
    expect(setorInput).toBeTruthy();
    expect(prioridadeInput).toBeTruthy();
    expect(statusInput).toBeTruthy();
    expect(usuarioInput).toBeTruthy();
    expect(botao).toBeTruthy();
  });


  it("Reseta os campos após submissão com sucesso", async () => {
    // Mock da requisição POST para envio do formulário
    axios.post.mockResolvedValue({ data: {} });

    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const prioridadeInput = screen.getByLabelText(/Prioridade/i);
    const usuarioInput = screen.getByLabelText(/Usuário/i);
    const statusInput = screen.getByLabelText(/Status/i);
    const botao = screen.getByRole("button", { name: /Cadastrar/i });

    // Preenche os campos
    fireEvent.change(descricaoInput, { target: { value: 'Minha tarefa' } });
    fireEvent.change(setorInput, { target: { value: 'TI' } });
    fireEvent.change(prioridadeInput, { target: { value: 'alta' } });
    fireEvent.change(usuarioInput, { target: { value: '1' } });

    // Confirma que os valores foram preenchidos
    expect(descricaoInput).toHaveValue('Minha tarefa');
    expect(setorInput).toHaveValue('TI');
    expect(prioridadeInput).toHaveValue('alta');
    expect(usuarioInput).toHaveValue('1');
    expect(statusInput).toHaveValue('a fazer'); // campo readonly

    // Dispara submit
    fireEvent.click(botao);

    // Espera a ação async e valida o reset dos campos
    await waitFor(() => {
      expect(descricaoInput).toHaveValue('');
      expect(setorInput).toHaveValue('');
      expect(prioridadeInput).toHaveValue('');
      expect(usuarioInput).toHaveValue('');
      expect(statusInput).toHaveValue('a fazer'); // continua fixo
    });
  });
  

});