import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/api";

export default function LoginForm() {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault()
        try {
            const res = await login({usuario: usuario, contraseña: contraseña });
            console.log(res.data)
            navigate("/escuelas"); 

        } catch {
            alert("The credentials are incorrect ")
        }
    }
    
return (
        <form onSubmit={handleSubmit}> 
            <label htmlFor="user"> Usuario </label>
            <input 
                id="user"
                name="user" 
                type="text" 
                value={usuario} 
                onChange={(e) => setUsuario(e.target.value)}
            />

            <label htmlFor="contra"> Contraseña </label>
            <input 
                id="contra"
                name="contra" 
                type="password" 
                value={contraseña} 
                onChange={(e) => setContraseña(e.target.value)}
            />

            <button type="submit"> Login </button>
        </form>
    );
}