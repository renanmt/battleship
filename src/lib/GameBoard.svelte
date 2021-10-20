<script lang="ts">
    import type { Board, Coordinate, Ship } from "../types";
    import { Direction } from "../types";
    import { getCoordinate, getTop, headerY, headerX } from "./board-utils";

    export let board: Board;
    export let ships: Ship[];
    export let currentShipDrag: Ship;
    export let currentDragOver: string;
    export let gameReady: boolean;
    export let canDrop: Function;
    export let shipDragOver: Function;
    export let shipDrop: Function;

    $: console.log(board);
</script>

<div class="game-board">
    <div class="header" />
    {#each headerX as hx}
        <div class="header">
            {hx}
        </div>
    {/each}
    {#if board}
        {#each board.values as row, y}
            <div class="header">
                {headerY[y]}
            </div>
            {#each row as column, x}
                <div
                    id={`${headerY[y]}${x + 1}`}
                    data-x={x}
                    data-y={y}
                    class="cell {column ? '' : ' empty'} 
                {!gameReady && currentShipDrag && canDrop(x, y)
                        ? 'drop-zone'
                        : ''} 
                {!gameReady && currentDragOver === `${headerY[y]}${x + 1}`
                        ? 'drop-zone-over'
                        : ''} "
                    style={column
                        ? `background-color: #5d9ce2`
                        : ""}
                    on:dragover={!gameReady && currentShipDrag && canDrop(x, y)
                        ? (e) => shipDragOver(e)
                        : undefined}
                    on:drop={!gameReady ? (e) => shipDrop(e) : undefined}
                >
                    {#each getCoordinate(x, y, board.ships) as coordinate}
                        {#if coordinate !== undefined}
                            <div
                                style="
                                background-image: url(../assets/{coordinate.ship
                                    .name}h.png);
                                background-repeat: no-repeat;
                                background-position: center;
                                position: relative;
                                width: {coordinate.ship.size * 50}px;
                                height: 50px; 
                                {coordinate.direction === Direction.vertical
                                    ? `transform: rotate(270deg); transform-origin: -75px -75px; top: ${getTop(coordinate)}px;"`
                                    : ''}
                                "
                            />
                        {/if}
                    {/each}
                </div>
            {/each}
        {/each}
    {/if}
</div>

<style lang="scss">
    .game-board {
        display: grid;
        grid-template-columns: 50px 50px 50px 50px 50px 50px 50px 50px 50px 50px 50px;
        grid-template-rows: 50px 50px 50px 50px 50px 50px 50px 50px 50px 50px 50px;
        justify-content: center;

        .cell {
            border: 1px solid #b2e7f2;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            overflow: visible;

            &.empty {
                background-image: url("../assets/water16x16.gif");
                background-size: contain;
                -webkit-transform: rotate(270deg);
                -moz-transform: rotate(270deg);
                -ms-transform: rotate(270deg);
                -o-transform: rotate(270deg);
                transform: rotate(270deg);
            }
        }

        header {
            vertical-align: middle;
        }

        .drop-zone {
            background-color: #ebf5fb;
        }

        .drop-zone-over {
            opacity: 50%;
        }
    }
</style>
