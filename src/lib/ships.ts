import type { Ship } from '../types';

const ships: Array<Ship> = [
    { name: "destroyer", size: 2, color: '#85929e', dropped: false },
    { name: "submarine", size: 3, color: '#76d7c4', dropped: false },
    { name: "cruiser", size: 3, color: '#73c6b6', dropped: false },
    { name: "battleship", size: 4, color: '#edbb99', dropped: false },
    { name: "carrier", size: 5, color: '#5499c7', dropped: false },
];

export default ships;