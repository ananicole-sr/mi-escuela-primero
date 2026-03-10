import { useEffect, useState } from "react";
import { getEscuelas } from "../services/api";

function Tarjeta() {
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
   return (
        <div>
            {escuelas.map((escuela) => (
                <div key={escuela.id_escuela} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h1>{escuela.nombre}</h1>
                    <p>{escuela.municipio} - {escuela.nivelEducativo}</p>
                </div>
            ))}
        </div>
    );

}

export default Tarjeta;