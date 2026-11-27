"""Verify exported files without requiring Blender."""
import sys
import json
import struct
import hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/"public"/"models"/"lab"
EXPECTED={"microscope","indicator","osmosis","separation","moments","density","equation","graph","variables","energy","spectrum","bench"}

def main():
    global ROOT, EXPECTED
    if "--architecture" in sys.argv:
        ROOT=ROOT.parent/"lab-architecture"
        EXPECTED={"security-door","storage-cabinet","fume-hood","wall-panel","vent-duct","ceiling-light","noticeboard","keypad"}
    if "--space" in sys.argv:
        ROOT=ROOT.parent/"space"
        EXPECTED={"cockpit","navigation","cargo-rack","life-support","hydroponics","reactor","solar-rack","airlock","viewport"}
    if "--bio" in sys.argv:
        ROOT=ROOT.parent/"bio"
        EXPECTED={"culture-cabinet","grow-rack","incubator","centrifuge","diagnostic-bench","cold-storage","specimen-pod","biosafety-console","containment-door"}
    if "--chem" in sys.argv:
        ROOT=ROOT.parent/"chem"
        EXPECTED={"reagent-cabinet","electrolysis-bench","reaction-rig","calorimeter","gas-test-rig","chromatography-bench","material-analyser","safety-console","safety-interlock"}
    manifest=json.loads((ROOT/"manifest.json").read_text(encoding="utf-8"))
    assert manifest["version"]==1, "Unexpected manifest version"
    assert set(manifest["assets"])==EXPECTED, "Missing or unexpected models"
    for name,entry in manifest["assets"].items():
        assert entry["file"]==name+".glb", "Unexpected filename"
        data=(ROOT/entry["file"]).read_bytes()
        magic,version,length=struct.unpack_from("<4sII",data)
        assert magic==b"glTF" and version==2 and length==len(data), name+" invalid header"
        assert len(data)==entry["bytes"]<=4_000_000, name+" invalid size"
        assert hashlib.sha256(data).hexdigest()==entry["sha256"], name+" hash mismatch"
        n,kind=struct.unpack_from("<II",data,12)
        assert kind==0x4E4F534A and 20+n<=len(data), name+" invalid JSON chunk"
        doc=json.loads(data[20:20+n].decode("utf-8"))
        assert doc.get("meshes") and doc.get("scenes"), name+" no geometry"
        assert not any("uri" in b for b in doc.get("buffers",[])), name+" external buffers"
        assert not any("uri" in i for i in doc.get("images",[])), name+" external images"
        print(name, len(data), "bytes;",len(doc["meshes"]),"meshes")
    print("PASS: all",len(EXPECTED),"Blender models verified")
if __name__=="__main__": main()
