---
name: testing-shopping-app
description: Run this shopping app locally with full static-asset support and exercise the hidden admin inventory flow.
---

# Testing the shopping app

## Devin Secrets Needed

- None. Set a temporary non-secret `VITE_ADMIN_PASSWORD` for each local admin test.

## Local setup

- Use the repository's Node version or Node 24 and run `npm install` from the repository root.
- Start the full Express/Vite stack with `VITE_ADMIN_PASSWORD=<temporary-value> PORT=5000 npm run dev`.
- Do not use `npm run dev:client` for visual testing: it skips the Express `/attached_assets` middleware, so catalog image URLs fall through to HTML and render as broken images.
- Confirm one known asset returns an image MIME type before recording, for example `/attached_assets/generated_images/oppo%204-128%20icy%20blue.png`.

## Admin inventory testing

- Admin entry is intentionally hidden; open `/admin` or `/admin/inventory` directly.
- Inventory persists in `localStorage`, while the authenticated admin flag persists in `sessionStorage`.
- Use a fresh origin or clear site storage before a baseline import test; otherwise prior inventory and cart data will affect metrics.
- Downloads are generated client-side in the browser. Repeated downloads receive numeric suffixes, so validate the newest file by modification time.
