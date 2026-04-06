import { db } from "../database/connection";
import type { Task } from "../models/Task";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export async function createTask(
  title: string,
  description: string | null,
  userId: number
): Promise<ResultSetHeader> {
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)",
    [title, description, userId]
  );

  return result;
}

export async function getTasksByUser(userId: number): Promise<Task[]> {
  const [rows] = await db.query<(Task & RowDataPacket)[]>(
    "SELECT * FROM tasks WHERE user_id = ?",
    [userId]
  );

  return rows;
}

export async function deleteTask(id: number): Promise<ResultSetHeader> {
  const [result] = await db.query<ResultSetHeader>(
    "DELETE FROM tasks WHERE id = ?", 
    [id]
  );

  return result;
}

export async function updateTask(
  id: number,
  title: string
): Promise<ResultSetHeader> {
  const [result] = await db.query<ResultSetHeader>(
    "UPDATE tasks SET title = ? WHERE id = ?",
    [title, id]
  );

  return result;
}