import type { Board, ShipIndex, Ship } from "../types";
import { Direction } from "../types";
import ships from "./ships";
import { getRandomFromInterval } from "./utils";

export const headerY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const headerX = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "L"];

export function getCoordinateName(x: number, y: number): string {
    return `${headerX[x]}${headerY[y]}`;
}

export function createEmptyBoard(): Board {
    const values = [...Array(10)].map(() => Array(10).fill(""));

    return {
        values,
        shipIndexes: [],
        hits: {},
        sunk: [],
        shots: [],
    };
}

export function canFit(
    ship: Ship,
    x: number,
    y: number,
    direction: Direction,
    board: string[][]
): boolean {
    if (direction === Direction.horizontal) {
        for (let i = x; i < x + ship.size; i++) {
            if (board[y][i] !== "") return false;
        }
    } else {
        for (let i = y; i < y + ship.size; i++) {
            if (board[i][x] !== "") return false;
        }
    }

    return true;
}

export function placeShip(
    ship: Ship,
    x: number,
    y: number,
    direction: Direction,
    board: Board
): void {
    if (direction === Direction.horizontal) {
        for (let i = x; i < x + ship.size; i++) {
            board.values[y][i] = ship.name;
        }
    } else {
        for (let i = y; i < y + ship.size; i++) {
            board.values[i][x] = ship.name;
        }
    }

    board.shipIndexes.push({ ship, x, y, direction });
}

export function generateEnemyBoard(): Board {
    const board = createEmptyBoard();

    ships.forEach((ship) => {
        let direction: Direction;
        let x, y: number;

        do {
            direction = [Direction.horizontal, Direction.vertical][
                Math.floor(Math.random() * 2)
            ];
            const maxPoint = 10 - ship.size;
            [x, y] = [
                getRandomFromInterval(0, maxPoint),
                getRandomFromInterval(0, maxPoint),
            ];
        } while (!canFit(ship, x, y, direction, board.values));

        placeShip(ship, x, y, direction, board);
    });

    return board;
}

export function getShipIndex(
    x: number,
    y: number,
    shipIndexes: Array<ShipIndex>
): Array<ShipIndex> {
    const c = shipIndexes.find((s) => s.x === x && s.y === y);
    return [c];
}

export function getTop(shipIndex: ShipIndex): number {
    let top = 150 + shipIndex.ship.size * 50;
    return top;
}
