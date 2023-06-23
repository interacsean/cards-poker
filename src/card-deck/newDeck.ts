const faceCard = (key: number) =>
  key + 1 === 11
    ? "J"
    : key + 1 === 12
    ? "Q"
    : key + 1 === 13
    ? "K"
    : key + 1 === 1
    ? "A"
    : key + 1;

export type Card = [string | number, string];
export type Deck = Card[];

export const newDeck = Array(13)
  .fill("H")
  .map((suit, key) => [faceCard(key), suit] as Card)
  .concat(
    Array(13)
      .fill("C")
      .map((suit, key) => [faceCard(key), suit] as Card)
  )
  .concat(
    Array(13)
      .fill("D")
      .map((suit, key) => [faceCard(key), suit] as Card)
  )
  .concat(
    Array(13)
      .fill("S")
      .map((suit, key) => [faceCard(key), suit] as Card)
  );
