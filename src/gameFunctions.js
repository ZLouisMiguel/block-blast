import { getRandomColor } from "./blocks";

export const GRID_SIZE = 10;
export const CELL_SIZE = 30;

// Grid Functions
export function getGridOffset(canvas) {
  const gridWidth = GRID_SIZE * CELL_SIZE;
  const gridHeight = GRID_SIZE * CELL_SIZE;
  return {
    x: (canvas.width - gridWidth) / 2,
    y: (canvas.height - gridHeight) / 2 - 50,
  };
}

export function drawGrid(ctx, canvas, grid) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const offset = getGridOffset(canvas);

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const px = offset.x + x * CELL_SIZE;
      const py = offset.y + y * CELL_SIZE;

      ctx.strokeStyle = "#1b0101fd";
      ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);

      if (grid[y][x]) {
        ctx.fillStyle = grid[y][x];
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

// Block Drawing Functions
export function drawBlock(
  ctx,
  block,
  startX,
  startY,
  cellSize,
  alpha = 1,
  color = "#4CAF50",
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.strokeStyle = "#1b0101fd";

  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x]) {
        ctx.fillRect(
          startX + x * cellSize,
          startY + y * cellSize,
          cellSize,
          cellSize,
        );
        ctx.strokeRect(
          startX + x * cellSize,
          startY + y * cellSize,
          cellSize,
          cellSize,
        );
      }
    }
  }

  ctx.restore();
}

export function drawGhostBlock(ctx, block, gridX, gridY, canvas, alpha = 0.5) {
  const offset = getGridOffset(canvas);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#4CAF50";
  ctx.strokeStyle = "#1b0101fd";

  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x]) {
        const px = offset.x + (gridX + x) * CELL_SIZE;
        const py = offset.y + (gridY + y) * CELL_SIZE;

        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  ctx.restore();
}

// Tray Functions
export function drawTray(ctx, availableBlocks, TRAY_BLOCK_SIZE) {
  for (const block of availableBlocks) {
    if (block.active) {
      drawBlock(
        ctx,
        block.shape,
        block.x,
        block.y,
        TRAY_BLOCK_SIZE,
        1,
        block.color,
      );
    }
  }
}

export function createTrayBlocks({
  availableBlocks,
  canvas,
  TRAY_Y,
  TRAY_BLOCK_SIZE,
  TOTAL_BLOCKS,
  BLOCK_SPACING,
  BLOCK_SHAPES,
}) {
  availableBlocks.length = 0;
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
      color: getRandomColor(),
      active: true,
      originalIndex: i,
    });
  }
}

// Collision and Placement Functions
export function blockCollision(x, y, block, TRAY_BLOCK_SIZE) {
  const w = block.shape[0].length * TRAY_BLOCK_SIZE;
  const h = block.shape.length * TRAY_BLOCK_SIZE;
  return x >= block.x && x <= block.x + w && y >= block.y && y <= block.y + h;
}

export function canPlaceBlockAtPosition(grid, shape, gridX, gridY) {
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
      if (shape[y][x] && grid[gridY + y][gridX + x] !== 0) {
        return false;
      }
    }
  }

  return true;
}

export function findBestGridPlacement({
  canvas,
  grid,
  block,
  offsetX,
  offsetY,
  blockX,
  blockY,
}) {
  const offset = getGridOffset(canvas);

  const blockWidth = block.shape[0].length * CELL_SIZE;
  const blockHeight = block.shape.length * CELL_SIZE;
  const blockCenterX = blockX + blockWidth / 2;
  const blockCenterY = blockY + blockHeight / 2;

  let bestGridX = 0;
  let bestGridY = 0;
  let bestDistance = Infinity;

  for (let gridY = 0; gridY <= GRID_SIZE - block.shape.length; gridY++) {
    for (let gridX = 0; gridX <= GRID_SIZE - block.shape[0].length; gridX++) {
      if (canPlaceBlockAtPosition(grid, block.shape, gridX, gridY)) {
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

// Game Logic Functions
export function checkAndClearLines(grid) {
  let linesCleared = 0;
  const rowsToClear = [];
  const colsToClear = [];

  // Check rows
  for (let y = 0; y < GRID_SIZE; y++) {
    let rowComplete = true;
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x] === 0) {
        rowComplete = false;
        break;
      }
    }
    if (rowComplete) {
      rowsToClear.push(y);
    }
  }

  // Check columns
  for (let x = 0; x < GRID_SIZE; x++) {
    let colComplete = true;
    for (let y = 0; y < GRID_SIZE; y++) {
      if (grid[y][x] === 0) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) {
      colsToClear.push(x);
    }
  }

  // Clear rows
  for (const row of rowsToClear) {
    for (let x = 0; x < GRID_SIZE; x++) {
      grid[row][x] = 0;
    }
    linesCleared++;
  }

  // Clear columns
  for (const col of colsToClear) {
    for (let y = 0; y < GRID_SIZE; y++) {
      grid[y][col] = 0;
    }
    linesCleared++;
  }

  return linesCleared;
}

export function canPlaceAnyBlock({ grid, availableBlocks }) {
  for (const block of availableBlocks) {
    if (!block.active) continue;

    for (let gridY = 0; gridY <= GRID_SIZE - block.shape.length; gridY++) {
      for (let gridX = 0; gridX <= GRID_SIZE - block.shape[0].length; gridX++) {
        if (canPlaceBlockAtPosition(grid, block.shape, gridX, gridY)) {
          return true;
        }
      }
    }
  }
  return false;
}
