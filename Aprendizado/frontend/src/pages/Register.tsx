import { useState } from "react";
import { registerUser } from "../services/api";

export function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    const res = await registerUser({ nome, email, password });
    console.log(res);
  }

  return (
    <div>
      <h2>Cadastro</h2>

      <input onChange={e => setNome(e.target.value)} placeholder="Nome" />
      <input onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input onChange={e => setPassword(e.target.value)} placeholder="Senha" type="password" />

      <button onClick={handleRegister}>Cadastrar</button>
    </div>
  );
}