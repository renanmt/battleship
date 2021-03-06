export interface Ship {
    name: string;
    size: number;
    color: string;
    dropped: boolean;
}

export enum Direction {
    horizontal,
    vertical,
}

export type ShipIndex = {
    x: number;
    y: number;
    ship: Ship;
    direction: Direction;
};

export interface Board {
    values: string[][];
    shipIndexes: Array<ShipIndex>;
    hits: Object;
    sunk: Array<Ship>;
    shots: Array<String>;
}
