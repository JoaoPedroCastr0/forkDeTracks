import { db } from "../database/connection";

export async function createTask(
  title: string,
  description: string | null,
  userId: number
) {
  const [result] = await db.query(
    "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)",
    [title, description, userId]
  );

  return result;
}

export async function getTasksByUser(userId: number) {
  const [rows] = await db.query(
    "SELECT * FROM tasks WHERE user_id = ?",
    [userId]
  );

  return rows;
}

export async function deleteTask(id: number) {
  await db.query("DELETE FROM tasks WHERE id = ?", [id]);
}

export async function updateTask(id: number, title: string) {
  await db.query(
    "UPDATE tasks SET title = ? WHERE id = ?",
    [title, id]
  );
}