import { Game } from "./newGame";

export type ValidAction = 'K' | 'F' | 'C' | number

function isValidActionBasicCheck(possibleAction: string | number): possibleAction is ValidAction {
  return (typeof possibleAction === 'number') || (['K', 'F', 'C'] as (string | number)[]).includes(possibleAction);
}

export function validateAction(allowedKeys: (string | number)[], actionRaw: string): [ValidAction, true] | [string, false] {

  // is valid input?
  const action = !isNaN(Number(actionRaw)) && actionRaw !== ''
    ? parseFloat(Number(actionRaw).toFixed(2))
    : actionRaw.toUpperCase();
  console.log({ action });

  if (!isValidActionBasicCheck(action)) {
    return [actionRaw, false];
  }

  if ((typeof action === 'number' && !allowedKeys.includes(0)) &&
    (!allowedKeys.includes(action))) {
    return [actionRaw, false]
  }

  return [action, true];
}
