import { Card, Deck } from "../card-deck/newDeck";
import { removeCard } from "../card-deck/removeCard";
import { Player } from "./newPlayer";

// needs DI
export function setPlayersHand(
  player: Player,
  cards: [Card, Card],
  deck?: Deck
) {
  const deck1 = deck ? removeCard(deck, cards[0]) : undefined;
  const deck2 = deck1 ? removeCard(deck1, cards[1]) : undefined;

  const playerWithHand = {
    ...player,
    currentHand: {
      ...player.currentHand,
      hand: cards,
    },
  };

  return {
    player: playerWithHand,
    deck: deck2,
  };
}
