import { dealCards } from "./card-deck/dealCards";
import { Card, Deck, newDeck } from "./card-deck/newDeck";
import { removeCard } from "./card-deck/removeCard";
import { shuffle } from "./card-deck/shuffle";
import { getUserInput } from "./cli/getUserInput";
import { print } from "./cli/print";
import { makeDealFlop } from "./poker/dealFlop";
import { makeDealHand } from "./poker/dealHand";
import { makeDealTurnRiver } from "./poker/dealTurnRiver";
import { makeInitGame } from "./poker/initGame";
import { newPlayer, Player, PlayerHandStatus } from "./poker/newPlayer";
import { setPlayersHand } from "./poker/setPlayersHand";

type Results = Record<string, number>;

interface MonteCarloSimulation {
  initialResults: () => Results;
  setup: (
    deck: Deck,
    players: Player[]
  ) => { communityCards: Card[]; players: Player[]; deck: Deck };
  run: (
    results: Results,
    communityCards: Card[],
    players: Player[],
    deck: Deck
  ) => Results;
}

const dealHand = makeDealHand({ dealCards });
const dealFlop = makeDealFlop({ dealCards });
const dealTurnRiver = makeDealTurnRiver({ dealCards });

/**
 * Given you have an Ace, what are the chances of hitting a pair on the flop
 */
const simulation: MonteCarloSimulation = {
  initialResults: () => ({
    // hitsOnFlop: 0,
    // hitsOnTurn: 0,
    // hitsOnRiver: 0,
    overCardOnFlop: 0,
    misses: 0,
  }),
  setup: (deck: Deck, players: Player[]) => {
    const activePlayerHand: [Card, Card] = [
      ["Q", "S"],
      [2, "C"],
    ];
    const deck1 = shuffle(deck);
    const { player: playerWithHand, deck: deck2 } = setPlayersHand(
      players[0],
      activePlayerHand,
      deck1
    );

    players[0] = playerWithHand;

    return {
      communityCards: [],
      players,
      deck: deck2,
    };
  },
  run: (
    results: ReturnType<MonteCarloSimulation["initialResults"]>,
    communityCards: Card[],
    players: Player[],
    deck: Deck
  ) => {
    // fairly sure this is superfluous
    const { cards: otherPlayerCards, deck: deck1 } = dealHand(shuffle(deck));

    const { cards: communityCardsPostFlop, deck: deck2 } = dealFlop(deck1);

    const overCards: (number | string)[] = ["K", "A"];
    const overCardOnFlop = communityCardsPostFlop.find((card) =>
      overCards.includes(card[0])
    );

    // const hitOnFlop = communityCardsPostFlop.find(
    //   (comCard) => comCard[0] === players[0].currentHand.hand[0][0]
    // );

    // const { cards: communityCardsPostTurn, deck: deck3 } = dealTurnRiver(
    //   communityCardsPostFlop,
    //   deck2
    // );
    // const hitOnTurn =
    //   communityCardsPostTurn[3][0] === players[0].currentHand.hand[0][0];

    // const { cards: communityCardsPostRiver, deck: deck4 } = dealTurnRiver(
    //   communityCardsPostTurn,
    //   deck3
    // );
    // const hitOnRiver =
    //   communityCardsPostRiver[4][0] === players[0].currentHand.hand[0][0];

    return {
      overCardOnFlop: results.overCardOnFlop + (!!overCardOnFlop ? 1 : 0),
      // hitsOnFlop: results.hitsOnFlop + (!!hitOnFlop ? 1 : 0),
      // hitsOnTurn: results.hitsOnTurn + (!!hitOnTurn ? 1 : 0),
      // hitsOnRiver: results.hitsOnRiver + (!!hitOnRiver ? 1 : 0),
      misses: results.misses + (!overCardOnFlop ? 1 : 0),
      // (!hitOnFlop && !hitOnTurn && !hitOnRiver ? 1 : 0),
    };
  },
};

function runMonteCarlo(sim: MonteCarloSimulation) {
  const freshDeck = [...newDeck];
  const iterations = 100000; // todo
  const numPlayers = 3; // todo
  const freshPlayers = Array(numPlayers)
    .fill(null)
    .map((_, i) => newPlayer(`Player ${i + 1}`));

  let results = sim.initialResults();
  let { communityCards, players, deck } = sim.setup(freshDeck, freshPlayers);

  let i = 0;
  while (i < iterations) {
    const newResults = sim.run(results, communityCards, players, deck);

    results = {
      ...newResults,
    };
    i++;
  }
  console.log(i);
  return results;
}

console.log(runMonteCarlo(simulation));
