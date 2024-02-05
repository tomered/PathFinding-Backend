import mongoose, { connect } from "mongoose";
import { Tiles } from "../constants/tiles";
import { Position } from "../types/position";

export async function connectDB(uri: string) {
  try {
    const mongoose = await connect(uri);
  } catch (err) {}
}

const pathFindingSchema = new mongoose.Schema({
  graph: [
    [
      {
        type: String,
        enum: Tiles,
      },
    ],
  ],
  path: [{ i: { type: Number }, j: { type: Number } }],
  visitedList: [[{ i: { type: Number }, j: { type: Number } }]],
  algorithm: { type: String, require: true },
});

export const PathFinding = mongoose.model("pathFinding", pathFindingSchema);
