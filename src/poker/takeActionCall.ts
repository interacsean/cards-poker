import { Game } from "./newGame";
import { over, lensPath, add, subtract } from 'ramda';

export function takeActionCall(game: Game) {
  const { actionPlayer } = game;

  const currentBet = game.players.reduce(
    (curMaxBet, player) => Math.max(player.currentHand?.bet ?? 0, curMaxBet),
    0,
  );
  const betToPlayer = currentBet - (game.players[game.actionPlayer].currentHand?.bet ?? 0);

  const actualBet = Math.min(game.players[actionPlayer].stack, betToPlayer);

  const game2 = over(lensPath(['players', actionPlayer, 'currentHand', 'bet']), (n) => (n || 0) + actualBet, game);
  const game3 = over(lensPath(['players', actionPlayer, 'stack']), (n) => n - actualBet, game2);

  return game3;
}