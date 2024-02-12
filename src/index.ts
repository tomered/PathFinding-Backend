import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { Tiles } from "./constants/tiles";
import { basicPathFinding } from "./services/basicPathFinding";
import { error } from "console";
import { PathFinding, connectDB } from "./services/db";
import { DFS } from "./services/dfs";
import { bidirectionalSearch } from "./services/bidirectionalSearch";
import { AStarSearch } from "./services/AstarSearch";
import { algorithmsMap } from "./constants/algorithmsMap";
import { Position } from "./types/position";
import { Algorithms } from "./types/Algorithms";

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
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/solve-graph/get-all", async (req: Request, res: Response) => {
  const pathFindings = await PathFinding.find({}).lean();
  return res.send({ pathFindings });
});

app.post("/solve-graph", async (req: Request, res: Response) => {
  const graph: Tiles[][] = req.body.graph;
  const algorithm: Algorithms = req.body.algorithm;
  console.log("enter the basic-path-finding endpoint");
  try {
    const algorithmExists = Object.keys(algorithmsMap).includes(algorithm);
    if (!algorithmExists) {
      return res.status(400).send("algorithm does not exist");
    }

    const { path, visitedList, time } = algorithmsMap[algorithm]?.(graph);
    const searchedTiles = visitedList.length;
    const pathSize = path.length;
    const pathFinding = new PathFinding({
      graph,
      path,
      visitedList,
      time,
      searchedTiles,
      pathSize,
      algorithm,
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
