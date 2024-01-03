import { error } from "console";
import { Tiles } from "../constants/tiles";
import { Position } from "../types/position";
import { getAdjacent } from "./utils";

export const basicPathFinding = (graph: Tiles[][]): Position[] => {
  let visited: boolean[][] = Array.from({ length: graph.length }, () =>
    Array.from({ length: graph.length }, () => false)
  );
  let fathers: Array<Array<Position | undefined>> = Array.from(
    { length: graph.length },
    () => Array.from({ length: graph.length }, () => undefined)
  );
  let queue: Position[] = [];
  let i: number;
  let j: number;
  let startingPosition: Position | undefined;
  let endingTile: Position | undefined = undefined;
  let path: Position[] = [];

  for (i = 0; i < graph.length; i++) {
    for (j = 0; j < graph.length; j++) {
      if (graph[i][j] === Tiles.STARTING_TILE && startingPosition) {
        throw new Error("more than one starting position exists");
      }
      if (graph[i][j] === Tiles.STARTING_TILE) {
        startingPosition = { i, j };
      }
    }
  }
  if (!startingPosition) {
    throw new Error("There is not starting position");
  }
  // Add startingPosition to the queue
  queue.push(startingPosition);

  while (queue.length > 0) {
    const currentTile = queue.splice(0, 1)[0];
    if (!currentTile) {
      throw new Error("currentTile is undefined");
    }
    // Check if we found the endingTile
    const searchedTile = graph[currentTile.i][currentTile.j];
    if (currentTile.i == 4 && currentTile.j == 7) {
      let a;
    }
    if (searchedTile == Tiles.ENDING_TILE) {
      endingTile = currentTile;
      break;
    }
    // Mark currentTile as visited
    visited[currentTile.i][currentTile.j] = true;

    // Add currentTile's adjacent if they are valid
    const adjacentTiles = getAdjacent(graph, currentTile, visited);
    Array.prototype.push.apply(queue, adjacentTiles);

    // Put in the fathers array
    for (const adj of adjacentTiles) {
      fathers[adj.i][adj.j] = currentTile;
    }
  }
  if (!endingTile) {
    throw new Error("path not exists");
  }
  let currentPathTile: Position = endingTile as Position;
  while (
    fathers[currentPathTile.i][currentPathTile.j] != startingPosition &&
    fathers[currentPathTile.i][currentPathTile.j] !== undefined
  ) {
    currentPathTile = fathers[currentPathTile.i][currentPathTile.j] as Position;
    path.push({ i: currentPathTile.i, j: currentPathTile.j });
  }

  path.reverse();
  return path;
};
