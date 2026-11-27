# Escape Lab — browser edition

Phase 1 first-person WebGL science escape room. No Unreal Engine or installations for students. The earlier native source is preserved on the unreal-prototype branch.

## Local development
Node 22 recommended. Run npm install, npm test, npm run dev. Open the local URL. npm run build creates dist for static hosting (Vercel configuration included).

## Play
WASD or arrows to move; click canvas to capture mouse and look; E to interact; N for evidence; Esc to release pointer. Touch devices use movement buttons, drag to look and Interact. Find the research note in the drawer, restore power by calculating current, use the clue and current to open the security door, then reach the exit terminal. Timer is 30 minutes. All scenery is generated in code; no remote models.

## Status
Phase 1 introduced the single-player prototype and procedural environment; Phases 2–5 add multiplayer and curriculum missions. Solo practice still uses client-side validation. No deployment or browser playtest is claimed until verified. GitHub Actions runs rules tests and the Vite build. More detailed models, accessibility alternatives, teacher hosting and curriculum content are planned.

## Phase 2 classroom multiplayer
Host a classroom, choose 2–5 students per team, share the six-digit PIN and start the game once students join. Each team has isolated shared clues, a random electrical puzzle, synchronized player avatars, server-controlled progress and timer. Reconnect using the same browser tab/session storage. Teacher dashboard shows team progress and contributions. No email or password required; teacher controls use a separate random session token.

Run npm install, npm test, npm run dev for local testing. For LAN/production run npm run build then npm start; the Node server hosts both the frontend and API. It needs a persistent single Node process (e.g. a suitable Railway service); static Vercel hosting supports solo only. No live service is provisioned. Rooms are held in memory and expire after four hours; a restart loses them. Polling runs approximately every 350 ms; classroom-scale load, browser interactions, accessibility and security review remain pending. Server checks team membership, approximate movement and interaction distance; it is not a hardened anti-cheat system. No Supabase project is modified. No chat or long-term student data storage.

## Phase 3 interactive science stations
Build the series circuit using drag-and-drop or select controls, focus a simulated microscope, test an unknown with indicator, balance a lever, measure mass and displacement, balance a reaction and interpret a decay graph. Six new stations appear across the two areas; their completed evidence is shared per team. Exit now requires all six investigations as well as the security code. These are lightweight instrument simulations in overlays, not full physics simulations. The solo client includes validation logic; multiplayer validates submitted evidence on the server, but shared puzzle definitions remain discoverable in client source. Browser and classroom testing are still required.

## Phase 4: six-room facility
30-minute mission, shared corridor, subject rooms, stores, locked analysis and control rooms, 12 science tasks (including circuit), 16 evidence milestones. Collect storage note, restore power, unlock analysis with biology/chemistry evidence, recover archive digit, complete every investigation, and enter the final code in the control room. Shared geometry drives client/server collisions. Original procedural blockout and simplified instrument panels; actual browser rendering and classroom load still need testing.

## Phase 5: curriculum and custom question modes
73 original starter questions, grouped by KS3 / AQA GCSE Combined and separate science Foundation/Higher levels, subject and topic. Teacher-hosted curriculum mode substitutes selected question terminals for the practical investigations. Up to 11 unique questions per team; narrow pools produce fewer active terminals with gates adjusted accordingly. Classic mode preserves all 12 original tasks. Custom mode accepts one question per line: question | correct | distractor 1 | distractor 2 | distractor 3 | explanation. The original circuit/security-code sequence remains in all modes. The curriculum bank is a starter sample, not exhaustive specification coverage. Keys are server-side for curriculum/custom modes; solo remains classic. No live browser testing yet.
AQA topic reference: https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/specification-at-a-glance

## Phase 6 teacher controls
Configure 15/30/45/60-minute sessions; manually move students before start; pause, resume, extend by five minutes and send a private team hint. Teacher dashboard includes team floor plan, online status, contributions, science attempt accuracy and topics with incorrect attempts; export CSV with formula-injection protection. Smartboard opens using a separate read-only capability URL, shows team progress without student names, and can hide ranking order. Reports are session-only and accuracy is based on submitted attempts, not GCSE grades. No production deployment or browser UI test claimed.
