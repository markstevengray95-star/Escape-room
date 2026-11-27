"""Generate additional architecture without overwriting the equipment pack."""
import sys,json,math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import generate_lab as lib
from generate_lab import box,cylinder,text,material
lib.OUT=lib.ROOT/"public"/"models"/"lab-architecture"
lib.SOURCE=lib.ROOT/"blender"/"generated"/"architecture"
lib.OUT.mkdir(parents=True,exist_ok=True)
lib.SOURCE.mkdir(parents=True,exist_ok=True)
def door(m):
    box("Reinforced slab",(0,0,1.225),(2.42,.18,2.45),m["steel"],.025)
    for y in [-.103,.103]:
        for x in [-.9,.9]: box("Edge reinforcement",(x,y,1.225),(.12,.04,2.34),m["dark"])
        for z in [.16,2.28]: box("Cross rail",(0,y,z),(2.24,.035,.11),m["dark"])
        box("Inset panel",(0,y,1.25),(1.54,.025,1.56),m["teal"],.016)
        box("Window frame",(0,y*1.2,1.74),(.62,.045,.34),m["dark"])
        box("Inspection window",(0,y*1.43,1.74),(.52,.018,.25),m["glass"])
        for i in range(7): box("Safety stripe",(-.75+i*.25,y*1.22,.35),(.12,.016,.10),m["amber"],.002,(0,.55,0))
        for x in [-.57,.57]:
            for z in [.55,1.96]: cylinder("Fastener",(x,y*1.22,z),.025,.014,m["steel"],rot=(math.pi/2,0,0))
def cabinet(m):
    box("Cabinet shell",(0,0,.455),(1.15,.75,.91),m["white"],.015)
    box("Countertop",(0,0,.925),(1.15,.75,.05),m["dark"],.012)
    for x in [-.29,.29]:
        box("Lower door",(x,-.38,.29),(.54,.018,.46),m["steel"])
        box("Handle",(x,-.412,.39),(.2,.035,.045),m["dark"])
    box("Drawer recess",(0,-.365,.70),(1.07,.035,.24),m["dark"])
    box("Toe kick",(0,-.38,.045),(1.08,.025,.065),m["dark"])
def hood(m):
    lib.bench(m)
    box("Back",(0,.44,1.66),(1.48,.12,1.18),m["white"])
    for x in [-.70,.70]: box("Side column",(x,0,1.67),(.10,.9,1.24),m["white"])
    box("Extraction plenum",(0,0,2.22),(1.48,1.03,.21),m["steel"])
    for z in [1.58,1.97]: box("Sash rail",(0,-.47,z),(1.29,.045,.05),m["steel"])
    for x in [-.62,.62]: box("Sash upright",(x,-.47,1.78),(.045,.045,.4),m["steel"])
    for i in range(11): box("Extraction grille",(-.58+i*.116,.35,2.02),(.06,.018,.16),m["dark"])
    box("Work light",(0,.02,2.09),(1.15,.14,.035),m["screen"])
    box("Control housing",(.59,-.50,1.35),(.19,.065,.18),m["dark"])
    for i in range(3): cylinder("Control",(.53+i*.055,-.546,1.36),.016,.016,[m["red"],m["amber"],m["teal"]][i],rot=(math.pi/2,0,0))
    text("Label","FUME HOOD",(0,-.53,2.19),.08,m["white"])
def panel(m):
    box("Backplate",(0,0,.58),(1.8,.10,1.16),m["steel"])
    for x in [-.58,0,.58]:
        box("Inset panel",(x,-.061,.58),(.54,.028,1.06),m["white"])
        for z in [.12,1.04]: cylinder("Screw",(x,-.084,z),.015,.014,m["dark"],rot=(math.pi/2,0,0))
    box("Service stripe",(0,-.085,.25),(1.72,.022,.12),m["teal"])
def duct(m):
    box("Galvanised duct",(0,0,.15),(2,.36,.30),m["steel"])
    for x in [-.94,-.47,0,.47,.94]: box("Joint band",(x,0,.15),(.045,.39,.33),m["dark"])
    box("Grille",(0,-.19,.15),(.64,.035,.22),m["dark"])
    for i in range(8): box("Slat",(0,-.217,.065+i*.024),(.58,.025,.011),m["steel"])
def lamp(m):
    box("Casing",(0,0,.055),(1.8,.36,.11),m["steel"])
    box("Diffuser",(0,0,.005),(1.68,.26,.025),m["screen"])
    for x in [-.86,.86]: box("End cap",(x,0,.05),(.10,.38,.13),m["dark"])
def board(m):
    box("Frame",(0,0,.42),(1.2,.07,.84),m["steel"])
    box("Cork inset",(0,-.044,.42),(1.12,.018,.76),material("Cork",(.32,.17,.08),0,.9))
    for x,z in [(-.32,.47),(.04,.58),(.32,.32)]:
        box("Document",(x,-.061,z),(.27,.009,.34),m["paper"])
        for j in range(5): box("Printed rule",(x,-.069,z+.095-j*.035),(.19,.003,.005),m["dark"],0)
        cylinder("Pushpin",(x,-.075,z+.145),.012,.015,m["red"],rot=(math.pi/2,0,0))
    text("Heading","RESEARCH RECORDS",(0,-.072,.76),.05,m["white"])
def keypad(m):
    box("Casing",(0,0,.25),(.32,.10,.50),m["dark"])
    box("Display",(0,-.058,.41),(.24,.02,.10),m["screen"])
    text("Prompt","ACCESS",(0,-.075,.40),.038,m["white"])
    for i in range(12):
        x=(i%3-1)*.075
        z=.30-(i//3)*.065
        box("Key",(x,-.066,z),(.061,.025,.053),m["steel"],.004)
        text("Key label",str(i+1) if i<9 else ["*","0","#"][i-9],(x,-.083,z-.012),.03,m["dark"])
def main():
    builders={"security-door":door,"storage-cabinet":cabinet,"fume-hood":hood,"wall-panel":panel,"vent-duct":duct,"ceiling-light":lamp,"noticeboard":board,"keypad":keypad}
    path=lib.OUT/"manifest.json"
    if path.exists():path.unlink()
    assets={name:lib.generate(name,fn) for name,fn in builders.items()}
    path.write_text(json.dumps({"version":1,"assets":assets},indent=2),encoding="utf-8")
    print("SUCCESS: 8 architecture models exported to",lib.OUT)
if __name__=="__main__":main()
