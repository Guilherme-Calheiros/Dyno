import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/index.js";

const app = express();

app.use(cors());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Olá do server!" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});