# Escape Lab — Unreal Engine prototype

Phase 1 source for a first-person science escape room, targeting Unreal Engine 5.6 with C++. Native single-player prototype; multiplayer and browser streaming are not implemented.

## Run locally (Windows)

1. Install Unreal Engine 5.6 from Epic Games Launcher and Visual Studio 2022 with Game development with C++ and a Windows SDK.
2. Clone this repository, right-click EscapeLab.uproject and Generate Visual Studio project files.
3. Build EscapeLabEditor (Development Editor / Win64), open EscapeLab.uproject, then Play. The engine Entry map is configured as a bootstrap map; the game mode constructs the room at runtime. If the editor cannot open Entry directly, create and save an empty level and ensure EscapeGameMode is selected in World Settings before Play.
4. Use WASD or arrows, mouse to look, E or left click to interact, Space to jump. Stop and restart Play to reset.

## Phase 1 prototype

- Procedural blockout lab with collision, lighting, first-person camera and movement.
- Raycast interaction, animated drawer and door, collectable note, breaker, exit terminal, inventory/status HUD.
- The first escape loop requires collecting a clue and restoring power before accessing the exit.
- No downloaded assets, external game services or paid packages.

## Verification status

The source is committed but has not been compiled or play-tested in Unreal Editor. No packaged build or browser deployment exists. Touch controls, production art, multiplayer, actual scientific puzzle content and teacher tools remain future work.

See docs/phase1-test.md for manual acceptance checks.

## Web delivery

Unreal Pixel Streaming requires a packaged executable, compatible host/GPU and signalling/WebRTC infrastructure. Independent student cameras need independent rendered views; load and cost must be evaluated before committing to classroom-scale streaming. Vercel may host a web portal but not the native renderer. No infrastructure has been provisioned.
