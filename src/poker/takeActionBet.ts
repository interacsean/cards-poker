import { Game } from "./newGame";
import { over, lensPath, add, subtract } from 'ramda';

export function takeActionBet(game: Game, amount: number) {
  const { actionPlayer } = game;

  // todo: Address where this is a raise – current logic means you have to specify the call and raise amt

  if (amount > game.players[actionPlayer].stack) {
    throw Error("You don't have that much");
  }

  const actualBet = Math.min(game.players[actionPlayer].stack, amount);

  const game2 = over(lensPath(['players', actionPlayer, 'currentHand', 'bet']), (n) => (n || 0) + actualBet, game);
  const game3 = over(lensPath(['players', actionPlayer, 'stack']), (n) => n - actualBet, game2);

  return game3;
}