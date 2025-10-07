import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';
import { CadTarefa } from '../Paginas/CadTarefa';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

vi.mock('axios');

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Evita alert real
vi.spyOn(window, 'alert').mockImplementation(() => {});

describe("Cadastro de Tarefas", () => {

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [{ id: 1, nome: "Letícia" }] });

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

  it("deve resetar os campos após submissão bem-sucedida", async () => {
    // Preenche os campos
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Fazer relatório semanal' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'Administração' } });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: 'alta' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });

    axios.post.mockResolvedValueOnce({ data: {} });

    // Clica no botão de envio
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    // Espera o envio da requisição
    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // Verifica o reset dos campos ANTES da navegação
    await waitFor(() => {
      expect(screen.getByLabelText(/Descrição/i).value).toBe("");
      expect(screen.getByLabelText(/Nome do Setor/i).value).toBe("");
      expect(screen.getByLabelText(/Prioridade/i).value).toBe("");
      expect(screen.getByLabelText(/Usuário/i).value).toBe("");
    });

    // Agora sim verifica a navegação
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
  });
});
