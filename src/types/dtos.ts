import { Position } from "./position";
import { Algorithms } from "./Algorithms";

export type CompareResponseType = {
 [key in Algorithms]: AlgorithmResponse
}

export interface AlgorithmResponse {
  path: Position[];
  visitedList: Position[][];
  time: number;
}
