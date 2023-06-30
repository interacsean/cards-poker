import { Game } from "./newGame";
import { nextPlayer } from "./nextPlayer";
import { clone } from "ramda";
import { game as freshGame } from "./fixtures/game.fixture"
import { PlayerHandStatus } from "./newPlayer";

let game: Game;

describe('nextPlayer', () => {
  beforeEach(() => {
    game = clone(freshGame);
  });
  test('Goes to the next player, without looping from last player to player 0', () => {
    game.actionPlayer = 0;
    game.players[1].currentHand = {
      handStatus: PlayerHandStatus.ACTIVE,
      bet: 0,
      hand: [['A', 'S'], ['A', 'H']]
    }
    const newPlayer = nextPlayer(game);

    expect(newPlayer).toBe(1);
  });

  test('Goes to the next player, without looping from last player to player 0', () => {
    game.actionPlayer = 0;
    game.players[1].currentHand = {
      handStatus: PlayerHandStatus.FOLDED,
      bet: 0,
      hand: [['2', 'S'], [7, 'H']]
    }
    const newPlayer = nextPlayer(game);

    expect(newPlayer).toBe(2);
  });
});
