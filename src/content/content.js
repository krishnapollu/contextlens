const VERSION = "dom2ai.snapshot.v0.1";
const SENSITIVE_TYPES = new Set(["password", "hidden"]);
const INTERACTIVE = "a,button,input,select,textarea,[role='button'],[role='link'],[role='checkbox'],[role='radio'],[role='tab'],[role='menuitem'],[contenteditable='true'],summary";
const cleanText = (value, max = 240) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
const isSensitive = el => SENSITIVE_TYPES.has((el.type || "").toLowerCase()) || el.autocomplete === "cc-number" || /pass(word)?|secret|token|ssn|credit.?card/i.test(`${el.name} ${el.id} ${el.getAttribute("aria-label") || ""}`);
const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
const nameOf = el => cleanText(el.getAttribute("aria-label") || el.labels?.[0]?.innerText || el.innerText || el.placeholder || el.title || el.value);
const attrs = el => Object.fromEntries(["id","name","type","role","href","placeholder","title","data-testid","aria-expanded","aria-checked","aria-selected","aria-invalid","autocomplete"].map(k => [k, el.getAttribute(k)]).filter(([,v]) => v !== null));
const locatorHints = el => { const a = attrs(el), hints = []; if (a["data-testid"]) hints.push(`[data-testid="${a["data-testid"]}"]`); if (a.id && /^[A-Za-z][\w-]{2,50}$/.test(a.id)) hints.push(`#${CSS.escape(a.id)}`); if (a.name) hints.push(`${el.tagName.toLowerCase()}[name="${a.name}"]`); return hints.slice(0, 4); };
const node = el => ({tag: el.tagName.toLowerCase(), text: cleanText(el.innerText, 180), name: nameOf(el), role: el.getAttribute("role") || undefined, attributes: attrs(el), locatorHints: locatorHints(el)});
function interactive(root) { return [...root.querySelectorAll(INTERACTIVE)].filter(visible).map((el, i) => ({index: i + 1, ...node(el), value: isSensitive(el) ? "[REDACTED]" : cleanText(el.value, 120), state: {disabled: !!el.disabled, checked: !!el.checked, expanded: el.getAttribute("aria-expanded"), invalid: el.getAttribute("aria-invalid") === "true" || !!el.closest("form")?.querySelector(":invalid")}})); }
function dialogs(root) { return [...root.querySelectorAll("dialog,[role=dialog],[role=alertdialog],[aria-modal=true]")].filter(visible).map(el => ({...node(el), heading: cleanText(el.querySelector("h1,h2,h3,[role=heading]")?.innerText), controls: interactive(el)})); }
function extractSnapshot() { return {metadata: {url: location.href, title: document.title, origin: location.origin, capturedAt: new Date().toISOString(), viewport: {width: innerWidth, height: innerHeight}}, page: {heading: cleanText(document.querySelector("h1")?.innerText), controls: interactive(document).slice(0, 150), dialogs: dialogs(document), validation: [...document.querySelectorAll(":invalid")].filter(visible).slice(0, 30).map(el => ({...node(el), message: el.validationMessage}))}}; }
const buildSnapshot = (capture, sequence) => ({schema: VERSION, sequence, ...capture});
let snapshots = [];
function capture(){const s=buildSnapshot(extractSnapshot(),1);snapshots=[s];chrome.runtime.sendMessage({type:"SNAPSHOT_ADDED",snapshot:s,snapshots});}
chrome.runtime.onMessage.addListener((m, sender, sendResponse)=>{if(m.type==="CAPTURE"){capture();sendResponse({ok:true});} if(m.type==="CLEAR"){snapshots=[];sendResponse({ok:true});} return true;});
chrome.runtime.sendMessage({type:"CONTENT_READY"});
