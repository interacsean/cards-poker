import { Game } from "./newGame";

export type ValidAction = 'K' | 'F' | 'C' | number

function isValidAction(possibleAction: string | number): possibleAction is ValidAction {
  return (typeof possibleAction === 'number') || (['K', 'F', 'C'] as (string | number)[]).includes(possibleAction);
}

export function validateAction(game: Game, actionRaw: string): [ValidAction, true] | [string, false] {

  // is valid input?
  const action = !isNaN(Number(actionRaw)) && actionRaw !== ''
    ? parseFloat(Number(actionRaw).toFixed(2))
    : actionRaw.toUpperCase();

  if (!isValidAction(action)) {
    return [actionRaw, false];
  }

  // is valid for the game
  // todo: validation

  // bet is at least big blind


  return [action, true];
}
