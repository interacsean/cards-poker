import { Game } from "./newGame";
import { clone } from "ramda";
import { game as freshGame } from "./fixtures/game.fixture"
import { takeActionCall } from "./takeActionCall";
import { PlayerHandStatus } from "./newPlayer";

let game: Game;

describe('takeActionCall', () => {
  beforeEach(() => {
    game = clone(freshGame);
    game.players[0].currentHand = {
      bet: 0,
      hand: null,
      handStatus: PlayerHandStatus.PREDEAL
    };
    game.players[1].currentHand = {
      bet: 0,
      hand: null,
      handStatus: PlayerHandStatus.PREDEAL
    };
  });
  test("When there's an amount to the player within stack, call", () => {
    game.players[0].currentHand.bet = 1;

    const expected = clone(game);
    expected.players[game.actionPlayer].currentHand.bet = 1;
    expected.players[game.actionPlayer].stack = 99;

    const actual = takeActionCall(game);

    expect(actual).toEqual(expected);
  });

  test("When there's nothing to the player, check", () => {
    game.players[1].currentHand.bet = 0;

    const expected = clone(game);
    expected.players[game.actionPlayer].currentHand.bet = 0;

    const actual = takeActionCall(game);

    expect(actual).toEqual(expected);

  });

  test("When there's an amount to the player that exceeds player's stack, go all in", () => {
    game.players[0].currentHand.bet = 105;

    const expected = clone(game);
    expected.players[game.actionPlayer].currentHand.bet = 100;
    expected.players[game.actionPlayer].stack = 0;

    const actual = takeActionCall(game);

    expect(actual).toEqual(expected);
  });
});
