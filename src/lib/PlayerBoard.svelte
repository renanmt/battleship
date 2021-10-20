<script lang="ts">
    import { Board, ShipIndex, Direction } from "../types";
    import { getShipIndex, getTop, headerX, headerY } from "./board-utils";
    import { OnShot, Shoot, shoot, Shot, Turn } from "./game";

    export let board: Board;
    export let turn: Turn;
    export const shootPlayer: Shoot = tryShoot;

    const debug = true;

    function getBackgroundImage(shipIndex: ShipIndex): string {
        return debug
            ? `background-image: url(../assets/${shipIndex.ship.name}h.png)`
            : "";
    }

    function tryShoot(x: number, y: number): Shot {
        const shot = shoot(x, y, board, turn);
        board = board;
        return shot;
    }

    function getCellClass(column: string): string {
        let className = column ? "" : "empty";

        className += column.includes("-hit") ? " hit" : "";
        className += column === "miss" ? "miss" : "";

        return className;
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
                >
                    {#each getShipIndex(x, y, board.shipIndexes) as shipIndex}
                        {#if column.includes("-hit")}
                            <div
                                class="cell hit"
                                style="position: relative;
                                       width: 100%;
                                       height: 100%;
                                       float: left;
                                       z-index: 99999;"
                            />
                        {/if}
                        {#if shipIndex !== undefined}
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

            &.hit {
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
