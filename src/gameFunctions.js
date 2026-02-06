export const GRID_SIZE = 10;
export const CELL_SIZE = 60;

export function drawGrid(ctx, canvas, grid) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      ctx.strokeStyle = "#1b0101fd";
      ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      if (grid[y][x]) {
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
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

export function getGridPosition(mouseX, mouseY) {
  const gridX = Math.floor(mouseX / CELL_SIZE);
  const gridY = Math.floor(mouseY / CELL_SIZE);

  if (gridX < 0 || gridX >= GRID_SIZE || gridY < 0 || gridY >= GRID_SIZE) {
    return null;
  }

  return { x: gridX, y: gridY };
}
