import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

type Task = {
  id: number;
  title: string;
};

const tasks: Task[] = [];

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/tasks", (req, res) => {
  const title = String(req.body?.title || "").trim();

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const task: Task = {
    id: tasks.length + 1,
    title
  };

  tasks.push(task);

  return res.status(201).json(task);
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${3000}`);
});

