import { error } from "console";
import { Tiles } from "../constants/tiles";
import { Position } from "../types/position";
import { getAdjacent } from "./utils";

/**
 * The function finds the starting point and add it to a queue, afterwards we pop the first element from the queue and use getAdjacent function
 * to check if the neighbors are valid, this function returns an array of valid neighbors.
 * we add the neighbors to the queue and put in the fathers matrix in the position of the neighbors, the position of the element Through which we found them.
 * we do that until we found the end position, than we go through the fathers matrix from the end position until we found the first position and we add each tile in the way to the path.
 * @param {Tiles[][]} graph matrix composed of tiles
 * @returns {Position[]} the short path from starting position to the end position
 */
export const basicPathFinding = (graph: Tiles[][]): Position[] => {
  // We use visited to check if we already visited the tile in a given position
  let visited: boolean[][] = Array.from({ length: graph.length }, () =>
    Array.from({ length: graph.length }, () => false)
  );
  //  Initialize every tile with the tile position of the element who brings us to this tile
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

  // Find starting position if exists, there is only supposed to be one starting position
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
    // Pop the first element from the queue
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
    // Iterate over fathers matrix from the end position until we find starting position, and add the current tile in fathers array to the path
    currentPathTile = fathers[currentPathTile.i][currentPathTile.j] as Position;
    path.push({ i: currentPathTile.i, j: currentPathTile.j });
  }

  path.reverse();
  return path;
};
