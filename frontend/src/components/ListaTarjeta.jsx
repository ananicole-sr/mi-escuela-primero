import { useEffect, useState } from "react";
import { getEscuelas } from "../services/api";
import Tarjeta from "./Tarjeta";
import Buscador from "./Buscador";

export default function ListaTarjeta(){
    const [escuelas , setEscuelas] = useState([])
        useEffect(() => {
        async function load() {
            try {
                const res = await getEscuelas();
                setEscuelas(res.data);
            } catch (err) {
                console.log(err);
            }
            }
            load();
        }, []);

        console.log("ListaTarjeta escuelas:", escuelas);
        
    return (
        <div>
            <Buscador escuelas={escuelas}/>
        </div>
    );
}