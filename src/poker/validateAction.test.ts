import { Game } from "./newGame";
import { nextPlayer } from "./nextPlayer";
import { clone } from "ramda";
import { game as freshGame } from "./fixtures/game.fixture"
import { validateAction } from "./validateAction";

let game: Game;

describe('validateAction', () => {
  beforeEach(() => {
    game = clone(freshGame);
  });
  test('Validate C', () => {
    const actual = validateAction(game, "C");

    // todo: ignores check requirements
    expect(actual).toEqual(["C", true])
  });
  test('Validate F', () => {
    const actual = validateAction(game, "F");

    expect(actual).toEqual(["F", true])
  });
  test('Validate K', () => {
    const actual = validateAction(game, "K");

    expect(actual).toEqual(["K", true])
  });
  test('Validate c - lowercase', () => {
    const actual = validateAction(game, "c");

    expect(actual).toEqual(["C", true])
  });
  test('Validate return', () => {
    const actual = validateAction(game, "5");

    expect(actual).toEqual([5, true])
  });

});
