import { db } from "../database/connection";
import type { User } from "../models/User";


export async function createUser(nome: string, email: string, password: string) {
  const [result] = await db.query(
    "INSERT INTO users (nome, email, password) VALUES (?, ?, ?)",
    [nome, email, password]
  );

  return result;
}

export async function findUserByEmail(email: string): Promise<User[]> {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows as User[];
}