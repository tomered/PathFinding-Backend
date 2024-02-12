import { Tiles } from "../constants/tiles";
import { Position } from "../types/position";
import { TilesWithWeight } from "../types/tilesWithWeight";

/**
 * This function check if a neighbor is valid in assist of isTileValid function, if is valid we add it to adjacentPositions array and return it at the end of the function
 * @param {Tiles[][]} graph matrix composed of tiles
 * @param {Position} position the position we want to check for neighbors
 * @param {boolean[][]} visited check if we already visited the tile in a given position
 * @returns
 */
export function getAdjacent(
  graph: Tiles[][],
  position: Position,
  visited?: boolean[][]
) {
  let adjacentPositions: Position[] = [];

  // Check if the position of a neighbor is valid, if so add it to adjacentPositions

  if (isTileValid(graph, { i: position.i - 1, j: position.j }, visited)) {
    adjacentPositions.push({ i: position.i - 1, j: position.j });
  }

  if (isTileValid(graph, { i: position.i, j: position.j - 1 }, visited)) {
    adjacentPositions.push({ i: position.i, j: position.j - 1 });
  }

  if (isTileValid(graph, { i: position.i + 1, j: position.j }, visited)) {
    adjacentPositions.push({ i: position.i + 1, j: position.j });
  }

  if (isTileValid(graph, { i: position.i, j: position.j + 1 }, visited)) {
    adjacentPositions.push({ i: position.i, j: position.j + 1 });
  }

  return adjacentPositions;
}

/**
 * This function checks if the position that were given is in graph boundaries, not visited yet if visited were given and not a block tile and returns if is valid or not
 * @param {Tiles[][]} graph matrix composed of tiles
 * @param {Position} position position we want to check
 * @param {boolean[][]} visited check if we already visited the tile in a given position
 * @returns {boolean} true if valid
 */
function isTileValid(
  graph: Tiles[][],
  position: Position,
  visited?: boolean[][]
) {
  let length = graph.length;
  let width = graph[0].length;

  // Check if the position is in the graph boundaries, if not return false
  const tileOutOfBounds =
    position.i >= length ||
    position.j >= width ||
    position.i < 0 ||
    position.j < 0;
  if (tileOutOfBounds) {
    return false;
  }

  // Check if visited has been transmitted and the current position is not visited yet

  if (visited !== undefined && visited[position.i][position.j] === true) {
    return false;
  }

  // Check if the position is not block tile
  const tileBlocked = graph[position.i][position.j] === Tiles.BLOCK_TILE;

  if (tileBlocked) {
    return false;
  } else {
    return true;
  }
}

/**
 * The function gets a graph and the ending tile, and gives every tile in the graph its weight based on its distance from the ending tile
 * @param graph matrix composed of tiles
 * @param endingTile the ending tile
 * @returns TilesWithWeight matrix composed of tiles and weight
 */
export function getWeight(
  graph: Tiles[][],
  endingTile: Position
): TilesWithWeight[][] {
  let i: number;
  let j: number;
  const length = graph.length;
  const width = graph[0].length;
  const newGraph: Array<Array<TilesWithWeight | undefined>> = Array.from(
    { length },
    () => Array.from({ length: width }, () => undefined)
  );

  for (i = 0; i < length; i++) {
    for (j = 0; j < width; j++) {
      const weight: number =
        (i - endingTile.i) * (i - endingTile.i) +
        (j - endingTile.j) * (j - endingTile.j);
      newGraph[i][j] = { tiles: graph[i][j], weight: weight };
    }
  }

  return newGraph as TilesWithWeight[][];
}

/**
 * The function gets a graph and a tile type to check, we search it in the graph and if we are finding it we return it, if not we throw an error
 * @param graph matrix composed of tiles
 * @param element of type Tiles
 * @returns elementPosition gives the position of an element type
 */
export function findElementPosition(
  graph: Tiles[][],
  element: Tiles
): Position {
  let i: number;
  let j: number;
  const length = graph.length;
  const width = graph[0].length;
  let elementPosition: Position | undefined = undefined;
  for (i = 0; i < length; i++) {
    for (j = 0; j < width; j++) {
      if (graph[i][j] === element && elementPosition) {
        throw new Error("more than one starting position exists");
      }
      if (graph[i][j] === element) {
        elementPosition = { i, j };
      }
    }
  }
  if (!elementPosition) {
    throw new Error("There is not starting position");
  }
  return elementPosition;
}

/**
 * The function flat the matrix to an array and finds the max of the array, than get the visited list length be as same as the max distance,
 * than iterate over the distance matrix and if the number in the node is bigger than -1 push it to the visited list
 * @param distance the distance from starting position
 * @returns visitedList the list of the tiles we've been searched in
 */
export function getVisitedList(distance: number[][]): Position[][] {
  let visitedList: Position[][] = [];
  const flatArray = distance.reduce((acc, innerArray) => [
    ...acc,
    ...innerArray,
  ]);
  let maxDistance = Math.max(...flatArray);
  for (let i = 0; i <= maxDistance; i++) {
    visitedList.push([]);
  }
  for (let i = 0; i < distance.length; i++) {
    for (let j = 0; j < distance[0].length; j++) {
      let dist = distance[i][j];
      if (dist > -1) {
        visitedList[dist].push({ i, j });
      }
    }
  }
  return visitedList;
}
