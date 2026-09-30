# DOM2AI UI Capture — V0.1

DOM2AI is a local Manifest V3 Chrome extension that turns the current web UI into compact, AI-friendly semantic snapshots. It is intended to give Copilot, Codex, Claude, Gemini, or a human tester enough context to write locators and automation without first setting up Playwright.

## Install

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this `dom2ai-v0.1` folder.
4. Open or reload a normal web page. A draggable **📸 Capture** button appears at bottom-right.

Click the toolbar icon to open a dedicated DOM2AI window. It stays open while you interact with the source tab, so clicking outside does not dismiss it. Click Capture after each meaningful UI state: base screen, expanded panel, dropdown, autocomplete results, validation message, modal, drawer, or confirmation dialog. Captures accumulate for the source tab. Use the DOM2AI window to preview, copy, download Markdown/JSON, download a screenshot, or clear the session. `Ctrl+Shift+Y` / `Cmd+Shift+Y` captures from the keyboard.

## Architecture

- `src/content/content.js`: Shadow DOM floating control, additive capture session, keyboard-message bridge.
- `src/content/extractor.js`: visibility-aware semantic extraction of controls, landmarks, forms, dialogs, tables, and validation.
- `src/content/snapshot-builder.js`: stable schema wrapper and Markdown renderer.
- `src/background/service-worker.js`: tab-scoped storage and command routing. Content scripts run in eligible popup tabs automatically because Chrome matches every normal web tab/window.
- `src/popup/*`: preview, copy, download, clear/reset.
- `src/shared/schema.js`: shared constants and privacy helpers.

## Snapshot example

```markdown
# UI Snapshot 2
- URL: https://example.test/orders/42
- Title: Order 42
## Dialogs and overlays
### 1. Confirm shipment
- Role: dialog
- Locator hints: `role=dialog[name="Confirm shipment"]`
```

JSON contains the same metadata plus structured `page.landmarks`, `controls`, `dialogs`, `tables`, and `validation` arrays. Each interactive element includes its accessible name, role, useful attributes, state, and locator candidate hints.

## Permissions and privacy

`<all_urls>` is needed to inject the capture control into arbitrary application pages and app-opened popup tabs. `storage` keeps snapshots local to the browser profile; `downloads` exports a file; `tabs` identifies the active tab. No network requests, API keys, backend, database, analytics, or login are used. Password-like fields, hidden fields, payment fields, and names containing password/secret/token/SSN/card are redacted by default.

## Limitations and roadmap

V0.1 intentionally captures the top document only. Cross-origin iframes, browser chrome, extension pages, closed shadow roots, canvas-only UIs, and native OS dialogs are not inspectable from a normal content script. Open shadow roots and app-specific iframe support can be added with targeted frame messaging. Future work: richer DOM hierarchy, configurable redaction, selector confidence scoring, screenshot association, import/export sessions, and optional integrations with test runners or AI providers.

## Validation

The project is plain JavaScript with no build step. Validate by loading it unpacked, opening a test page, exercising a modal/dropdown/form state, and checking both popup formats. A ZIP distribution is provided alongside this folder.
