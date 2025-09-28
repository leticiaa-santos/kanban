import { Tarefa } from './Tarefa';
import { useDroppable } from '@dnd-kit/core';

export function Coluna({ id, titulo, tarefas = [] }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <section
            className={`coluna ${tarefas.length === 0 ? 'vazia' : ''}`}
            ref={setNodeRef}
            role="region"
            aria-labelledby={`coluna-${id}-titulo`}
        >
            <h2 id={`coluna-${id}-titulo`} className="titulo">
                {titulo}
            </h2>

            <ul>
                {tarefas.map(tarefa => (
                    <Tarefa key={tarefa.id} tarefa={tarefa} />
                ))}
            </ul>
        </section>
    );
}
