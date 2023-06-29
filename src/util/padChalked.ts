import { unstyle } from 'ansi-colors';

export const padChalkedStart = (str: string, targetLength: number, chr: string = " ") => {
  const length = unstyle(str).length;
  return length < targetLength ? `${Array(targetLength - length).fill(" ").join("")}${str}` : str;
}

export const padChalkedEnd = (str: string, targetLength: number, chr: string = " ") => {
  const length = unstyle(str).length;
  return length < targetLength ? `${str}${Array(targetLength - length).fill(" ").join("")}` : str;
}
