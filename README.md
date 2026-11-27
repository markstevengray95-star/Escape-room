# Escape Lab — browser edition

Phase 1 first-person WebGL science escape room. No Unreal Engine or installations for students. The earlier native source is preserved on the unreal-prototype branch.

## Local development
Node 22 recommended. Run npm install, npm test, npm run dev. Open the local URL. npm run build creates dist for static hosting (Vercel configuration included).

## Play
WASD or arrows to move; click canvas to capture mouse and look; E to interact; N for evidence; Esc to release pointer. Touch devices use movement buttons, drag to look and Interact. Find the research note in the drawer, restore power by calculating current, use the clue and current to open the security door, then reach the exit terminal. Timer is 15 minutes. All scenery is generated in code; no remote models.

## Status
Phase 1 is a single-player prototype with an original procedural environment. It is not multiplayer yet. Client-side answers are acceptable only for this local prototype; move answer validation and team state to an authoritative backend in Phase 2. No deployment or browser playtest is claimed until verified. GitHub Actions runs rules tests and the Vite build. More detailed models, accessibility alternatives, teacher hosting and curriculum content are planned.

## Phase 2 classroom multiplayer
Host a classroom, choose 2–5 students per team, share the six-digit PIN and start the game once students join. Each team has isolated shared clues, a random electrical puzzle, synchronized player avatars, server-controlled progress and timer. Reconnect using the same browser tab/session storage. Teacher dashboard shows team progress and contributions. No email or password required; teacher controls use a separate random session token.

Run npm install, npm test, npm run dev for local testing. For LAN/production run npm run build then npm start; the Node server hosts both the frontend and API. It needs a persistent single Node process (e.g. a suitable Railway service); static Vercel hosting supports solo only. No live service is provisioned. Rooms are held in memory and expire after four hours; a restart loses them. Polling runs approximately every 350 ms; classroom-scale load, browser interactions, accessibility and security review remain pending. Server checks team membership, approximate movement and interaction distance; it is not a hardened anti-cheat system. No Supabase project is modified. No chat or long-term student data storage.
