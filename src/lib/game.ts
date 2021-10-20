import type { Board, Ship } from "../types";
import { getCoordinateName } from "./board-utils";
import ships from "./ships";
import { getRandomFromInterval } from "./utils";

export enum Turn {
    Player,
    CPU,
}

export type Shot = {
    hit: boolean;
    sunk: Ship | undefined;
    turn: Turn;
};

export type Point = {
    x: number;
    y: number;
};

export type OnShot = (shot: Shot) => void;
export type Shoot = (x: number, y: number) => Shot;

export function shoot(x: number, y: number, board: Board, turn: Turn): Shot {
    const audioShot = new Audio("assets/sounds/shots-fired.mp3");
    audioShot.play();

    let pos = board.values[y][x];

    const coordinate = getCoordinateName(x, y);
    board.shots.push(coordinate);

    if (pos !== "" && pos !== "miss") {
        const audioHit = new Audio("assets/sounds/hit-ship.mp3");
        audioHit.play();

        board.hits[pos] = board.hits[pos] ? board.hits[pos] + 1 : 1;

        const ship = ships.find((ship) => ship.name === pos);
        let sunk: Ship;

        if (board.hits[pos] === ship.size) {
            sunk = ship;
            board.sunk.push(sunk);

            const audioSunk = new Audio("assets/sounds/sunk-ship.mp3");
            audioSunk.play();
        }

        pos += "-hit";
        board.values[y][x] = pos;

        return { hit: true, sunk, turn };
    }

    board.values[y][x] = "miss";

    const audioHitWater = new Audio("assets/sounds/hit-water.mp3");
    audioHitWater.play();

    return { hit: false, turn } as Shot;
}

export function getShootCoordinates(board: Board): Point {
    let x: number, y: number;
    do {
        [x, y] = [getRandomFromInterval(0, 9), getRandomFromInterval(0, 9)];
    } while (board.shots.includes(getCoordinateName(x, y)));

    return { x, y };
}
