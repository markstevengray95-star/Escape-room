# Blender asset pipeline
1. Pull the latest Escape-room main branch to your Windows computer in GitHub Desktop.
2. Double-click **Generate Blender Assets.bat** in the repository root. The launcher searches PATH and the normal Blender Foundation installation directory. For another location set BLENDER_EXE to the full blender.exe path.
3. Wait for Blender to finish; the console should print SUCCESS: 12 assets. Edit the generated .blend source files in blender/generated if desired. They are ignored by Git to keep the project small.
4. Check public/models/lab: 12 .glb files and manifest.json. In GitHub Desktop commit these generated files and push to origin.
5. Run npm install and npm run dev to inspect Laboratory Lockdown. The HUD displays the number of Blender model instances loaded. Other missions retain their existing themed assets. Missing or invalid exports automatically fall back to procedural models.
The Blender source is reproducible Python, no third-party artwork or downloads. The assets are standalone original PBR meshes, not photorealistic scanned models. The game uses metre-based dimensions and collision remains authoritative. Existing functional equipment interfaces and door logic are unchanged. Generated .blend files can be opened individually; do not distribute teacher answer data with assets.
For macOS/Linux: blender --background --factory-startup --python-exit-code 1 --python blender/generate_lab.py
