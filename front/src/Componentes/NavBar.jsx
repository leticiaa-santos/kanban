import { Link } from "react-router-dom";

export function NavBar () {
    return(

        // container que comporta todos os elementos da navBar com a devida semântica para a acessibilidade
        <nav className="barra" role="navigation" aria-label="Menu Principal">
            <ul>
                <li>
                    <Link to = '/cadUsuario'>
                        Cadastro de Usuário
                    </Link>
                </li>
                <li>
                    <Link to = '/cadTarefa'>
                        Cadastro de Tarefas 
                    </Link>
                </li>
                <li>
                    <Link to = '/'>
                        Gerenciamento de Tarefas
                    </Link>
                </li>
            </ul>
        </nav>
    );
}