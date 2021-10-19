import type { Board, Ship } from "../types";
import { Direction } from '../types';
import ships from './ships';
import { getRandomFromInterval } from './utils';

export function createEmptyBoard(): Board {
    const values = [...Array(10)].map(() => Array(10).fill(''));

    return {
        values,
        ships: []
    };
}

export function canFit(ship: Ship, x: number, y: number, direction: Direction, board: string[][]): boolean {
    if (direction === Direction.horizontal) {
        for (let i = x; i < x + ship.size; i++) {
            if (board[y][i] !== '')
                return false;
        }
    }
    else {
        for (let i = y; i < y + ship.size; i++) {
            if (board[i][x] !== '')
                return false;
        }
    }

    return true;
}

export function placeShip(ship: Ship, x: number, y: number, direction: Direction, board: Board): void {
    if (direction === Direction.horizontal) {
        for (let i = x; i < x + ship.size; i++) {
            board.values[y][i] = ship.name;
        }
    } else {
        for (let i = y; i < y + ship.size; i++) {
            board.values[i][x] = ship.name;
        }
    }

    board.ships.push({ ship, x, y });
}

export function generateEnemyBoard(): Board {
    const board = createEmptyBoard();

    ships.forEach(ship => {
        const direction = [Direction.horizontal, Direction.vertical][Math.floor(Math.random() * 2)];
        const maxPoint = 10 - ship.size;
        const [x, y] = [
            getRandomFromInterval(0, maxPoint),
            getRandomFromInterval(0, maxPoint)
        ];

        while (!canFit(ship, x, y, direction, board.values)) { }

        placeShip(ship, x, y, direction, board);
    });

    return board;
}