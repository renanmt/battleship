export interface Ship {
    name: string;
    size: number;
    color: string;
    dropped: boolean;
};

export enum Direction {
    horizontal,
    vertical
};

export type Coordinate = {
    x: number;
    y: number;
    ship: Ship;
    direction: Direction
}

export interface Board {
    values: string[][];
    ships: Array<Coordinate>;
}