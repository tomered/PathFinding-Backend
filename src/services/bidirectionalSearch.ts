import { error } from "console";
import { Tiles } from "../constants/tiles";
import { FathersPosition } from "../types/FathersPosition";
import { Position } from "../types/position";
import { findElementPosition, getAdjacent, getVisitedList } from "./utils";

/**
 * The function finds the start and the end position, both has a queue for the elements we find from start and the elements we find from the end,
 * than we pop them both, checks their adjacent tiles, push Each of them to the queue accordingly, until we find the tile that connects them, the middle tile.
 * than we check the path from the start and the path from the end and combine them so at the end we get the path from the start position to the end position
 * @param graph matrix composed of tiles
 * @returns the short path from starting position to the end position, the tiles we visited, the amount of time the function runs
 */
export const bidirectionalSearch = (
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
  let visitedStart: boolean[][] = Array.from({ length }, () =>
    Array.from({ length: width }, () => false)
  );
  let visitedEnd: boolean[][] = Array.from({ length }, () =>
    Array.from({ length: width }, () => false)
  );
  //  Initialize every tile with the tile position of the element who brings us to this tile
  let fathers: Array<Array<FathersPosition | undefined>> = Array.from(
    { length },
    () => Array.from({ length: width }, () => undefined)
  );
  let startFathers: Array<Array<FathersPosition | undefined>> = Array.from(
    { length },
    () => Array.from({ length: width }, () => undefined)
  );
  let endFathers: Array<Array<FathersPosition | undefined>> = Array.from(
    { length },
    () => Array.from({ length: width }, () => undefined)
  );
  let startQueue: Position[] = [];
  let endQueue: Position[] = [];
  let startingPosition: Position | undefined;
  let endingTile: Position | undefined;
  let path: Position[] = [];
  let startPath: Position[] = [];
  let endPath: Position[] = [];
  let currentStartTile: Position | undefined = undefined;
  let currentEndTile: Position | undefined = undefined;
  let middleTile: Position | undefined = undefined;
  let currentPathFromStartTile: Position | undefined = undefined;
  let currentPathFromEndTile: Position | undefined = undefined;
  let startFromStart: boolean = true;

  // Find starting position if exists, there is only supposed to be one starting position
  startingPosition = findElementPosition(graph, Tiles.STARTING_TILE);
  endingTile = findElementPosition(graph, Tiles.ENDING_TILE);
  // Add startingPosition to the queue
  startQueue.push(startingPosition);
  endQueue.push(endingTile);

  visitedStart[startingPosition.i][startingPosition.j] = true;
  distance[startingPosition.i][startingPosition.j] = 0;

  fathers[startingPosition.i][startingPosition.j] = {
    ...startingPosition,
    startsFrom: "start",
  };
  startFathers[startingPosition.i][startingPosition.j] = {
    ...startingPosition,
    startsFrom: "start",
  };

  visitedEnd[endingTile.i][endingTile.j] = true;
  distance[endingTile.i][endingTile.j] = 0;
  fathers[endingTile.i][endingTile.j] = {
    ...endingTile,
    startsFrom: "end",
  };
  endFathers[endingTile.i][endingTile.j] = {
    ...endingTile,
    startsFrom: "end",
  };
  while (startQueue.length > 0 && endQueue.length > 0) {
    // Pop the first element from the queue
    currentStartTile = startQueue.splice(0, 1)[0];
    currentEndTile = endQueue.splice(0, 1)[0];

    if (!currentEndTile || !currentEndTile) {
      throw new Error("currentTile is undefined");
    }

    // Add currentTile's adjacent if they are valid
    const adjacentStartTiles = getAdjacent(
      graph,
      currentStartTile,
      visitedStart
    );
    const adjacentEndTiles = getAdjacent(graph, currentEndTile, visitedEnd);
    for (let tile of adjacentStartTiles) {
      visitedStart[tile.i][tile.j] = true;
    }
    for (let tile of adjacentEndTiles) {
      visitedEnd[tile.i][tile.j] = true;
    }
    Array.prototype.push.apply(startQueue, adjacentStartTiles);
    Array.prototype.push.apply(endQueue, adjacentEndTiles);

    // Put in the fathers array
    for (const adj of adjacentEndTiles) {
      if (fathers[adj.i][adj.j]?.startsFrom === "start") {
        middleTile = adj;
        break;
      }
      fathers[adj.i][adj.j] = {
        ...currentEndTile,
        startsFrom: fathers[currentEndTile.i][currentEndTile.j]?.startsFrom,
      };
      endFathers[adj.i][adj.j] = {
        ...currentEndTile,
        startsFrom: fathers[currentEndTile.i][currentEndTile.j]?.startsFrom,
      };
      distance[adj.i][adj.j] = distance[currentEndTile.i][currentEndTile.j] + 1;
    }
    for (const adj of adjacentStartTiles) {
      if (fathers[adj.i][adj.j]?.startsFrom === "end") {
        middleTile = adj;
        startFromStart = false;
        break;
      }
      fathers[adj.i][adj.j] = {
        ...currentStartTile,
        startsFrom: fathers[currentStartTile.i][currentStartTile.j]?.startsFrom,
      };
      startFathers[adj.i][adj.j] = {
        ...currentStartTile,
        startsFrom: fathers[currentStartTile.i][currentStartTile.j]?.startsFrom,
      };
      distance[adj.i][adj.j] =
        distance[currentStartTile.i][currentStartTile.j] + 1;
    }
    if (middleTile) {
      break;
    }
  }
  visitedList = getVisitedList(distance);

  if (startFromStart === true && middleTile) {
    let middleAdj = getAdjacent(graph, middleTile, visitedStart);

    for (const adj of middleAdj) {
      if (fathers[adj.i][adj.j]?.startsFrom === "end") {
        currentPathFromStartTile = middleTile as Position;
        currentPathFromEndTile = adj as Position;
      }
      console.log(fathers[adj.i][adj.j]);
    }
  }
  if (startFromStart === false && middleTile) {
    let middleAdj = getAdjacent(graph, middleTile, visitedEnd);

    for (const adj of middleAdj) {
      if (fathers[adj.i][adj.j]?.startsFrom === "start") {
        currentPathFromStartTile = adj as Position;
        currentPathFromEndTile = middleTile as Position;
      }
      console.log(fathers[adj.i][adj.j], "end");
    }
  }
  if (!currentPathFromStartTile || !currentPathFromEndTile) {
    const end = performance.now();
    const time = end - start;
    return { path: [], visitedList: visitedList.reverse(), time };
  }
  let tileInBounds =
    startFathers[currentPathFromStartTile.i][currentPathFromStartTile.j] !==
      undefined ||
    endFathers[currentPathFromEndTile.i][currentPathFromEndTile.j] !==
      undefined;
  while (
    (currentPathFromStartTile.i !== startingPosition.i ||
      currentPathFromStartTile.j !== startingPosition.j) &&
    startFathers[currentPathFromStartTile.i][currentPathFromStartTile.j] !==
      undefined
  ) {
    // Iterate over fathers matrix from the end position until we find starting position, and add the current tile in fathers array to the path
    startPath.push({
      i: currentPathFromStartTile.i,
      j: currentPathFromStartTile.j,
    });
    currentPathFromStartTile = startFathers[currentPathFromStartTile.i][
      currentPathFromStartTile.j
    ] as Position;
  }
  while (
    (currentPathFromEndTile.i !== endingTile.i ||
      currentPathFromEndTile.j !== endingTile.j) &&
    endFathers[currentPathFromEndTile.i][currentPathFromEndTile.j] !== undefined
  ) {
    if (
      currentPathFromEndTile.i !== endingTile.i ||
      currentPathFromEndTile.j !== endingTile.j
    ) {
      endPath.push({
        i: currentPathFromEndTile.i,
        j: currentPathFromEndTile.j,
      });
      currentPathFromEndTile = endFathers[currentPathFromEndTile.i][
        currentPathFromEndTile.j
      ] as Position;
    }
  }
  startPath.reverse();

  path = [...startPath, ...endPath];

  visitedList.reverse();
  const end = performance.now();
  const time = end - start;
  return { path, visitedList, time };
};
