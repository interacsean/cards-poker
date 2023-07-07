import { unstyle } from "ansi-colors";
import chalk from 'chalk';
import { dealCards } from "../card-deck/dealCards";
import { Card, newDeck } from "../card-deck/newDeck";
import { removeCard } from "../card-deck/removeCard";
import { shuffle } from "../card-deck/shuffle";
import { tap } from "../util/tap";
import { Game } from "./newGame";
import { PlayerHandStatus } from "./newPlayer";
import { renderBoard } from "./renderBoard";
import { takeBlinds } from "./takeBlinds";
import { nextPlayer } from "./nextPlayer";
import { over, add, set, lensPath } from 'ramda';
import { ValidAction, validateAction } from "./validateAction";
import { takeActionBet } from "./takeActionBet";
import { takeActionCall } from "./takeActionCall";
import { takeActionFold } from "./takeActionFold";

export type Action = "C" | "F" | "K" | number;

type Deps = {
  getUserInput: (prompt: string) => Promise<string>;
  newDeck: typeof newDeck;
  shuffle: typeof shuffle;
  dealCards: typeof dealCards;
  removeCard: typeof removeCard;
  print: (output: string) => void;
};

function takeAction(game: Game, action: ValidAction) {
  return action === 'K' ? game
    : action === 'C' ? takeActionCall(game)
      : action === 'F' ? takeActionFold(game)
        : typeof action === 'number' ? takeActionBet(game, action)
          : null;
}

function getAvailableActions(game: Game) {
  const { actionPlayer } = game;

  const currentBet = game.players.reduce(
    (curMaxBet, player) => Math.max(player.currentHand?.bet ?? 0, curMaxBet),
    0,
  );
  const betToPlayer = currentBet - (game.players[actionPlayer].currentHand?.bet ?? 0);

  // todo: exception to rule: check for Big Blind opportunity to raise

  let descriptions = [], allowedKeys = [], defaultAction = undefined;
  if (betToPlayer === 0) {
    descriptions.push('chec[K/⮐]');
    allowedKeys.push('K');
    allowedKeys.push('');
    descriptions.push('Bet $[#]');
    allowedKeys.push(0);
    defaultAction = 'K';
  } else if (betToPlayer > 0) {
    descriptions.push('[C]all');
    allowedKeys.push('C');
    descriptions.push('Raise-to $[#]');
    allowedKeys.push(0);
  }
  descriptions.push('[F]old');
  allowedKeys.push('F');
  return {
    descriptions,
    allowedKeys,
    defaultAction,
  }
}

function makePlayHandLoop({ getUserInput, print }: Deps) {
  return function playHandLoop(game: Game) {
    return Promise.resolve(game)
      .then(tap((g: Game) => {
        print(renderBoard(g, g.actionPlayer));
        // const { deck, ...curGame } = g;
        // console.log(JSON.stringify(curGame, undefined, '  '));
      }))
      .then(async (g) => {
        const { descriptions, allowedKeys, defaultAction } = getAvailableActions(game);
        const availableActions = descriptions.join(', '); // "chec[K/⮐], [F]old, [C]all, [#]=Bet/Raise"
        console.log({ allowedKeys });
        let actionRaw: string;
        while (!actionRaw) {
          actionRaw = (await getUserInput(`Action's on you (${availableActions}): `)) || defaultAction;
          console.log({ actionRaw });
        }
        // deal with 
        const validated = validateAction(allowedKeys, actionRaw);
        if (!validated[1]) return g;

        const g2 = takeAction(g, validated[0]);

        // check hand is over
        // if hand is over, return
        // todo: exception if somebody is all in but other active players still have chips and are not showing
        const nextPlayerNum = nextPlayer(g2);
        const g3: Game = set(lensPath(["actionPlayer"]), nextPlayerNum, g2)
        if (nextPlayerNum !== null) {
          return playHandLoop(g3)
        }
        return g3;
      })
      .catch(e => {
        console.log(e);
        return;
      });
  };
}

export function makeGameLoop(deps: Deps) {
  const playHandLoop = makePlayHandLoop(deps);
  return function gameLoop(game: Game) {
    const modPlayer = (num: number) => num % game.players.length;
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
            actionPlayer: modPlayer(game.button + 3),
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
        // makeGameLoop(deps)(g);
      });
  };
}
