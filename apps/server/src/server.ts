import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use((req, _res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.all("/expo-authorization-proxy", toNodeHandler(auth));

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Better Auth baseURL: ${process.env.BETTER_AUTH_URL}`);
    console.log(`Web login: http://localhost:${PORT}`);
});
