import { Card } from "../card-deck/newDeck";

export enum PlayerHandStatus {
  PREDEAL = "PREDEAL",
  ACTIVE = "ACTIVE",
  FOLDED = "FOLDED",
}

export type Player = {
  name: string;
  currentHand: null | {
    hand: [Card, Card] | null;
    handStatus: PlayerHandStatus; // ?
    bet: number;
  };
  stack: number;
};

export function newPlayer(name: string, stack: number = 100): Player {
  return {
    name,
    stack,
    currentHand: null,
  };
}
