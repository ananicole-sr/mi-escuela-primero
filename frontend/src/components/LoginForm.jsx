import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function LoginForm() {

  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {

      const res = await login({
        usuario,
        contraseña
      });

      localStorage.setItem("token", res.data.token);

      alert("Login exitoso");

      navigate("/escuelas");

    } catch (error) {
      alert("Credenciales incorrectas");
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
      />

      <button type="submit">
        Iniciar sesión
      </button>

    </form>
  );
}