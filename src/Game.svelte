<script lang="ts">
    import { tick } from "svelte";
    import BoardMessage from "./lib/BoardMessage.svelte";
    import NewGameBoard from "./lib/NewGameBoard.svelte";
    import PlayerBoard from "./lib/PlayerBoard.svelte";
    import EnemyBoard from "./lib/EnemyBoard.svelte";

    import * as messages from "./lib/messages";
    import { createEmptyBoard, generateEnemyBoard } from "./lib/board-utils";
    import { getShootCoordinates, Shoot, Shot, Turn } from "./lib/game";

    let playerBoard = createEmptyBoard();
    let enemyBoard;

    let gameReady;
    let message;
    let gameStarted = false;
    let turn: Turn | undefined;
    let shootPlayer: Shoot;
    let lastShot: Shot | undefined;
    let gameover: boolean = false;
    let cpuShot: boolean = false;
    let debug: boolean = false;

    $: if (gameReady && !gameStarted) {
        gameStarted = true;
        message = messages.yourTurn;
        (turn = Turn.Player), (enemyBoard = generateEnemyBoard());
    }

    $: if (turn === Turn.CPU && !cpuShot) {
        cpuShot = true;
        const { x, y } = getShootCoordinates(playerBoard);
        setTimeout(() => {
            const shot = shootPlayer(x, y);

            if (shot.hit) {
                if (shot.sunk) {
                    message = `Bye bye! I just sunk your ${shot.sunk.name}!`;
                } else {
                    message = "Ha! got you!";
                }
            } else {
                message = "I missed!";
            }

            lastShot = shot;
        }, 3000);
    }

    function onPlayerShot(shot: Shot): void {
        if (shot.hit) {
            if (shot.sunk) {
                message = `Ouch! You just sunk my ${shot.sunk.name}!`;
            } else {
                message = "You got me! Hit!";
            }
        } else {
            message = "Miss!";
        }

        lastShot = shot;
    }

    function nextTurn() {
        turn = turn === Turn.CPU ? Turn.Player : Turn.CPU;

        if (playerBoard.sunk.length === 5) {
            message = "You Lost!";
            gameover = true;
        } else if (enemyBoard.sunk.length === 5) {
            gameover = true;
            message = "You Won!";
        } else {
            switch (turn) {
                case Turn.CPU:
                    message = "The CPU is thinking...";
                    break;
                case Turn.Player:
                default:
                    message = "Your turn!";
                    cpuShot = false;
                    break;
            }

            lastShot = undefined;
        }
    }
</script>

<main>
    <h1>Battleship Web</h1>
    <BoardMessage bind:message />
    <label>
        <input type="checkbox" bind:checked={debug} />
        Debug mode (cheat)
    </label>
    <div class="boards">
        {#if !gameReady}
            <div class="player-board">
                <NewGameBoard bind:board={playerBoard} bind:gameReady />
            </div>
        {/if}
        {#if gameReady}
            <div class="player-board">
                <PlayerBoard bind:board={playerBoard} {turn} bind:shootPlayer />
            </div>
            <div class="enemy-board">
                <EnemyBoard
                    bind:board={enemyBoard}
                    {turn}
                    onShot={onPlayerShot}
                    bind:debug
                />
            </div>
        {/if}
    </div>
    {#if gameReady && !gameover && lastShot}
        <button on:click={() => nextTurn()} style="margin-top: 50px">
            End Turn
        </button>
    {/if}
</main>

<style lang="scss">
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 2em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    .boards {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        align-content: center;

        .player-board,
        .enemy-board {
            display: flex;
            flex-direction: column;
            flex-basis: 100%;
            flex: 1;
        }
    }
</style>
