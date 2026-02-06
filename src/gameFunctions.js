export const GRID_SIZE = 10;
export const CELL_SIZE = 40;

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
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

export function drawBlock(ctx, block, startX, startY, cellSize, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#4CAF50";
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

export function getGridPosition(mouseX, mouseY, canvas) {
  const offset = getGridOffset(canvas);

  const gridX = Math.floor((mouseX - offset.x) / CELL_SIZE);
  const gridY = Math.floor((mouseY - offset.y) / CELL_SIZE);

  if (gridX < 0 || gridX >= GRID_SIZE || gridY < 0 || gridY >= GRID_SIZE) {
    return null;
  }

  return { x: gridX, y: gridY };
}

export function drawGhostBlock(ctx, block, gridX, gridY, canvas, alpha = 0.5) {
  const offset = getGridOffset(canvas);

  drawBlock(
    ctx,
    block,
    offset.x + gridX * CELL_SIZE,
    offset.y + gridY * CELL_SIZE,
    CELL_SIZE,
    alpha,
  );
}
