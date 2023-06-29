import { Game } from "./newGame";
import { PlayerHandStatus } from "./newPlayer";

export function nextPlayer(game: Game, playerNum: number, skipFolded = true) {
  let i: number;
  for (i = 1; i < game.players.length; i++) {
    const tryPlayerNum = (playerNum + i) % game.players.length;
    const tryPlayer = game.players[tryPlayerNum];

    const isNotBust = tryPlayer.stack > 0;
    const hasNotFolded = tryPlayer.currentHand?.handStatus !== PlayerHandStatus.FOLDED;
    const foldedOk = !skipFolded;
    if (isNotBust && (hasNotFolded || foldedOk)) {
      return tryPlayerNum;
    }
  }
  return null;
}