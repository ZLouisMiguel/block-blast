function drawGrid(ctx , canvas , GRID_SIZE , CELL_SIZE , grid) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(
        x * CELL_SIZE,
        y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );

      if (grid[y][x]) {
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }
  }
}