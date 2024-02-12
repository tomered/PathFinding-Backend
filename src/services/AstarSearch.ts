import { error } from "console";
import { Tiles } from "../constants/tiles";
import { Position } from "../types/position";
import {
  findElementPosition,
  getAdjacent,
  getVisitedList,
  getWeight,
} from "./utils";
import { TilesWithWeight } from "../types/tilesWithWeight";

/**
 * The function finds the starting and ending position, and gives every tile a weight based on the distance of the tile to the ending position,
 * than we use the getAdjacent function to find all the adjacent of a tile, than we check which of the adjacent has the smallest weight and choose him
 * until we get the ending tile
 * @param {Tiles[][]} graph matrix composed of tiles
 * @returns { path: Position[]; visitedList: Position[][]; time: number }  the short path from starting position to the end position, the tiles we visited, the amount of time the function runs
 */
export const AStarSearch = (
  graph: Tiles[][]
): { path: Position[]; visitedList: Position[][]; time: number } => {
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
  let i: number;
  let startingPosition: Position | undefined;
  let endingTile: Position | undefined = undefined;
  let path: Position[] = [];
  let minPositionIndex: number = -1;

  // Find starting position end ending position if exists, there is only supposed to be one starting and ending position
  startingPosition = findElementPosition(graph, Tiles.STARTING_TILE);
  endingTile = findElementPosition(graph, Tiles.ENDING_TILE);
  // Add startingPosition to the queue
  queue.push(startingPosition);

  visited[startingPosition.i][startingPosition.j] = true;
  distance[startingPosition.i][startingPosition.j] = 0;
  if (!endingTile) {
    throw new Error("there is no ending tile");
  }

  const graphWithWeight: TilesWithWeight[][] = getWeight(graph, endingTile);

  while (queue.length > 0) {
    // Pop the minimal weight position in the queue
    const minPosition: Position = getMinimalAdjacent(graphWithWeight, queue);
    for (i = 0; i < queue.length; i++) {
      if (queue[i] === minPosition) {
        minPositionIndex = i;
        break;
      }
    }

    const currentTile = queue.splice(minPositionIndex, 1)[0];
    if (minPosition.i == endingTile.i && minPosition.j == endingTile.j) {
      break;
    }

    if (!minPosition) {
      throw new Error("minPosition is undefined");
    }

    // Add currentTile's adjacent if they are valid
    const adjacentTiles = getAdjacent(graph, currentTile, visited);
    for (let tile of adjacentTiles) {
      visited[tile.i][tile.j] = true;
      queue.push(tile);
      fathers[tile.i][tile.j] = minPosition;
      distance[tile.i][tile.j] = distance[minPosition.i][minPosition.j] + 1;
    }
  }
  visitedList = getVisitedList(distance);

  // if there is no path to the ending tile
  if (!endingTile) {
    const end = performance.now();
    const time = end - start;
    return { path: [], visitedList: visitedList.reverse(), time };
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
  const end = performance.now();
  const time = end - start;
  return { path, visitedList, time };
};

/**
 * The function gets a graph with weights and adjacent and checks who has the minimal weight from them
 * @param graph matrix composed of tiles and weights
 * @param adjacent of the current tile
 * @returns the position of the minimal weight
 */
function getMinimalAdjacent(
  graph: TilesWithWeight[][],
  adjacent: Position[]
): Position {
  const weights: number[] = adjacent.map((tile: Position) => {
    const weight = graph[tile.i][tile.j].weight;
    return weight;
  });

  const minWeight = Math.min(...weights);

  const minAdjIndex = weights.indexOf(minWeight);

  return adjacent[minAdjIndex];
}
