import { Token } from "./tokenizer";

export type ParserResult = (
	| { type: "planeswalker"; loyalty: number; value: ParsedToken[] }
	| { type: "normal"; loyalty?: never; value: ParsedToken[] }
	| { type: "keyword"; loyalty?: never; value: ParsedToken[], explanation: ParsedToken[] }
	| { type: "activate"; loyalty?: never; cost: ParsedToken[], value: ParsedToken[] }
	| { type: "reminder"; loyalty?: never; value: ParsedToken[] }
)[];

export type ParsedToken =
	| { type: "symbol"; value: string }
	| { type: "text"; value: string }
	| { type: "comma" };

type FSM = "S0" | "PW0" | "PW1" | "R" | "T" | "A";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function parse(tokens: Token[]): ParserResult {
	class ParseError extends Error {
		constructor(token: Token, expected: Token["type"] | Token["type"][] = []) {
			let msg = `ParseError: ${token.type}`;
			if (expected) {
				const _expected = typeof expected === "string" ? [expected] : expected;
				const s =
					"{ " +
					Object.entries(token)
						.map(([k, v]) => `${k} = ${v}`)
						.join(", ") +
					" }";
				msg += `, expected ${_expected.join(", ")}, on ${s}, state = ${state}`;
			}
			super(msg);
		}
	}
	const result: ParserResult = [];

	let state: FSM = "S0";

	const PW: { loyalty?: number; value: any[] } = { value: [] };
	const R: { value: ParsedToken[] } = { value: [] };
	const T: { value: ParsedToken[] } = { value: [] };
	const A: { cost: ParsedToken[], value: ParsedToken[] } = { cost: [], value: [] };

	function flushPW() {
		result.push({
			type: "planeswalker",
			loyalty: PW.loyalty!,
			value: PW.value,
		});
	}

	function flushR() {
		const last = result.length > 0 ? result[result.length - 1] : undefined;
		if (last && last.type === 'normal') {
			result[result.length - 1] = { type: 'keyword', value: last.value, explanation: R.value };
		} else {
			result.push({ type: "reminder", value: R.value });
		}
	}

	function flushT() {
		result.push({ type: "normal", value: T.value });
	}

	function flushA() {
		result.push({ type: "activate", cost: A.cost.filter(x => x.type !== 'comma'), value: A.value });
	}

	for (const token of tokens) {
		if (state === "S0") {
			if (token.type === "number") {
				state = "PW0";
				PW.loyalty = token.value;
			} else if (token.type === "openParen") {
				state = "R";
				R.value = [];
			} else if (token.type === "text" || token.type === 'symbol') {
				state = "T";
				T.value = [token];
			} else if (token.type === "newline") {
				/* empty */
			} else {
				throw new ParseError(token, ["number", "openParen", "text", "newline"]);
			}
		} else if (state === "PW0") {
			if (token.type === "colon") {
				state = "PW1";
				PW.value = [];
			} else {
				throw new ParseError(token, "colon");
			}
		} else if (state === "PW1") {
			if (token.type === "text" || token.type === "symbol" || token.type === 'comma') {
				PW.value.push(token);
			} else if (token.type === "newline" || token.type === "eof") {
				flushPW();
				state = "S0";
			} else {
				throw new ParseError(token, ["text", "symbol", "newline"]);
			}
		} else if (state === "R") {
			if (token.type === "closeParen") {
				flushR();
				state = "S0";
			} else if (token.type === "text" || token.type === "symbol" || token.type === 'comma') {
				R.value.push(token);
			} else {
				throw new ParseError(token, ["closeParen", "text", "symbol"]);
			}
		} else if (state === "T") {
			if (
				token.type === "text" ||
				token.type === "symbol" ||
				token.type === "comma"
			) {
				T.value.push(token);
			} else if (token.type === "newline" || token.type === "eof") {
				flushT();
				state = "S0";
			} else if (token.type === 'openParen') {
				flushT();
				state = 'R';
				R.value = [];
			} else if (token.type === "colon") {
				A.cost = [...T.value];
				A.value = [];
				state = "A";
			} else {
				throw new ParseError(token, ["text", "symbol", "newline"]);
			}
		} else if (state === 'A') {
			if (token.type === 'text' || token.type === 'symbol' || token.type === 'comma') {
				A.value.push(token);
			} else if (token.type === 'newline' || token.type === 'eof') {
				flushA();
				state = "S0";
			} else {
				throw new ParseError(token, ['text', 'symbol', 'comma', 'newline', 'eof']);
			}
		}
	}

	return result;
}
