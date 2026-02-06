import {
  drawGrid,
  drawBlock,
  getGridPosition,
  GRID_SIZE,
  CELL_SIZE
} from "./gameFunctions.js";
import { BLOCK_SHAPES } from "./blocks.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let GAME_GRID = Array.from({ length: GRID_SIZE }, () =>
  Array(GRID_SIZE).fill(0)
);

let activeBlock = BLOCK_SHAPES[7];

let mouse = { x: 0, y: 0 };

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

function gameLoop() {
  drawGrid(ctx, canvas, GAME_GRID);
  const gridPos = getGridPosition(mouse.x, mouse.y);

  if (gridPos) {
    drawBlock(
      ctx,
      activeBlock,
      gridPos.x * CELL_SIZE,
      gridPos.y * CELL_SIZE,
      CELL_SIZE,
      0.5
    );
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
