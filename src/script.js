import {
  drawGrid,
  drawBlock,
  getGridPosition,
  GRID_SIZE,
  CELL_SIZE,
  drawGhostBlock,
} from "./gameFunctions.js";
import { BLOCK_SHAPES } from "./blocks.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let GAME_GRID = Array.from({ length: GRID_SIZE }, () =>
  Array(GRID_SIZE).fill(0),
);

const TRAY_Y = canvas.height - 120;
const TRAY_BLOCK_SIZE = 30;
const TOTAL_BLOCKS = 3;
let availableBlocks = [];

let activeBlock = null;
let offsetX = 0;
let offsetY = 0;

let mouse = { x: 0, y: 0 };

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;

  if (activeBlock) {
    activeBlock.x = mouse.x - offsetX;
    activeBlock.y = mouse.y - offsetY;
  }
});

function createTrayBlocks() {
  availableBlocks = [];
  for (let i = 0; i < TOTAL_BLOCKS; i++) {
    const shape = BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)];
    availableBlocks.push({
      shape,
      x:
        canvas.width / 2 +
        (i - 1) * 120 -
        (shape[0].length * TRAY_BLOCK_SIZE) / 2,
      y: TRAY_Y,
      color: "#4CAF50",
      active: true,
    });
  }
}
createTrayBlocks();

function checkTrayClick(x, y) {
  for (const block of availableBlocks) {
    const w = block.shape[0].length * TRAY_BLOCK_SIZE;
    const h = block.shape.length * TRAY_BLOCK_SIZE;

    if (x >= block.x && x <= block.x + w && y >= block.y && y <= block.y + h) {
      activeBlock = block;
      offsetX = x - block.x;
      offsetY = y - block.y;
      return;
    }
  }
}

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  checkTrayClick(x, y);
});

canvas.addEventListener("mouseup", () => {
  if (!activeBlock) return;

  const gridPos = getGridPosition(mouse.x, mouse.y, canvas);
  if (gridPos) {
    // Place block if empty
    for (let y = 0; y < activeBlock.shape.length; y++) {
      for (let x = 0; x < activeBlock.shape[y].length; x++) {
        if (activeBlock.shape[y][x]) {
          GAME_GRID[gridPos.y + y][gridPos.x + x] = 1;
        }
      }
    }
  }

  createTrayBlocks();
  activeBlock = null;
});

function drawTray() {
  for (const block of availableBlocks) {
    drawBlock(ctx, block.shape, block.x, block.y, TRAY_BLOCK_SIZE);
  }
}

function gameLoop() {
  drawGrid(ctx, canvas, GAME_GRID);
  drawTray();

  if (activeBlock) {
    const gridPos = getGridPosition(mouse.x, mouse.y, canvas);
    if (gridPos)
      drawGhostBlock(ctx, activeBlock.shape, gridPos.x, gridPos.y, canvas);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
