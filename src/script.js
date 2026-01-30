import { drawGrid } from "./gameFunctions.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 10;
const CELL_SIZE = 60;

let GAME_GRID = Array.from({ length: GRID_SIZE }, () =>
  Array(GRID_SIZE).fill(0),
);

/* [
   Row 0: [0,1,2,3,4,5,6,7,8,9],
   Row 1: [0,1,2,3,4,5,6,7,8,9],
   Row 2: [0,1,2,3,4,5,6,7,8,9],
   Row 3: [0,1,2,3,4,5,6,7,8,9],
   Row 4: [0,1,2,3,4,5,6,7,8,9],
   Row 5: [0,1,2,3,4,5,6,7,8,9],
   Row 6: [0,1,2,3,4,5,6,7,8,9],
   Row 7: [0,1,2,3,4,5,6,7,8,9],
   Row 8: [0,1,2,3,4,5,6,7,8,9],
   Row 9: [0,1,2,3,4,5,6,7,8,9],
] */

for( let i = 0 ; i < 10 ; i++) GAME_GRID[i][i] = 1;
for(let i = 9; i >= 0 ; i--) GAME_GRID[9-i][i] =1;



console.log(GAME_GRID);
drawGrid(ctx, canvas, GRID_SIZE, CELL_SIZE, GAME_GRID);
