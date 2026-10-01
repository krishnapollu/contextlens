# ContextLens release checklist

- [ ] Add PNG icons at 16, 32, 48, and 128 pixels and reference them in `manifest.json`.
- [ ] Replace the placeholder contact in `PRIVACY.md` with a monitored public address.
- [ ] Host `PRIVACY.md` at a stable HTTPS URL for the Chrome Web Store listing.
- [ ] Test capture on a normal page, SPA, modal, dropdown, validation state, popup window, same-origin iframe, and cross-origin iframe.
- [ ] Test Markdown/JSON export, screenshot export, copy actions, clear, recapture replacement, and filename generation.
- [ ] Test locator picker on unique IDs, repeated names, tables, icon-only controls, dialogs, and nested frames.
- [ ] Verify sensitive values are redacted before sharing an export.
- [ ] Load the exact release folder in Chrome and verify the displayed version.
- [ ] Create a tagged release and upload as Unlisted for beta review before Public distribution.
