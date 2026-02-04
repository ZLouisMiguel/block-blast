import { drawGrid, drawBlock } from "./gameFunctions.js";
import { BLOCK_SHAPES } from "./blocks.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 10;
const CELL_SIZE = 60;

let GAME_GRID = Array.from({ length: GRID_SIZE }, () =>
  Array(GRID_SIZE).fill(0),
);
console.log(GAME_GRID);
drawGrid(ctx, canvas, GRID_SIZE, CELL_SIZE, GAME_GRID);

const testBlock = BLOCK_SHAPES[4];
drawBlock(ctx, testBlock, 0, 0, CELL_SIZE);
drawBlock(ctx, BLOCK_SHAPES[2], canvas.width - (4 * CELL_SIZE), canvas.height - CELL_SIZE, CELL_SIZE);
