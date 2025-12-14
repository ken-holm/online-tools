# Gemini Context for tools.holmcc.com

## Project Constraints
*   **Host:** BlueHost (Shared Hosting). No Node.js server. Static files only.
*   **Framework:** React + Vite.
*   **Docs:** Keep all documentation in `docs/` (except `README.md`).

## Deployment
*   Build command: `npm run build`
*   Output dir: `dist/`
*   **Important:** Ensure `.htaccess` is present in `public/` (or root of dist) to handle React Router paths (Fallback to `index.html`).

## User Preferences
*   **Style:** Clean, pleasing to the eye (Tailwind CSS).
*   **Monetization:** Low conversion, subtle (Donation buttons).
