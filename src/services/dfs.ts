import { Tiles } from "../constants/tiles";
import { Position } from "../types/position";
import {
  createImage,
  findElementPosition,
  getAdjacent,
  getVisitedList,
} from "./utils";

/**
 * The function finds the starting position and than push it into a stack, loop over the stack and pop the last element, than push all of its adjacent to the stack,
 * until we find the ending position.
 * @param graph matrix composed of tiles
 * @returns { path: Position[]; visitedList: Position[][]; time: number }  the short path from starting position to the end position, the tiles we visited, the amount of time the function runs
 */

export const DFS = async (
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
  let stack: Position[] = [];
  let startingPosition: Position | undefined;
  let endingTile: Position | undefined = undefined;
  let path: Position[] = [];
  let endingTileIsFound: boolean = false;

  // Find starting position if exists, there is only supposed to be one starting position
  startingPosition = findElementPosition(graph, Tiles.STARTING_TILE);
  // Add startingPosition to the stack
  stack.push(startingPosition);

  visited[startingPosition.i][startingPosition.j] = true;
  distance[startingPosition.i][startingPosition.j] = 0;

  while (stack.length > 0) {
    const currentTile = stack.pop();

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
    for (let tile of adjacentTiles) {
      visited[tile.i][tile.j] = true;
      const currentSearchedAdjTile = graph[tile.i][tile.j];
      if (currentSearchedAdjTile == Tiles.ENDING_TILE) {
        endingTile = tile;
        endingTileIsFound = true;
        break;
      }
    }

    Array.prototype.push.apply(stack, adjacentTiles);

    // Put in the fathers array
    for (const adj of adjacentTiles) {
      fathers[adj.i][adj.j] = currentTile;
      distance[adj.i][adj.j] = distance[currentTile.i][currentTile.j] + 1;
    }
    if (endingTileIsFound === true) {
      break;
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
  console.log(time);
  return { path, visitedList, time, imageString };
};
