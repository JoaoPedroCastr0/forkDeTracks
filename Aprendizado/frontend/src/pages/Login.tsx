import { useState } from "react";
import { loginUser } from "../services/api";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await loginUser({ email, password });

    console.log(res);

    if (res.token) {
      localStorage.setItem("token", res.token);
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <input onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input onChange={e => setPassword(e.target.value)} placeholder="Senha" type="password" />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}