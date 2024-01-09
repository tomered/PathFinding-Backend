import { Tiles } from "../constants/tiles";
import { Position } from "../types/position";

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
  const tileVisited = visited
    ? visited?.[position.i]?.[position.j] === true
    : false;

  // Check if the position is not block tile
  const tileBlocked = graph[position.i][position.j] === Tiles.BLOCK_TILE;

  if (tileBlocked || tileVisited) {
    return false;
  } else {
    return true;
  }
}
