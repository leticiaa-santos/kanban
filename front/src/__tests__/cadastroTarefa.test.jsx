import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';
import { CadTarefa } from '../Paginas/CadTarefa';
import axios from 'axios';

vi.mock('axios'); // Mocka chamadas HTTP
vi.spyOn(window, 'alert').mockImplementation(() => {}); // Evita alert real

describe("Cadastro de Tarefas", () => {

  // Executa antes de cada teste
  beforeEach(async () => {
    vi.clearAllMocks(); // Limpa mocks anteriores
    axios.get.mockResolvedValue({ data: [{ id: 1, nome: 'Letícia' }] }); // Mock de usuário
    render(<CadTarefa />); // Renderiza componente
    await waitFor(() => screen.getByText('Letícia')); // Aguarda carregamento do usuário
  });

  // Verifica se todos os elementos da tela estão visíveis
  it("A tela é exibida", () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const prioridadeSelect = screen.getByLabelText(/Prioridade/i);
    const statusInput = screen.getByLabelText(/Status/i);
    const usuarioSelect = screen.getByLabelText(/Usuário/i);
    const botao = screen.getByRole("button", { name: /Cadastrar/i });

    expect(descricaoInput).toBeTruthy();
    expect(setorInput).toBeTruthy();
    expect(prioridadeSelect).toBeTruthy();
    expect(statusInput).toBeTruthy();
    expect(usuarioSelect).toBeTruthy();
    expect(botao).toBeTruthy();
  });

  // Testa reset dos campos após submissão bem-sucedida
  it("deve resetar os campos após submissão bem-sucedida", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const prioridadeSelect = screen.getByLabelText(/Prioridade/i);
    const usuarioSelect = screen.getByLabelText(/Usuário/i);

    fireEvent.change(descricaoInput, { target: { value: "Fazer relatório semanal" } });
    fireEvent.change(setorInput, { target: { value: "Administração" } });
    fireEvent.change(prioridadeSelect, { target: { value: "alta" } });
    fireEvent.change(usuarioSelect, { target: { value: "1" } });

    axios.post.mockResolvedValueOnce({ data: {} }); // Mock do POST
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      // Verifica chamada correta
      expect(axios.post).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/tarefa/",
        expect.objectContaining({
          descricao: "Fazer relatório semanal",
          nomeSetor: "Administração",
          prioridade: "alta",
          idUsuario: 1,
          status: "a fazer"
        })
      );
      // Verifica reset dos campos
      expect(descricaoInput.value).toBe("");
      expect(setorInput.value).toBe("");
      expect(usuarioSelect.value).toBe("");
      expect(screen.getByLabelText(/Prioridade/i).value).toBe("baixa"); // padrão
      expect(screen.getByLabelText(/Status/i).value).toBe("a fazer"); // padrão
    });
  });

  // Testa exibição de mensagem de sucesso ao cadastrar
  it("mostra mensagem de sucesso ao cadastrar", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const prioridadeInput = screen.getByLabelText(/Prioridade/i);
    const usuarioSelect = screen.getByLabelText(/Usuário/i);

    fireEvent.change(descricaoInput, { target: { value: 'Nova tarefa' } });
    fireEvent.change(setorInput, { target: { value: 'Financeiro' } });
    fireEvent.change(prioridadeInput, { target: { value: 'alta' } });
    fireEvent.change(usuarioSelect, { target: { value: '1' } });

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Tarefa cadastrada com sucesso'); // Mensagem de sucesso
    });
  });

  // Testa cadastro de múltiplas tarefas em sequência
  it("permite cadastrar múltiplas tarefas seguidas", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const prioridadeSelect = screen.getByLabelText(/Prioridade/i);
    const usuarioSelect = screen.getByLabelText(/Usuário/i);

    // Primeira tarefa
    fireEvent.change(descricaoInput, { target: { value: 'Tarefa 1' } });
    fireEvent.change(setorInput, { target: { value: 'Financeiro' } });
    fireEvent.change(prioridadeSelect, { target: { value: 'alta' } });
    fireEvent.change(usuarioSelect, { target: { value: '1' } });
    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(descricaoInput.value).toBe(''); // Reset
      expect(setorInput.value).toBe('');
      expect(usuarioSelect.value).toBe('');
    });

    // Segunda tarefa
    fireEvent.change(descricaoInput, { target: { value: 'Tarefa 2' } });
    fireEvent.change(setorInput, { target: { value: 'TI' } });
    fireEvent.change(prioridadeSelect, { target: { value: 'media' } });
    fireEvent.change(usuarioSelect, { target: { value: '1' } });
    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(descricaoInput.value).toBe(''); // Reset novamente
      expect(setorInput.value).toBe('');
      expect(usuarioSelect.value).toBe('');
    });
  });

  // Testa erro de validação individual nos campos
  it("exibe erro apenas na descrição quando os outros campos estão preenchidos", async () => {
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'Financeiro' } });
    fireEvent.change(screen.getByLabelText(/Prioridade/i), { target: { value: 'media' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: 1 } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Descrição/i).classList.contains('erro-input')).toBe(true); // Somente descrição
      expect(screen.getByLabelText(/Nome do Setor/i).classList.contains('erro-input')).toBe(false);
      expect(screen.getByLabelText(/Prioridade/i).classList.contains('erro-input')).toBe(false);
      expect(screen.getByLabelText(/Usuário/i).classList.contains('erro-input')).toBe(false);
    });
  });

  // Testa erro apenas no nome do setor
  it("exibe erro apenas no nome do setor quando os outros campos estão preenchidos", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Revisar relatórios' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Nome do Setor/i).classList.contains('erro-input')).toBe(true);
    });
  });

  // Testa erro apenas no usuário
  it("exibe erro apenas no usuário quando os outros campos estão preenchidos", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Atualizar site' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'TI' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Usuário/i).classList.contains('erro-input')).toBe(true);
    });
  });

  // Não permite números no campo Nome do Setor
  it("não permite números no campo Nome do Setor", async () => {
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    fireEvent.change(setorInput, { target: { value: 'TI123' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Este campo não pode conter números/i)).toBeTruthy();
    });
  });

  // Limite de caracteres da descrição
  it("limita caracteres da descrição entre 5 e 50", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    fireEvent.change(descricaoInput, { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Insira ao menos 5 caracteres/i)).toBeTruthy());

    fireEvent.change(descricaoInput, { target: { value: 'a'.repeat(51) } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Insira até 50 caracteres/i)).toBeTruthy());
  });

  // Limite de caracteres do Nome do Setor
  it("limita caracteres do Nome do Setor entre 1 e 20", async () => {
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    fireEvent.change(setorInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeTruthy());

    fireEvent.change(setorInput, { target: { value: 'a'.repeat(21) } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Insira até 20 caracteres/i)).toBeTruthy());
  });

  // Permite apenas prioridades válidas
  it("deve permitir apenas prioridades válidas", async () => {
    const select = screen.getByLabelText(/Prioridade/i);
    fireEvent.change(select, { target: { value: 'alta' } });
    expect(select.value).toBe('alta');
  });

  // Exibe erro para prioridade inválida
  it("deve mostrar erro para prioridade inválida", async () => {
    const select = screen.getByLabelText(/Prioridade/i);
    fireEvent.change(select, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Prioridade/i).classList.contains('erro-input')).toBe(true);
    });
  });

  // Reseta prioridade e status após submissão
  it("deve resetar prioridade e status após submissão", async () => {
    const prioridadeInput = screen.getByLabelText(/Prioridade/i);
    fireEvent.change(prioridadeInput, { target: { value: 'baixa' } });
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    fireEvent.change(descricaoInput, { target: { value: 'Nova tarefa' } });
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    fireEvent.change(setorInput, { target: { value: 'Financeiro' } });
    const usuarioSelect = screen.getByLabelText(/Usuário/i);
    fireEvent.change(usuarioSelect, { target: { value: '1' } });

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Prioridade/i).value).toBe('baixa'); // valor enviado
      expect(screen.getByLabelText(/Status/i).value).toBe('a fazer'); // valor padrão
    });
  });

  // Testa classe de erro individual nos campos
  it("adiciona classe de erro na descrição quando inválida e não nos outros campos", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Descrição/i).classList.contains('erro-input')).toBe(true);
      expect(screen.getByLabelText(/Nome do Setor/i).classList.contains('erro-input')).toBe(false);
      expect(screen.getByLabelText(/Usuário/i).classList.contains('erro-input')).toBe(false);
    });
  });

  it("adiciona classe de erro no nome do setor quando inválido e não nos outros campos", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Relatório' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Nome do Setor/i).classList.contains('erro-input')).toBe(true);
      expect(screen.getByLabelText(/Descrição/i).classList.contains('erro-input')).toBe(false);
      expect(screen.getByLabelText(/Usuário/i).classList.contains('erro-input')).toBe(false);
    });
  });

  it("adiciona classe de erro no usuário quando inválido e não nos outros campos", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Relatório' } });
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: 'TI' } });
    fireEvent.change(screen.getByLabelText(/Usuário/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Usuário/i).classList.contains('erro-input')).toBe(true);
      expect(screen.getByLabelText(/Descrição/i).classList.contains('erro-input')).toBe(false);
      expect(screen.getByLabelText(/Nome do Setor/i).classList.contains('erro-input')).toBe(false);
    });
  });

  // Erro para descrição vazia
  it("exibe erro para campo descrição vazio específico", async () => {
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Insira ao menos 5 caracteres/i)).toBeTruthy());
  });

  // Erro para nome do setor vazio
  it("exibe erro para campo nome do setor vazio específico", async () => {
    fireEvent.change(screen.getByLabelText(/Nome do Setor/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    await waitFor(() => expect(screen.getByText(/Insira ao menos 1 caractere/i)).toBeTruthy());
  });

  // Mantém prioridade padrão quando não alterada
  it("mantém a prioridade padrão quando não selecionada", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const usuarioSelect = screen.getByLabelText(/Usuário/i);

    fireEvent.change(descricaoInput, { target: { value: 'Tarefa teste' } });
    fireEvent.change(setorInput, { target: { value: 'Financeiro' } });
    fireEvent.change(usuarioSelect, { target: { value: '1' } });

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Prioridade/i).value).toBe('baixa'); // valor padrão
    });
  });

  // Mantém status padrão quando não alterado
  it("mantém o status padrão quando não alterado", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const usuarioSelect = screen.getByLabelText(/Usuário/i);

    fireEvent.change(descricaoInput, { target: { value: 'Tarefa teste' } });
    fireEvent.change(setorInput, { target: { value: 'Financeiro' } });
    fireEvent.change(usuarioSelect, { target: { value: '1' } });

    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Status/i).value).toBe('a fazer'); // valor padrão
    });
  });

  // Adiciona erro em todos os campos obrigatórios quando vazios
  it("adiciona classe de erro em todos os campos obrigatórios quando vazios", async () => {
    const descricaoInput = screen.getByLabelText(/Descrição/i);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    const usuarioSelect = screen.getByLabelText(/Usuário/i);
    const prioridadeSelect = screen.getByLabelText(/Prioridade/i);

    // Campos vazios
    fireEvent.change(descricaoInput, { target: { value: '' } });
    fireEvent.change(setorInput, { target: { value: '' } });
    fireEvent.change(usuarioSelect, { target: { value: '' } });
    fireEvent.change(prioridadeSelect, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(descricaoInput.classList.contains('erro-input')).toBe(true);
      expect(setorInput.classList.contains('erro-input')).toBe(true);
      expect(usuarioSelect.classList.contains('erro-input')).toBe(true);
      expect(prioridadeSelect.classList.contains('erro-input')).toBe(true);
    });
  });

});
