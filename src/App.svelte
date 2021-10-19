<script lang="ts">
	import BoardMessage from './lib/BoardMessage.svelte';
	import NewGameBoard from './lib/NewGameBoard.svelte';

	import * as messages from './lib/messages';
	import { createEmptyBoard } from './lib/board-utils';

	let myBoard = createEmptyBoard();

	let gameReady;
	let message;

	$: if (gameReady) {
		message = messages.yourTurn;
	}
</script>

<main>
	<h1>Battleship Web</h1>
	<BoardMessage bind:message />
	<NewGameBoard bind:board={myBoard} bind:isReady={gameReady} />
</main>

<style>
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
</style>