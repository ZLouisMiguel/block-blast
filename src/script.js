import {
  drawGrid,
  drawBlock,
  getGridOffset,
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
const BLOCK_SPACING = 120;
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
    const blockWidth = shape[0].length * TRAY_BLOCK_SIZE;
    const blockHeight = shape.length * TRAY_BLOCK_SIZE;

    availableBlocks.push({
      shape,
      x:
        canvas.width / 2 -
        ((TOTAL_BLOCKS - 1) * BLOCK_SPACING) / 2 +
        i * BLOCK_SPACING -
        blockWidth / 2,
      y: TRAY_Y,
      color: "#4CAF50",
      active: true,
      originalIndex: i,
    });
  }
}

createTrayBlocks();

function blockCollision(x, y, block) {
  const w = block.shape[0].length * TRAY_BLOCK_SIZE;
  const h = block.shape.length * TRAY_BLOCK_SIZE;
  return x >= block.x && x <= block.x + w && y >= block.y && y <= block.y + h;
}

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = 0; i < availableBlocks.length; i++) {
    const block = availableBlocks[i];
    if (block.active && blockCollision(x, y, block)) {
      activeBlock = {
        shape: block.shape,
        color: block.color,
        active: true,
        originalIndex: i,
        x: x - offsetX,
        y: y - offsetY,
        originalX: block.x,
        originalY: block.y,
      };

      offsetX = x - block.x;
      offsetY = y - block.y;
      break;
    }
  }
});

function getGridCellAtPosition(x, y) {
  const offset = getGridOffset(canvas);

  const gridX = Math.floor((x - offset.x) / CELL_SIZE);
  const gridY = Math.floor((y - offset.y) / CELL_SIZE);

  if (gridX < 0 || gridX >= GRID_SIZE || gridY < 0 || gridY >= GRID_SIZE) {
    return null;
  }

  return { x: gridX, y: gridY };
}

function canPlaceBlockAtPosition(shape, gridX, gridY) {
  if (
    gridX < 0 ||
    gridY < 0 ||
    gridX + shape[0].length > GRID_SIZE ||
    gridY + shape.length > GRID_SIZE
  ) {
    return false;
  }

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] && GAME_GRID[gridY + y][gridX + x] !== 0) {
        return false;
      }
    }
  }

  return true;
}

function findBestGridPlacement(block) {
  const offset = getGridOffset(canvas);

  const blockWidth = block.shape[0].length * CELL_SIZE;
  const blockHeight = block.shape.length * CELL_SIZE;
  const blockCenterX = block.x + blockWidth / 2;
  const blockCenterY = block.y + blockHeight / 2;

  let bestGridX = 0;
  let bestGridY = 0;
  let bestDistance = Infinity;

  for (let gridY = 0; gridY <= GRID_SIZE - block.shape.length; gridY++) {
    for (let gridX = 0; gridX <= GRID_SIZE - block.shape[0].length; gridX++) {
      if (canPlaceBlockAtPosition(block.shape, gridX, gridY)) {
        const screenX = offset.x + gridX * CELL_SIZE;
        const screenY = offset.y + gridY * CELL_SIZE;
        const screenCenterX = screenX + blockWidth / 2;
        const screenCenterY = screenY + blockHeight / 2;

        const distance = Math.sqrt(
          Math.pow(blockCenterX - screenCenterX, 2) +
            Math.pow(blockCenterY - screenCenterY, 2),
        );

        if (distance < bestDistance) {
          bestDistance = distance;
          bestGridX = gridX;
          bestGridY = gridY;
        }
      }
    }
  }

  return {
    gridX: bestGridX,
    gridY: bestGridY,
    canPlace: bestDistance < Infinity,
  };
}

canvas.addEventListener("mouseup", () => {
  if (!activeBlock) return;

  const placement = findBestGridPlacement(activeBlock);

  if (placement.canPlace) {
    for (let y = 0; y < activeBlock.shape.length; y++) {
      for (let x = 0; x < activeBlock.shape[y].length; x++) {
        if (activeBlock.shape[y][x]) {
          GAME_GRID[placement.gridY + y][placement.gridX + x] = 1;
        }
      }
    }

    availableBlocks = availableBlocks.filter(
      (block, index) => index !== activeBlock.originalIndex,
    );

    if (availableBlocks.length === 0) {
      createTrayBlocks();
    }
  } else {
    const originalBlock = availableBlocks[activeBlock.originalIndex];
    if (originalBlock) {
      originalBlock.x = activeBlock.originalX;
      originalBlock.y = activeBlock.originalY;
    }
  }

  activeBlock = null;
});

function drawTray() {
  for (const block of availableBlocks) {
    if (block.active) {
      drawBlock(ctx, block.shape, block.x, block.y, TRAY_BLOCK_SIZE);
    }
  }
}

function gameLoop() {
  drawGrid(ctx, canvas, GAME_GRID);
  drawTray();

  if (activeBlock) {
    drawBlock(
      ctx,
      activeBlock.shape,
      activeBlock.x,
      activeBlock.y,
      TRAY_BLOCK_SIZE,
      0.7,
    );
    const placement = findBestGridPlacement(activeBlock);
    if (placement.canPlace) {
      drawGhostBlock(
        ctx,
        activeBlock.shape,
        placement.gridX,
        placement.gridY,
        canvas,
      );
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
