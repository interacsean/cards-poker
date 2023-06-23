import { Game } from "./newGame";

export function calcPot(game: Game) {
  return game.players.reduce(
    (accumulativePot, player) =>
      accumulativePot + (player.currentHand?.bet || 0),
    0
  );
}
