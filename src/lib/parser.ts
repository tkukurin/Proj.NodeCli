/** User input parser. */

type char = string;

const RE_URL = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

/**
 * State-machine based parser for user queries.
 * Extracts last url from bracketed expression.
 * Escape character is `\`, literally interpreting whatever follows it.
 *
 * NB: use proper states & tokenize+filter approach if more complex rules arise.
 *
 * Example: `[www.url1.com not url www.url2.com]` => yields `www.url2.com`
 * Example: `[www.url1.com not url [www.url2.com]]` => yields `www.url2.com`
 * Example: `[www.1.com] [www.2.com]` => yields `www.1.com` `www.2.com`
 * Example: `\[ www.url1.com \]` => nothing because brackets are escaped.
 */
export class UserQueryParser {
  static parse(s: string): string[] {
    return [...(new UserQueryParser().update(s))];
  }

  #state: Array<char> = [];
  #depth: number = 0;
  #stateEsc: boolean = false;

  *update(s: string): Generator<string> {
    for (let c of s) {
      let url = this.#accumChar(c);
      if (url) yield url;
    }
  }

  #accumChar(c: char): string | undefined {
    const depthPlus = +(!this.#stateEsc && c === '[');
    const depthMinus = +(!this.#stateEsc && c === ']');

    this.#depth += depthPlus;
    if (this.#depth === 0) return undefined;  // early bail if not in brackets

    if (this.#stateEsc || !'[]\\'.includes(c)) {  // skip special chars
      this.#state.push(c);  // accumulate all other chars
    }

    let url = undefined;
    if (this.#stateEsc || c === '\\') {
      this.#stateEsc = !this.#stateEsc;
    } else if (c === ']' && this.#depth === 1) {
      // last url match from whitespace-tokenized lookback between `[` and `]`
      url = this.#state.join('').split(/\s+/).reverse().find(s => RE_URL.test(s));
      this.#state = [];
    }

    this.#depth = Math.max(0, this.#depth - depthMinus);
    return url;
  }
}

export default UserQueryParser.parse;

