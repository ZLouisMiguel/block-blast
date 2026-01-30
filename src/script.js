import { drawGrid } from "../gameFunctions";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 10;
const CELL_SIZE = 60;

let GAME_GRID = Array.from({length: GRID_SIZE}, () => {
    Array(GRID_SIZE).fill(0);
});

console.log(GAME_GRID);
drawGrid(ctx, canvas, GRID_SIZE, CELL_SIZE, GAME_GRID);