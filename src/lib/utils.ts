import {createHmac} from 'crypto';
import normalizeUrl from 'normalize-url';

type FilterFn = (a: any) => boolean;

/** Filter function to discard duplicates from sequential calls. */
export function uniq(): FilterFn {
  const seen = new Set();
  return (x: any) => {
    const isSeen = seen.has(x);
    seen.add(x);
    return !isSeen;
  }
}

export function hash(s: string, salt: string): string {
  return createHmac('sha256', salt).update(s).digest('hex');
}

export const urlNorm = (url: string): string => normalizeUrl(url);

