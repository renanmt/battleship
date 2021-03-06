<script lang="ts">
    import { Board, ShipIndex, Direction } from "../types";
    import { getShipIndex, getTop, headerX, headerY } from "./board-utils";
    import { OnShot, shoot, Turn } from "./game";

    export let board: Board;
    export let turn: Turn;
    export let onShot: OnShot;
    export let shotDone: boolean = false;

    export let debug = true;

    function getBackgroundImage(shipIndex: ShipIndex): string {
        return debug
            ? `background-image: url(../assets/${shipIndex.ship.name}h.png)`
            : "";
    }

    function tryShoot(x: number, y: number) {
        if (!shotDone && turn === Turn.Player) {
            const shot = shoot(x, y, board, turn);
            board = board;
            shotDone = true;
            onShot(shot);
        }
    }

    function getCellClass(column: string): string {
        let className = debug && column !== '' ? "" : "empty";

        className += column.includes("-hit") ? " hit" : "";
        className += column === "miss" ? " miss" : "";
        className += !column.includes('-hit') || !column.includes('-miss') && turn === Turn.Player ? " aim" : "";

        return className;
    }

    $: if (turn === Turn.CPU) {
        debugger;
        shotDone = false;
    }
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
                    class="cell {getCellClass(column)}"
                    on:click={(e) => tryShoot(x, y)}
                >
                    {#each getShipIndex(x, y, board.shipIndexes) as shipIndex}
                        {#if debug && shipIndex !== undefined}
                            <div
                                style="{getBackgroundImage(shipIndex)};
                                       {column
                                    ? `background-color: #5d9ce2`
                                    : ''};
                                       background-repeat: no-repeat;
                                       background-position: center;
                                       position: relative;
                                       width: {shipIndex.ship.size * 50}px;
                                       height: 50px; 
                                      {shipIndex.direction ===
                                Direction.vertical
                                    ? `transform: rotate(270deg); 
                                       transform-origin: -75px -75px; top: ${getTop(
                                           shipIndex
                                       )}px;"`
                                    : ''}"
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
            overflow: hidden;

            &.empty {
                background-image: url("../assets/water16x16.gif");
                background-size: contain;
                -webkit-transform: rotate(270deg);
                -moz-transform: rotate(270deg);
                -ms-transform: rotate(270deg);
                -o-transform: rotate(270deg);
                transform: rotate(270deg);
            }

            &.aim:hover {
                cursor: crosshair;
            }

            &.hit {
                background-color: #5c9ce2;
                background-image: url("../assets/explosion.png");
                background-size: contain;
            }

            &.miss {
                background-image: radial-gradient(
                    circle,
                    #5c9ce2 0px,
                    #5c9ce2 5px,
                    #b3d3f5 5px,
                    #b3d3f5 20px,
                    #5c9ce2 20px,
                    #5c9ce2 35px,
                    #b3d3f5 35px,
                    #b3d3f5 50px,
                    #5c9ce2 50px
                );
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
