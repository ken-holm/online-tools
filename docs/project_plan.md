# Tools.holmcc.com Development Plan

## 1. Architecture & Tech Stack
*   **Framework:** React (via Vite)
*   **Styling:** Tailwind CSS
*   **Routing:** React Router
*   **Deployment:** Static build (`dist/`) uploaded to BlueHost (shared). 
    *   *Note:* Requires `.htaccess` for client-side routing.

## 2. Initial Tool Set
1.  **Current Time:** Digital display, 12/24h, Date. (Completed)
2.  **Countdown Timer:** Target date/time, visual progress. (In Progress)
3.  **Timer:** Standard countdown with alarm. (Completed)
4.  **Message Tab:** Large text display ("Billboard" mode). (Completed)

## 3. Monetization (Low Conversion)
*   "Buy me a Coffee" button.
*   Affiliate links in footer (hosting, gear).
*   Potential non-intrusive ad (later).

## 4. Completed Tools
*   Pomodoro Timer (Completed)
*   Metronome (Completed)
*   Breathing Box (Completed)
*   Prompter (Completed)
*   Stopwatch (Completed)
*   World Clock (Completed)
*   Simple Calculator (Completed)
*   Daily Counter (Completed)

## 5. Monetization (Completed)
*   "Buy me a Coffee" button.
*   Affiliate links in footer.

## 6. Phase 2: Enhancements
*   **PWA (Progressive Web App):** Installable, app-like experience. (Completed)
*   **Offline Support:** Work without internet connection. (Completed)
*   **Shareable URLs:** Pre-configure tools via link parameters. (Completed)
*   **Analytics:** Privacy-friendly usage tracking. (Completed)
*   **Sound Library:** Better audio assets for alarms/ticks. (Completed)

## 7. Phase 3: Additional Tools
*   **Password Generator:** Secure, random password creator. (Completed)
*   **QR Code Generator:** Create QR codes for text/URLs. (Completed)
*   **Text Utilities:** Word count, case converter. (Completed)
*   **Unit Converter:** Length, weight, temperature, etc. (Completed)
*   **JSON Formatter:** Prettify and validate JSON. (Completed)
*   **Markdown Viewer:** Render Markdown to HTML. (Completed)

## 8. Phase 4: Additional Tools
*   **IP Subnet Calculator:** Calculate network ranges, broadcast addresses, etc.
*   **Bandwidth Calculator:** Calculate download times for file sizes at different speeds.
*   **URL Encoder/Decoder:** Useful for debugging query strings.
*   **Base64 Encoder/Decoder:** Frequently used for authentication headers or data URIs.
*   **IPv4/IPv6 Validator:** Regex-based validation to check if an IP address is valid.
*   **MAC Address OUI Lookup:** (If you include a static JSON database) Identify the manufacturer of a network device.
*   **JWT Debugger:** Decode and inspect JSON Web Tokens (common in network auth).

## 9. Directory Structure
*   `docs/` - All documentation (except README.md).
*   `src/` - Application source code.
*   `public/` - Static assets.
