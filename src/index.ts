import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { Tiles } from "./constants/tiles";
import { basicPathFinding } from "./services/basicPathFinding";
import { error } from "console";
import { PathFinding, connectDB } from "./services/db";

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

connectDB("mongodb://127.0.0.1:27017/pathFinding")
  .then(() => {
    console.log("connected");
  })
  .catch(() => {});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/basic-path-finding/getAll", async (req: Request, res: Response) => {
  const pathFindings = await PathFinding.find(
    {},
    { algorithm: true, graph: true, path: true, visitedList: true, _id: false }
  );
  res.send({ pathFindings });
});

app.post("/basic-path-finding", async (req: Request, res: Response) => {
  const graph: Tiles[][] = req.body.graph;
  try {
    const { path, visitedList } = basicPathFinding(graph);
    const pathFinding = new PathFinding({
      graph,
      path,
      visitedList,
      algorithm: "basicPathFinding",
    });
    await pathFinding.save();
    res.send({ path, visitedList }).status(200);
  } catch (err: any) {
    console.log(err);
    res.send({ err: err.message }).status(400);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
