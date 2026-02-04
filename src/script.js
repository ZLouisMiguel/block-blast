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

const block = BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)];
const blockWidth  = block[0].length * CELL_SIZE;
const blockHeight = block.length * CELL_SIZE;

drawBlock(
  ctx,
  block,
  canvas.width  - blockWidth  - CELL_SIZE,
  canvas.height - blockHeight - CELL_SIZE,
  CELL_SIZE
);