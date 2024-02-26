import { error } from "console";
import { Tiles } from "../constants/tiles";
import { Position } from "../types/position";
import {
  createImage,
  findElementPosition,
  getAdjacent,
  getVisitedList,
} from "./utils";

/**
 * The function finds the starting point and add it to a queue, afterwards we pop the first element from the queue and use getAdjacent function
 * to check if the neighbors are valid, this function returns an array of valid neighbors.
 * we add the neighbors to the queue and put in the fathers matrix in the position of the neighbors, the position of the element Through which we found them.
 * we do that until we found the end position, than we go through the fathers matrix from the end position until we found the first position and we add each tile in the way to the path.
 * @param {Tiles[][]} graph matrix composed of tiles
 * @returns {Position[]} the short path from starting position to the end position
 */
export const basicPathFinding = async(
  graph: Tiles[][]
): Promise<{
  path: Position[];
  visitedList: Position[][];
  time: number;
  imageString: string;
}> => {
  const start = performance.now();
  const length = graph.length;
  const width = graph[0].length;

  let visitedList: Position[][] = [];
  let distance: number[][] = Array.from({ length }, () =>
    Array.from({ length: width }, () => -1)
  );

  // We use visited to check if we already visited the tile in a given position
  let visited: boolean[][] = Array.from({ length }, () =>
    Array.from({ length: width }, () => false)
  );
  //  Initialize every tile with the tile position of the element who brings us to this tile
  let fathers: Array<Array<Position | undefined>> = Array.from({ length }, () =>
    Array.from({ length: width }, () => undefined)
  );
  let queue: Position[] = [];
  let startingPosition: Position | undefined;
  let endingTile: Position | undefined = undefined;
  let path: Position[] = [];

  // Find starting position if exists, there is only supposed to be one starting position
  startingPosition = findElementPosition(graph, Tiles.STARTING_TILE);
  // Add startingPosition to the queue
  queue.push(startingPosition);

  visited[startingPosition.i][startingPosition.j] = true;
  distance[startingPosition.i][startingPosition.j] = 0;

  while (queue.length > 0) {
    // Pop the first element from the queue
    const currentTile = queue.splice(0, 1)[0];

    if (!currentTile) {
      throw new Error("currentTile is undefined");
    }
    // Check if we found the endingTile
    const searchedTile = graph[currentTile.i][currentTile.j];
    if (searchedTile == Tiles.ENDING_TILE) {
      endingTile = currentTile;
      break;
    }

    // Add currentTile's adjacent if they are valid
    const adjacentTiles = getAdjacent(graph, currentTile, visited);

    Array.prototype.push.apply(queue, adjacentTiles);

    // Put in the fathers array
    for (const adj of adjacentTiles) {
      visited[adj.i][adj.j] = true;
      fathers[adj.i][adj.j] = currentTile;
      distance[adj.i][adj.j] = distance[currentTile.i][currentTile.j] + 1;
    }
  }
  visitedList = getVisitedList(distance);
  if (!endingTile) {
    const imageString = await createImage(graph, visitedList, path);
    const end = performance.now();
    const time = end - start;
    return { path: [], visitedList: visitedList.reverse(), time, imageString };
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
  visitedList.reverse();
  const imageString = await createImage(graph, visitedList, path);
  const end = performance.now();
  const time = end - start;
  return { path, visitedList, time, imageString };
};
