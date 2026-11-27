# Escape Lab — browser edition

Phase 1 first-person WebGL science escape room. No Unreal Engine or installations for students. The earlier native source is preserved on the unreal-prototype branch.

## Local development
Node 22 recommended. Run npm install, npm test, npm run dev. Open the local URL. npm run build creates dist for static hosting (Vercel configuration included).

## Play
WASD or arrows to move; click canvas to capture mouse and look; E to interact; N for evidence; Esc to release pointer. Touch devices use movement buttons, drag to look and Interact. Find the research note in the drawer, restore power by calculating current, use the clue and current to open the security door, then reach the exit terminal. Timer is 15 minutes. All scenery is generated in code; no remote models.

## Status
Phase 1 is a single-player prototype with an original procedural environment. It is not multiplayer yet. Client-side answers are acceptable only for this local prototype; move answer validation and team state to an authoritative backend in Phase 2. No deployment or browser playtest is claimed until verified. GitHub Actions runs rules tests and the Vite build. More detailed models, accessibility alternatives, teacher hosting and curriculum content are planned.
