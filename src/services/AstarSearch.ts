import { error } from "console";
import { Tiles } from "../constants/tiles";
import { Position } from "../types/position";
import { getAdjacent, getWeight } from "./utils";
import { TilesWithWeight } from "../types/tilesWithWeight";

/**
 * The function finds the starting point and add it to a queue, afterwards we pop the first element from the queue and use getAdjacent function
 * to check if the neighbors are valid, this function returns an array of valid neighbors.
 * we add the neighbors to the queue and put in the fathers matrix in the position of the neighbors, the position of the element Through which we found them.
 * we do that until we found the end position, than we go through the fathers matrix from the end position until we found the first position and we add each tile in the way to the path.
 * @param {Tiles[][]} graph matrix composed of tiles
 * @returns {Position[]} the short path from starting position to the end position
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
  let j: number;
  let startingPosition: Position | undefined;
  let endingTile: Position | undefined = undefined;
  let path: Position[] = [];
  let minPositionIndex: number = -1;

  // Find starting position if exists, there is only supposed to be one starting position
  for (i = 0; i < length; i++) {
    for (j = 0; j < width; j++) {
      if (graph[i][j] === Tiles.STARTING_TILE && startingPosition) {
        throw new Error("more than one starting position exists");
      }
      if (graph[i][j] === Tiles.STARTING_TILE) {
        startingPosition = { i, j };
      }
      if (graph[i][j] === Tiles.ENDING_TILE && endingTile) {
        throw new Error("more than one starting position exists");
      }
      if (graph[i][j] === Tiles.ENDING_TILE) {
        endingTile = { i, j };
      }
    }
  }
  if (!startingPosition) {
    throw new Error("There is not starting position");
  }
  // Add startingPosition to the queue
  queue.push(startingPosition);

  visited[startingPosition.i][startingPosition.j] = true;
  distance[startingPosition.i][startingPosition.j] = 0;
  if (!endingTile) {
    throw new Error("there is no ending tile");
  }

  const graphWithWeight: TilesWithWeight[][] = getWeight(graph, endingTile);

  while (queue.length > 0) {
    // Pop the first element from the queue
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
      throw new Error("currentTile is undefined");
    }
    // Check if we found the endingTile
    // const searchedTile = graph[currentTile.i][currentTile.j];
    // if (searchedTile == Tiles.ENDING_TILE) {
    //   endingTile = currentTile;
    //   break;
    // }

    // Add currentTile's adjacent if they are valid
    const adjacentTiles = getAdjacent(graph, currentTile, visited);
    for (let tile of adjacentTiles) {
      visited[tile.i][tile.j] = true;
      queue.push(tile);
      fathers[tile.i][tile.j] = minPosition;
      distance[tile.i][tile.j] = distance[minPosition.i][minPosition.j] + 1;
    }
    // Array.prototype.push.apply(queue, adjacentTiles);

    // Put in the fathers array
  }
  const flatArray = distance.reduce((acc, innerArray) => [
    ...acc,
    ...innerArray,
  ]);
  let maxDistance = Math.max(...flatArray);
  for (let i = 0; i <= maxDistance; i++) {
    visitedList.push([]);
  }
  for (let i = 0; i < distance.length; i++) {
    for (j = 0; j < distance[0].length; j++) {
      let dist = distance[i][j];
      if (dist > -1) {
        visitedList[dist].push({ i, j });
      }
    }
  }
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
  console.log(time);
  return { path, visitedList, time };
};

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
