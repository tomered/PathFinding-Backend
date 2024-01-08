import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { Tiles } from "./constants/tiles";
import { basicPathFinding } from "./services/basicPathFinding";
import { error } from "console";

const http = require("http");
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(bodyParser.json({ limit: "50mb" }));

const serverOptions: any = {};

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/basic-path-finding", (req: Request, res: Response) => {
  console.log("hello");
  const graph: Tiles[][] = req.body.graph;
  try {
    const path = basicPathFinding(graph);
    res.send({ path }).status(200);
  } catch (err: any) {
    console.log(err);
    res.send({ err: err.message }).status(400);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
