export const VERSION = "dom2ai.snapshot.v0.1";
export const SENSITIVE_TYPES = new Set(["password", "hidden"]);
export const INTERACTIVE = "a,button,input,select,textarea,[role='button'],[role='link'],[role='checkbox'],[role='radio'],[role='tab'],[role='menuitem'],[contenteditable='true'],summary";
export const cleanText = (value, max = 240) => String(value || "").replace(/\\s+/g, " ").trim().slice(0, max);
export const isSensitive = el => SENSITIVE_TYPES.has((el.type || "").toLowerCase()) || el.autocomplete === "cc-number" || /pass(word)?|secret|token|ssn|credit.?card/i.test(`${el.name} ${el.id} ${el.getAttribute("aria-label") || ""}`);
