import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/index.js";
import storageRoutes from "./routes/storage.js";
import profileRouter from "./routes/profile.js";

const app = express();

app.use(cors());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/storage", storageRoutes);

app.use("/api/profile", profileRouter);

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Olá do server!" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});