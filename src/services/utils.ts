import { Tiles } from "../constants/tiles";
import { Position } from "../types/position";

export function getAdjacent(
  graph: Tiles[][],
  position: Position,
  visited?: boolean[][]
) {
  let adjacentPositions: Position[] = [];

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

function isTileValid(
  graph: Tiles[][],
  position: Position,
  visited?: boolean[][]
) {
  let length = graph.length;

  const tileOutOfBounds =
    position.i >= length ||
    position.j >= length ||
    position.i < 0 ||
    position.j < 0;
  if (tileOutOfBounds) {
    return false;
  }

  const tileVisited = visited
    ? visited?.[position.i]?.[position.j] === true
    : false;

  const tileBlocked = graph[position.i][position.j] === Tiles.BLOCK_TILE;

  if (tileBlocked || tileVisited) {
    return false;
  } else {
    return true;
  }
}
