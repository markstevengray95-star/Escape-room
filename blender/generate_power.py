"""Original stylised industrial scenery for a fictional science escape room.
These meshes are decorative, not engineering diagrams or operating instructions.
"""
import sys,json,math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import generate_lab as lib
from generate_lab import box,cylinder,torus,text,material
lib.OUT=lib.ROOT/"public"/"models"/"blackout"
lib.SOURCE=lib.ROOT/"blender"/"generated"/"blackout"
lib.OUT.mkdir(parents=True,exist_ok=True)
lib.SOURCE.mkdir(parents=True,exist_ok=True)
def machine(m,kind):
    long=kind=="TURBINE"
    length=3.9 if long else 2.6
    box("Concrete plinth",(0,0,.14),(length,1.85,.28),m["dark"],.035)
    box("Machine base",(0,0,.36),(length-.12,1.58,.20),m["steel"])
    cylinder("Outer shell",(0,0,1.14),.67,length-.42,m["teal"] if long else m["steel"],rot=(0,math.pi/2,0))
    for x in [-length*.36,0,length*.36]:
        cylinder("Casing band",(x,0,1.14),.72,.10,m["dark"],rot=(0,math.pi/2,0))
    for x in [-length*.44,length*.44]:
        cylinder("End plate",(x,0,1.14),.62,.12,m["steel"],rot=(0,math.pi/2,0))
        for i in range(10):
            a=i*math.tau/10
            cylinder("Decorative fastener",(x+(.065 if x>0 else -.065),.53*math.sin(a),1.14+.53*math.cos(a)),.027,.045,m["dark"],rot=(0,math.pi/2,0),verts=12)
    for i in range(9):
        x=-length*.38+i*length*.095
        box("Cooling rib",(x,-.60,1.17),(.065,.15,.58),m["steel"])
    box("Nameplate",(0,-.73,1.26),(.65,.035,.21),m["dark"])
    text("Name",kind,(0,-.754,1.22),.10,m["white"])
    for x in [-length*.32,length*.32]:box("Foot",(x,0,.53),(.40,1.3,.33),m["steel"])
def transformer(m):
    box("Plinth",(0,0,.14),(2.7,1.8,.28),m["dark"])
    box("Tank casing",(0,0,.91),(2.23,1.24,1.28),m["steel"],.04)
    for x in [-1.19,1.19]:
        for j in range(10):box("Radiator fins",(x,-.55+j*.12,.93),(.25,.055,1.18),m["dark"])
    for x in [-.68,0,.68]:
        cylinder("Decorative insulator",(x,0,1.86),.12,.60,m["white"])
        for z in [1.65,1.79,1.93,2.07]:cylinder("Insulator rib",(x,0,z),.20,.045,m["white"])
        cylinder("Top cap",(x,0,2.18),.10,.08,m["steel"])
    box("Identification plate",(0,-.64,1.10),(.75,.025,.22),m["dark"])
    text("Label","TRAINING UNIT",(0,-.66,1.06),.065,m["white"])
def switchgear(m):
    box("Cabinet bank",(0,0,1.04),(1.75,1.15,2.08),m["steel"],.025)
    for x in [-.57,0,.57]:
        box("Panel",(x,-.585,1.04),(.53,.035,1.97),m["dark"])
        box("Display",(x,-.61,1.62),(.35,.018,.24),m["screen"])
        for i in range(3):cylinder("Status lamp",(x+(i-1)*.12,-.633,1.34),.029,.022,[m["red"],m["amber"],m["teal"]][i],rot=(math.pi/2,0,0))
        for z in [.25,.38,.51]:box("Vent",(x,-.62,z),(.39,.014,.035),m["steel"])
def control(m):
    lib.bench(m)
    box("Console body",(0,.18,1.52),(1.53,.50,.82),m["dark"],.035)
    for x in [-.48,0,.48]:
        box("Screen frame",(x,-.09,1.63),(.43,.035,.35),m["steel"])
        box("Screen",(x,-.12,1.63),(.37,.018,.29),m["screen"])
        for j in range(4):box("Decorative chart",(x-.12+j*.08,-.135,1.53+j*.035),(.055,.012,.055),m["white"])
    for i in range(10):box("Control key",(-.63+i*.14,-.30,1.09),(.09,.08,.025),[m["teal"],m["steel"],m["amber"]][i%3])
def rack(m):
    for x in [-.75,.75]:
        for y in [-.48,.48]:box("Frame",(x,y,1.03),(.075,.075,2.06),m["steel"])
    for z in [.24,.92,1.60]:
        box("Shelf",(0,0,z),(1.56,1.02,.075),m["steel"])
        for x in [-.44,0,.44]:
            box("Spare part crate",(x,0,z+.20),(.38,.72,.32),m["dark"])
            box("Label",(x,-.37,z+.20),(.17,.014,.08),m["paper"])
def bench(m):
    lib.bench(m)
    box("Tool board",(0,.45,1.68),(1.47,.09,1.24),m["dark"])
    for i in range(8):
        x=-.58+i*.165
        box("Tool silhouette",(x,.388,1.65),(.06,.04,.48),m["steel"],.008,(0,(-1)**i*.14,0))
        cylinder("Grip",(x,.36,1.44),.035,.16,m["amber"])
    for x in [-.48,.48]:box("Closed equipment case",(x,-.05,1.22),(.46,.37,.28),m["steel"])
def pump(m):
    box("Skid",(0,0,.17),(2.0,1.3,.34),m["dark"])
    for x in [-.54,.54]:
        cylinder("Decorative pump housing",(x,0,.83),.39,.82,m["teal"])
        cylinder("Top cover",(x,0,1.27),.42,.10,m["steel"])
        torus("Detail rim",(x,0,1.34),.32,.025,m["steel"])
    box("Equipment nameplate",(0,-.68,.47),(.64,.025,.17),m["steel"])
def door(m):
    box("Industrial gate",(0,0,1.225),(2.98,.20,2.45),m["steel"],.025)
    for y in [-.12,.12]:
        for x in [-1.21,1.21]:box("Rail",(x,y,1.225),(.15,.055,2.26),m["dark"])
        for z in [.28,1.22,2.15]:box("Cross member",(0,y,z),(2.52,.045,.12),m["dark"])
        for i in range(9):box("Warning stripe",(-1.1+i*.275,y*1.35,.40),(.16,.025,.12),m["amber"],.002,(0,.55,0))
        box("Status plate",(0,y*1.4,1.75),(.72,.03,.30),m["dark"])
def main():
    builders={"turbine":lambda m:machine(m,"TURBINE"),"generator":lambda m:machine(m,"GENERATOR"),"transformer":transformer,"switchgear":switchgear,"control-desk":control,"parts-rack":rack,"maintenance-bench":bench,"pump-skid":pump,"industrial-gate":door}
    path=lib.OUT/"manifest.json"
    if path.exists():path.unlink()
    assets={name:lib.generate(name,fn) for name,fn in builders.items()}
    path.write_text(json.dumps({"version":1,"assets":assets},indent=2),encoding="utf-8")
    print("SUCCESS: 9 industrial scenery models exported to",lib.OUT)
if __name__=="__main__":main()
