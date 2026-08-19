import express from "express"
import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Olá do server!" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});