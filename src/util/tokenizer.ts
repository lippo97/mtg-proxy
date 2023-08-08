// type Token =
// | RichToken
// | { type: "loyalty", value: number, effect: RichToken[] }

// type RichToken = 
// | BaseToken
// | { type: "reminder", value: BaseToken[] }

// type BaseToken = 
// | { type: "newline" }
// | { type: "text", value: string }
// | { type: "mana", value: Color }

const newlineRegex = /\n/;
const openParenRegex = /\(/;
const closeParenRegex = /\)/;
const openBraceRegex = /{/;
const closeBraceRegex = /}/;
const colonRegex = /:/
const commaRegex = /,/

export type Token = 
| { type: 'newline' }
| { type: 'openParen' }
| { type: 'closeParen' }
| { type: 'colon' }
| { type: 'comma' }
| { type: 'eof' }
| { type: 'symbol', value: string }
| { type: 'number', value: number }
| { type: 'text', value: string }

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];

  let currentToken = '';

  function flushCurrentToken() {
    const numberRegex = /^[-+]?\d+$/;
    const token = currentToken.trim();
    currentToken = '';
    if (token.length > 0) {
      if (token.match(numberRegex)) {
        tokens.push({ type: 'number', value: parseInt(token) });
      }
      else {
        tokens.push({ type: 'text', value: token });
      }
    }
  }

  for (const char of input) {
    if (char.match(newlineRegex)) {
      flushCurrentToken();
      tokens.push({ type: 'newline' });
    } else if (char.match(openParenRegex)) {
      flushCurrentToken();
      tokens.push({ type: 'openParen' });
    } else if (char.match(closeParenRegex)) {
      flushCurrentToken();
      tokens.push({ type: 'closeParen' });
    } else if (char.match(openBraceRegex)) {
      flushCurrentToken();
      currentToken = '';
    } else if (char.match(closeBraceRegex)) {
      tokens.push({ type: 'symbol', value: currentToken });
      currentToken = '';
    } else if (char.match(colonRegex)) {
      flushCurrentToken();
      tokens.push({ type: 'colon' });
    } else if (char.match(commaRegex)) {
      flushCurrentToken();
      tokens.push({ type: 'comma' });
    } else {
      // replace U+2212 with the more common dash '-'
      if (char === '−') {
        currentToken += '-';
      } else {
        currentToken += char;
      }
    }
  }
  flushCurrentToken();
  tokens.push({ type: 'eof' });

  return tokens;
}