import { Game } from "./newGame";
import { clone } from "ramda";
import { game as freshGame } from "./fixtures/game.fixture"
import { takeActionBet } from "./takeActionBet";
import { PlayerHandStatus } from "./newPlayer";

let game: Game;

describe('takeActionBet', () => {
  beforeEach(() => {
    game = clone(freshGame);
    game.players[game.actionPlayer].currentHand = {
      bet: 0,
      hand: null,
      handStatus: PlayerHandStatus.PREDEAL
    };
    // const { deck, ...gameWoDeck } = game;
    // console.log(JSON.stringify({ gameWoDeck }, undefined, " "));
  });
  // todo:
  xtest('Specifying less than the minimum throws error', () => {
    const getActual = () => takeActionBet(game, 0.5);

    expect(getActual).toThrow("Bet less than amount to player")
  });
  test('Betting the amount to the player, bets that amount', () => {
    game.players[0].currentHand = {
      bet: 1,
      hand: null,
      handStatus: PlayerHandStatus.PREDEAL,
    }
    const expected = clone(game);
    expected.players[game.actionPlayer].stack = 99;
    expected.players[game.actionPlayer].currentHand.bet = 1;

    const actual = takeActionBet(game, 1);

    expect(actual).toEqual(expected);
  });
  test('Betting more than the amount to the player bets that amount', () => {
    game.players[0].currentHand = {
      bet: 1,
      hand: null,
      handStatus: PlayerHandStatus.PREDEAL,
    }
    const expected = clone(game);
    expected.players[game.actionPlayer].stack = 98;
    expected.players[game.actionPlayer].currentHand.bet = 2;

    const actual = takeActionBet(game, 2);

    expect(actual).toEqual(expected)
  });
  test('Betting more than the player has throws error', () => {
    const getActual = () => takeActionBet(game, 1000000);

    expect(getActual).toThrow("You don't have that much")
  });
});
