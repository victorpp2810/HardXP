import express from "express";
import cors from "cors";
import rotas from "./router/rotas.js";

const app = express();

const PORT = 2000;

// app.use(cors());
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", rotas);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});