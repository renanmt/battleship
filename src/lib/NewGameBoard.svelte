<script lang="ts">
    import type { Board, Ship } from "../types";
    import { Direction } from "../types";

    import ships from "./ships";

    import { canFit, placeShip } from "./board-utils";
    import GameBoard from "./GameBoard.svelte";

    export let board: Board;
    export let gameReady = false;

    let direction: Direction = Direction.horizontal;
    let currentShipDrag: Ship | undefined;
    let currentDragOver: string | undefined;
    let shipsDropped = 0;

    $: gameReady = shipsDropped === ships.length;

    function shipDragStart(e: DragEvent) {
        const el: HTMLElement = e.target as HTMLElement;

        if (direction === Direction.vertical) {
            const crt = el.cloneNode(true) as HTMLElement;
            crt.id = "ghost";
            crt.style.position = "absolute";
            crt.style.top = "0px";
            crt.style.left = "-300px";

            const inner = crt.getElementsByClassName("ship")[0] as HTMLElement;
            inner.style["background-repeat"] = "no-repeat";
            inner.style["background-position"] = "center";
            inner.style["transformOrigin"] = "-75px -75px";

            inner.style.transform = "rotate(270deg)";

            document.body.appendChild(crt);
            e.dataTransfer.setDragImage(crt, 0, 0);
        }

        currentShipDrag = ships[el.dataset.ship];
    }

    function shipDragOver(e: DragEvent) {
        e.preventDefault();

        let el: HTMLElement = e.target as HTMLElement;
        currentDragOver = el.id;
    }

    function shipDragEnd(e: DragEvent) {
        currentShipDrag = undefined;
        currentDragOver = undefined;
        if (direction === Direction.vertical) {
            document.getElementById("ghost").remove();
        }
    }

    function shipDrop(e: DragEvent) {
        e.preventDefault();
        const el: HTMLElement = e.target as HTMLElement;
        const x: number = (el.dataset.x as unknown as number) * 1;
        const y: number = (el.dataset.y as unknown as number) * 1;

        if (canFit(currentShipDrag, x, y, direction, board.values)) {
            placeShip(currentShipDrag, x, y, direction, board);

            board = board;

            currentShipDrag.dropped = true;
            ships[el.dataset.ship] = currentShipDrag;
            shipsDropped++;
        }
    }

    function getStyle(ship: Ship): string {
        const backgroundImage = `background-image: url(../assets/${ship.name}h.png);`;
        let dimensions = `height: 50px; width: ${ship.size * 50}px;`;

        const opacity = ship.dropped ? "opacity: 50%" : "";

        return `${backgroundImage} ${dimensions} ${opacity}`;
    }

    function canDrop(x: number, y: number) {
        const limit = 10 - currentShipDrag.size;

        return direction === Direction.horizontal ? x <= limit : y <= limit;
    }
</script>

{#if !gameReady}
    <div class="direction">
        <label>
            <input
                type="radio"
                bind:group={direction}
                value={Direction.horizontal}
            />
            horizontal
        </label>

        <label>
            <input
                type="radio"
                bind:group={direction}
                value={Direction.vertical}
            />
            vertical
        </label>
    </div>
    <div class="ships">
        {#each ships as ship, s}
            <div
                id={ship.name}
                data-ship={s}
                draggable={!ship.dropped}
                on:dragstart={shipDragStart}
                on:dragend={shipDragEnd}
            >
                <div
                    class="ship {ship.name} 
                    {!ship.dropped ? 'draggable' : ''} 
                    {direction === Direction.vertical ? 'vertical' : ''} "
                    style={getStyle(ship)}
                />
            </div>
        {/each}
    </div>
{/if}

<GameBoard
    {board}
    {ships}
    {currentShipDrag}
    {currentDragOver}
    {gameReady}
    {canDrop}
    {shipDragOver}
    {shipDrop}
/>

<style lang="scss">
    .direction {
        display: flex;
        justify-content: center;
        label {
            margin-right: 30px;
        }
    }

    .ships {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;

        .ship {
            background-position: center;
            background-repeat: no-repeat;
            width: 50px;
            justify-content: center;
            margin-right: 20px;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            &.draggable {
                cursor: move; /* fallback if grab cursor is unsupported */
                cursor: grab;
                cursor: -moz-grab;
                cursor: -webkit-grab;
                &:active {
                    cursor: grabbing;
                    cursor: -moz-grabbing;
                    cursor: -webkit-grabbing;
                }
            }

            &.vertical {
                transition-property: transform;
                transition-duration: 200ms;
                transition-timing-function: ease-in-out;
            }

            &:not(.vertical) {
                transition-property: background-image;
                transition-duration: 200ms;
                transition-timing-function: ease-in-out;
            }
        }
    }
</style>
