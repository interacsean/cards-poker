import { Game } from "./newGame";
import { PlayerHandStatus } from "./newPlayer";

type Cfg = {
  skipFolded?: boolean,
  playerNum?: number,
}

export function nextPlayer(game: Game, cfg: Cfg = {}) {
  const skipFolded = cfg.skipFolded ?? true;
  const playerNum = cfg.playerNum ?? game.actionPlayer;
  // console.log({ playerNum });
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