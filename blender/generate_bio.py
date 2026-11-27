"""Original biological research facility models. No external dependencies or downloads."""
import sys,json,math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import generate_lab as lib
from generate_lab import box,cylinder,wire,text,material,torus
lib.OUT=lib.ROOT/"public"/"models"/"bio"
lib.SOURCE=lib.ROOT/"blender"/"generated"/"bio"
lib.OUT.mkdir(parents=True,exist_ok=True)
lib.SOURCE.mkdir(parents=True,exist_ok=True)
def panel(m,x,y,z,label,w=.44):
    box("Control bezel",(x,y,z),(w,.075,.24),m["dark"])
    box("Screen",(x,y-.05,z+.027),(w-.06,.019,.125),m["screen"])
    text("Screen text",label,(x,y-.065,z+.010),.035,m["white"])
    for i in range(3):cylinder("Button",(x+(i-1)*.095,y-.053,z-.073),.018,.018,[m["red"],m["amber"],m["teal"]][i],rot=(math.pi/2,0,0))
def culture(m):
    lib.bench(m)
    box("Cabinet back",(0,.41,1.66),(1.47,.09,1.22),m["white"])
    for x in [-.70,.70]:box("Side",(x,0,1.66),(.09,.90,1.22),m["white"])
    box("Canopy",(0,0,2.22),(1.48,.95,.16),m["steel"])
    for z in [1.22,1.63]:box("Shelf",(0,.10,z),(1.30,.58,.045),m["steel"])
    for i in range(5):
        x=(i-2)*.23
        for z in [1.29,1.70]:
            cylinder("Culture jar",(x,.09,z),.069,.13,m["glass"])
            cylinder("Jar cap",(x,.09,z+.075),.07,.03,m["white"])
            box("Sample label",(x,.015,z),(.07,.009,.035),m["paper"])
    box("Cabinet light",(0,.02,2.11),(1.2,.17,.04),m["screen"])
def grow(m):
    leaf=material("Leaf green",(.09,.42,.14),0,.67)
    for x in [-.68,.68]:
        for y in [-.43,.43]:box("Upright",(x,y,1.07),(.065,.065,2.14),m["steel"])
    for z in [.28,1.05]:
        box("Grow tray",(0,0,z),(1.40,.86,.12),m["dark"])
        for i in range(5):
            for j in [-1,1]:
                x=(i-2)*.25;y=j*.20
                cylinder("Pot",(x,y,z+.105),.082,.10,m["white"],r2=.10)
                cylinder("Stem",(x,y,z+.30),.012,.29,leaf)
                for k in [-1,1]:box("Leaf",(x+k*.06,y,z+.34),(.15,.065,.025),leaf,.007,(0,k*.6,0))
        box("Grow light",(0,0,z+.68),(1.39,.42,.07),m["screen"])
    panel(m,.45,-.46,1.88,"LIGHT")
def incubator(m):
    box("Incubator body",(0,0,.95),(1.46,.94,1.90),m["white"],.035)
    box("Door surround",(0,-.49,.91),(1.34,.08,1.57),m["dark"],.025)
    box("Inner door",(0,-.54,.91),(1.18,.04,1.39),m["glass"],.025)
    for z in [.43,.86,1.29]:
        box("Shelf rail",(0,-.574,z),(1.07,.025,.045),m["steel"])
        for i in range(4):box("Sample silhouette",(-.39+i*.26,-.576,z+.10),(.16,.012,.15),m["teal"],.006)
    box("Door handle",(.52,-.61,.91),(.065,.08,.42),m["steel"])
    panel(m,0,-.50,1.76,"TEMP")
def centrifuge(m):
    lib.bench(m)
    box("Centrifuge casing",(0,0,1.26),(.95,.80,.42),m["white"],.045)
    cylinder("Rotor basin",(0,0,1.51),.34,.09,m["dark"])
    cylinder("Rotor",(0,0,1.57),.28,.055,m["steel"])
    for i in range(8):
        a=i*math.tau/8;x=.20*math.cos(a);y=.20*math.sin(a)
        cylinder("Sample tube",(x,y,1.63),.038,.12,m["glass"])
        cylinder("Tube cap",(x,y,1.70),.04,.025,m["blue"])
    torus("Rotor guard",(0,0,1.57),.31,.019,m["steel"])
    panel(m,0,-.42,1.27,"RPM",.52)
def diagnostic(m):
    lib.bench(m)
    box("Test rack",(0,.12,1.22),(1.12,.30,.24),m["steel"])
    for i in range(6):
        x=(i-2.5)*.16
        cylinder("Reagent bottle",(x,.1,1.44),.055,.22,m["glass"])
        cylinder("Cap",(x,.1,1.56),.057,.035,[m["blue"],m["amber"],m["white"]][i%3])
    box("Diagnostic monitor",(0,.31,1.78),(.69,.14,.45),m["dark"],.02)
    box("Monitor display",(0,.23,1.78),(.61,.014,.37),m["screen"])
    text("Instrument label","ASSAY",(0,.215,1.80),.065,m["white"])
    for i in range(4):box("Trace",(-.20+i*.13,.21,1.67+i*.027),(.09,.015,.025),m["white"])
def cold(m):
    box("Insulated cabinet",(0,0,1.08),(1.31,.95,2.16),m["white"],.035)
    for z in [.56,1.55]:
        box("Insulated door",(0,-.51,z),(1.20,.11,.89),m["steel"],.018)
        box("Vertical latch",(.48,-.61,z),(.075,.085,.28),m["dark"])
        for j in range(3):box("Vent",(0,-.578,z-.30+j*.038),(.55,.02,.015),m["dark"])
    panel(m,0,-.58,1.98,"STORE")
def pod(m):
    box("Containment base",(0,0,.20),(1.30,1.06,.40),m["steel"],.035)
    cylinder("Chamber shell",(0,0,1.18),.43,1.65,m["glass"])
    for z in [.41,1.96]:cylinder("Sealing ring",(0,0,z),.47,.15,m["dark"])
    for x in [-.48,.48]:
        box("Frame rail",(x,0,1.20),(.095,.12,1.7),m["steel"])
    box("Sample window",(0,-.445,1.25),(.52,.03,1.07),m["teal"],.025)
    box("Viewing inset",(0,-.466,1.25),(.43,.015,.95),m["glass"],.02)
    for i in range(4):box("Sample rack",((i%2-.5)*.22,-.481,.93+(i//2)*.52),(.17,.012,.16),m["white"])
    panel(m,0,-.55,.31,"SEALED",.65)
def console(m):
    lib.bench(m)
    for x in [-.43,.43]:
        box("Monitor housing",(x,.25,1.44),(.67,.14,.49),m["dark"],.015)
        box("Screen",(x,.168,1.44),(.59,.02,.40),m["screen"])
        for i in range(5):box("Status bar",(x-.23+i*.115,.151,1.31+i*.042),(.075,.01,.04),m["white"])
    for i in range(8):box("Button",(-.49+i*.14,-.30,1.09),(.08,.08,.04),[m["red"],m["amber"],m["teal"]][i%3])
    text("Console mark","CONTAINMENT",(0,-.56,1.02),.055,m["white"])
def door(m):
    box("Sealed slab",(0,0,1.225),(2.58,.18,2.45),m["white"],.028)
    for y in [-.105,.105]:
        box("Gasket",(0,y,1.225),(2.38,.035,2.26),m["dark"],.024)
        box("Door inset",(0,y*1.22,1.225),(2.16,.02,2.05),m["teal"],.02)
        box("Observation frame",(0,y*1.4,1.66),(.83,.055,.67),m["steel"])
        box("Observation pane",(0,y*1.76,1.66),(.69,.018,.53),m["glass"])
        for x in [-.89,.89]:box("Lock rail",(x,y*1.58,1.225),(.12,.045,1.95),m["dark"])
        for i in range(6):box("Warning marker",(-.75+i*.30,y*1.7,.31),(.17,.018,.12),m["amber"],.002,(0,.5,0))
def main():
    builders={"culture-cabinet":culture,"grow-rack":grow,"incubator":incubator,"centrifuge":centrifuge,"diagnostic-bench":diagnostic,"cold-storage":cold,"specimen-pod":pod,"biosafety-console":console,"containment-door":door}
    path=lib.OUT/"manifest.json"
    if path.exists():path.unlink()
    assets={name:lib.generate(name,fn) for name,fn in builders.items()}
    path.write_text(json.dumps({"version":1,"assets":assets},indent=2),encoding="utf-8")
    print("SUCCESS: 9 biology models exported to",lib.OUT)
if __name__=="__main__":main()
