import { Link } from "react-router-dom";

export function NavBar () {
    return(
        <nav className="barra">
            <ul>
                <Link to = '/cadUsuario'>
                    <li>Cadastro de Usuário</li>
                </Link>

                <Link to = '/cadTarefa'>
                    <li>Cadastro de Tarefas</li>
                </Link>
                
                <Link to = '/'>
                    <li>Gerenciamento de Tarefas</li>
                </Link>
                
            </ul>
        </nav>
    );
}