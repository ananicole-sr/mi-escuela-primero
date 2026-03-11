import { useState } from "react";
import Tarjeta from "./Tarjeta";

export default function Buscador({escuelas}){
    const [searchInp, setSearchInp] = useState("");
    const [levelInp, setLevInp] = useState("");
    const [categInp, setCatInp] = useState("");
    const [munInp, setMunInp] = useState("");


    function handleChange(event) {
        const { name, value } = event.target;

        if (name === 'search') setSearchInp(value.toLowerCase());
        if (name === 'level') setLevInp(value.toLowerCase());
        if (name === 'categoria') setCategInp(value.toLowerCase());
        if (name === 'municipio') setMunInp(value.toLowerCase());

    };

    const filteredSchools = escuelas.filter((school) => {
        const schoolName = school.nombre?.toLowerCase() || "";
        const schoolLevel = school.nivelEducativo?.toLowerCase() || "";
        //const schoolCateg = school.cate.toLowerCase() || "";
        const schoolMun = school.municipio?.toLowerCase() || "";


        const mathchesName = schoolName.includes(searchInp);
        const mathchesLevel = !levelInp || schoolLevel === levelInp;
        const matchesCateg = !categInp || schoolCateg === categInp;
        const matchesMun = !munInp || schoolMun === munInp;

        return mathchesName && mathchesLevel && matchesCateg && matchesMun;

    });

    console.log("Buscador escuelas:", escuelas);

    return (
    <>
        <form action="" id="filter">
            <input type="text" name="search" placeholder="Search for a School " value={searchInp} onChange={handleChange}/>

            <select name="level" id="lvel" value={levelInp} onChange={handleChange}>
                <option value=""> Todas las Escolaridades </option>
                <option value="preescolar"> Preescolar </option>
                <option value="primaria"> Primaria </option>
                <option value="secundaria"> Secundaria </option>
                <option value="media superior"> Media Superior </option>
                <option value="superior"> Superior </option>
                <option value="especial"> Especial </option>
            </select>

            <select name="categoria" id="categoria" value={categInp} onChange={handleChange}>
                <option value=""> Todas las Categorias </option>
                <option value="mobiliario"> Mobiliario </option>
                <option value="infraestructura"> Infraestructura </option>
                <option value="psicologia"> Psicologia </option>
            </select>

            <select name="municipio" id="municipio" value={munInp} onChange={handleChange}>
                <option value=""> Todas las Municipios </option>
                <option value="guadalajara"> Guadalajara </option>
                <option value="zapopan"> Zapopan </option>
                <option value="tlaquepaque"> Tlaquepaque </option>
                <option value="puerto vallarta"> Puerto Vallarta </option>
                <option value="el salto">  El Salto </option>
                <option value="tequila">  Tequila </option>
                <option value="san juanito de escobedo">  San Juanito de Escobedo </option>
            </select>
        </form>

        <div>
        {filteredSchools.length > 0 ? (
            filteredSchools.map((escuela) => (
                <Tarjeta key={escuela.id_escuela} escuela={escuela} />
            ))
        ) : (
            <h3>No Schools Found</h3>
        )}
         </div>
    </>
    )
}