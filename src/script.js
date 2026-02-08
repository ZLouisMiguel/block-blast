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

let score = 0;
let combo = 0;
let gameOver = false;

const scoreElement = document.getElementById("score");
const comboElement = document.getElementById("combo");

const TRAY_Y = canvas.height - 120;
const TRAY_BLOCK_SIZE = 30;
const TOTAL_BLOCKS = 3;
const BLOCK_SPACING = 120;
let availableBlocks = [];

let activeBlock = null;
let offsetX = 0;
let offsetY = 0;

let mouse = { x: 0, y: 0 };

createTrayBlocks();
updateDisplay();

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

function checkAndClearLines() {
  let linesCleared = 0;

  const rowsToClear = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    let rowComplete = true;
    for (let x = 0; x < GRID_SIZE; x++) {
      if (GAME_GRID[y][x] === 0) {
        rowComplete = false;
        break;
      }
    }
    if (rowComplete) {
      rowsToClear.push(y);
    }
  }

  const colsToClear = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    let colComplete = true;
    for (let y = 0; y < GRID_SIZE; y++) {
      if (GAME_GRID[y][x] === 0) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) {
      colsToClear.push(x);
    }
  }

  for (const row of rowsToClear) {
    for (let x = 0; x < GRID_SIZE; x++) {
      GAME_GRID[row][x] = 0;
    }
    linesCleared++;
  }

  for (const col of colsToClear) {
    for (let y = 0; y < GRID_SIZE; y++) {
      GAME_GRID[y][col] = 0;
    }
    linesCleared++;
  }

  return linesCleared;
}

// Function to update score based on cleared lines
function updateScore(linesCleared) {
  if (linesCleared > 0) {
    combo++;
    // Each line cleared = 100 points, multiplied by combo
    score += linesCleared * 100 * combo;
  } else {
    combo = 0;
  }
  updateDisplay();
}


function canPlaceAnyBlock() {
  for (const block of availableBlocks) {
    if (!block.active) continue;

    for (let gridY = 0; gridY <= GRID_SIZE - block.shape.length; gridY++) {
      for (let gridX = 0; gridX <= GRID_SIZE - block.shape[0].length; gridX++) {
        if (canPlaceBlockAtPosition(block.shape, gridX, gridY)) {
          return true;
        }
      }
    }
  }
  return false;
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

    // Check and clear completed lines
    const linesCleared = checkAndClearLines();

    // Update score based on cleared lines
    updateScore(linesCleared);

    if (availableBlocks.length === 0) {
      createTrayBlocks();
    }

    // Check if game is over (no more placements possible)
    if (!canPlaceAnyBlock()) {
      gameOver = true;
      setTimeout(() => {
        alert(`Game Over! Final Score: ${score}`);
      }, 100);
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

function updateDisplay() {
  scoreElement.value = score;
  comboElement.value = combo;
}

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
