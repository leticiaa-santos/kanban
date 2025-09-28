import { NavBar } from "../Componentes/NavBar";
import { Cabecalho } from "../Componentes/Cabecalho";
import { Outlet } from "react-router-dom";

export function Inicial() {
    return (
        <div className="app">
            {/* Cabeçalho principal */}
            <Cabecalho />

            {/* Navegação principal */}
            <NavBar />

            {/* Conteúdo principal */}
            <main id="conteudo-principal">
                <Outlet />
            </main>
        </div>
    );
}
