import { Tarefa } from './Tarefa';
import { useDroppable } from '@dnd-kit/core';

export function Coluna({ id, titulo, tarefas = [] }) {

    // Hook que torna este componente um alvo de drop.
    // `setNodeRef` deve ser usado como ref no elemento HTML que aceitará drops.
    const { setNodeRef } = useDroppable({ id });

    return (

        // Container da coluna, com classe condicional se estiver vazia
        <section
            className={`coluna ${tarefas.length === 0 ? 'vazia' : ''}`}
            ref={setNodeRef}                  // Referência para habilitar drop
            role="region"                    // Define a região para acessibilidade
            aria-labelledby={`coluna-${id}-titulo`} // Associação do título para acessibilidade
        >
            <h2 id={`coluna-${id}-titulo`} className="titulo">
                {titulo}
            </h2>

            <ul>
                {/* .map para buscar as tarefas e exibi-las */}
                {tarefas.map(tarefa => (
                    <Tarefa key={tarefa.id} tarefa={tarefa} />
                ))}
            </ul>
        </section>
    );
}
