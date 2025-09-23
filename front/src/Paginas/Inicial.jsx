import { NavBar } from "../Componentes/NavBar";
import { Cabecalho } from "../Componentes/Cabecalho";
import { Outlet } from "react-router-dom";

export function Inicial () {
    return(
        <>
            <Cabecalho/>
            <NavBar/>
            <Outlet/>
        </>
    );
}