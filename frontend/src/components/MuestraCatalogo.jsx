import { redirect, useNavigate } from "react-router-dom";
import location from "../assets/location_icon.png"
import ListaTarjeta from "./ListaTarjeta.jsx"


export default function MuestraCatalogo(){
    const navigate = useNavigate();

    return(
        <div id="catalogSample">
            <div className="introduction">
                <img src={location} alt="location.png"></img>
                <h5>Impacto local</h5>
                <h2>Escuelas que Necesitan Tu Apoyo</h2>
                <p>Estas son algunas de las escuelas que actualmente necesitan apoyo. Cada una tiene necesidades específicas y verificadas.</p>
            </div>
            <div className="cardSample">
                {/* <Buscador/> */}
                <ListaTarjeta mostrarBuscador={false} limite={3}/>
                {/* <Tarjeta/> */}
                <button onClick={()=>navigate('/escuelas')}>Ver Todas Las Escuelas</button>
            </div>

        </div>
    )
}