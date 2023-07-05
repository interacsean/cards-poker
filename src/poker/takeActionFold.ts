import { Game } from "./newGame";
import { set, lensPath, add, subtract } from 'ramda';
import { PlayerHandStatus } from "./newPlayer";

export function takeActionFold(game: Game) {
  const { actionPlayer } = game;

  const game2 = set(lensPath(['players', actionPlayer, 'currentHand', 'handStatus']), PlayerHandStatus.FOLDED, game);

  return game2;
}