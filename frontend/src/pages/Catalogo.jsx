import Tarjeta from "../components/Tarjeta";
import ListaTarjeta from "../components/ListaTarjeta";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Buscador from "../components/Buscador";
import { useNavigate } from "react-router-dom";

export default function Catalogo() {
    const navigate = useNavigate();

    function manejarClick() {
        navigate("/");
    }

    return (
        <>
            <NavBar/>
            <h1> Catalogo de Escuelas </h1>
            {/* <button onClick={manejarClick}> Inicio </button> */}
            <h2> Explora las necesidades de las escuelas y encuentre la causa que mas resuene contigo </h2>
            <ListaTarjeta/>
            <Footer/>
        </>
    )
}