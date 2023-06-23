import { dealCards } from "../card-deck/dealCards";
import { Card, newDeck } from "../card-deck/newDeck";
import { removeCard } from "../card-deck/removeCard";
import { shuffle } from "../card-deck/shuffle";
import { tap } from "../util/tap";
import { Game } from "./newGame";
import { PlayerHandStatus } from "./newPlayer";
import { renderBoard } from "./renderBoard";
import { takeBlinds } from "./takeBlinds";

export type Action = "C" | "F" | "K" | number;

type Deps = {
  getUserInput: (prompt: string) => Promise<string>;
  newDeck: typeof newDeck;
  shuffle: typeof shuffle;
  dealCards: typeof dealCards;
  removeCard: typeof removeCard;
  print: (output: string) => void;
};

function makePlayHandLoop(deps: Deps) {
  return function playHandLoop(game: Game) {
    return Promise.resolve(game)
      .then(tap((g: Game) => deps.print(renderBoard(g, 0))))
      .then(async (g) => {
        const action = await deps.getUserInput("Action: ");
        // take action on game
        console.log({ action });
        return g;
      })
      .then(async (g) => {
        // check hand is over
        // if hand is over, return
        // move action?
        return playHandLoop(g);
        //
      });
  };
}

export function makeGameLoop(deps: Deps) {
  const playHandLoop = makePlayHandLoop(deps);
  return function gameLoop(game: Game) {
    Promise.resolve(game)
      .then((g) => ({
        ...g,
        deck: deps.shuffle(g.deck),
      }))
      .then(takeBlinds)
      .then((g) => {
        return g.players.reduce((game, player, i) => {
          if (player.stack === 0) return game;

          const { cards, deck } = deps.dealCards(game.deck, 2);
          const playerWithCards = {
            ...player,
            currentHand: {
              ...player.currentHand,
              handStatus: PlayerHandStatus.ACTIVE,
              hand: cards as [Card, Card],
            },
          };

          const newPlayers = [...game.players];
          newPlayers[i] = playerWithCards;

          return {
            ...game,
            deck,
            players: newPlayers,
          };
        }, g);
      })
      .then((g) => {
        // play the hand out
        return playHandLoop(g);
      })
      .then((g) => {
        // determine winner
        // distribute bets to winner
        // clear player bets / player cards / PlayerHandStatus
        return g;
      })
      .then((g) => {
        // assess if game is won by a single player, otherwise recurse:
        makeGameLoop(deps)(g);
      });

    // console.log(JSON.stringify(gameHandsDealt, undefined, "  "));
  };
}
