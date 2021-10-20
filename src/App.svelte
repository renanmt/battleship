<script lang="ts">
	import BoardMessage from "./lib/BoardMessage.svelte";
	import NewGameBoard from "./lib/NewGameBoard.svelte";
	import EnemyBoard from "./lib/EnemyBoard.svelte";

	import * as messages from "./lib/messages";
	import { createEmptyBoard, generateEnemyBoard } from "./lib/board-utils";

	let myBoard = createEmptyBoard();
	let enemyBoard = generateEnemyBoard();

	let gameReady;
	let message;

	$: if (gameReady) {
		message = messages.yourTurn;
	}
</script>

<main>
	<h1>Battleship Web</h1>
	<BoardMessage bind:message />
	<div class="boards">
		<div class="player-board">
			<NewGameBoard bind:board={myBoard} bind:isReady={gameReady} /> -->
		</div>
		{#if gameReady}
			<div class="enemy-board">
				<EnemyBoard board={enemyBoard} />
			</div>
		{/if}
	</div>
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
		display: grid;
		align-content: center;
	}
</style>
