import { AStarSearch } from "../services/AstarSearch";
import { basicPathFinding } from "../services/basicPathFinding";
import { bidirectionalSearch } from "../services/bidirectionalSearch";
import { DFS } from "../services/dfs";

export const algorithmsMap = {
  bfs: basicPathFinding,
  dfs: DFS,
  bidirectional_search: bidirectionalSearch,
  a_star_search: AStarSearch,
};
