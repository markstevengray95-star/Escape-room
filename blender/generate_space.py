"""Original spacecraft interior asset pack, independent of laboratory exports."""
import sys,json,math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import generate_lab as lib
from generate_lab import box,cylinder,wire,text,material,torus
lib.OUT=lib.ROOT/"public"/"models"/"space"
lib.SOURCE=lib.ROOT/"blender"/"generated"/"space"
lib.OUT.mkdir(parents=True,exist_ok=True)
lib.SOURCE.mkdir(parents=True,exist_ok=True)
def cockpit(m):
    box("Console pedestal",(0,0,.46),(1.25,.78,.92),m["dark"],.035)
    box("Control surface",(0,-.12,.98),(1.5,.98,.12),m["steel"],.03)
    for i in range(3):
        x=(i-1)*.45
        box("Display frame",(x,.30,1.29),(.41,.14,.48),m["dark"],.015,(.22,0,0))
        box("Display",(x,.218,1.29),(.35,.015,.40),m["screen"],.004,(.22,0,0))
        for j in range(4):box("Data bar",(x-.11+j*.07,.20,1.19+j*.035),(.035,.012,.07),m["white"],.002)
    for i in range(8):
        for j in range(3):box("Key",(-.52+i*.14,-.44+j*.13,1.058),(.10,.09,.022),m["dark"],.004)
    for x in [-.59,.59]:
        cylinder("Joystick base",(x,-.2,1.07),.075,.05,m["steel"])
        cylinder("Joystick",(x,-.2,1.15),.022,.15,m["dark"],rot=(.18,0,0))
def rack(m):
    for x in [-.72,.72]:
        for y in [-.43,.43]:box("Rack post",(x,y,.78),(.06,.06,1.56),m["steel"])
    for z in [.20,.75,1.30]:box("Shelf",(0,0,z),(1.5,.92,.07),m["dark"])
    for x in [-.39,.39]:
        for z in [.46,1.01]:
            box("Cargo crate",(x,0,z),(.63,.68,.43),m["white"],.02)
            box("Latch",(x,-.355,z),(.22,.05,.07),m["dark"])
            for a in [-.25,.25]:box("Tie-down strip",(x+a,-.35,z),(.045,.025,.39),m["amber"])
def life(m):
    box("Mounting rack",(0,0,.12),(1.55,.92,.24),m["dark"])
    for x in [-.45,.45]:
        cylinder("Oxygen tank",(x,0,.83),.28,1.30,m["white"])
        for z in [.36,1.22]:cylinder("Tank strap",(x,0,z),.295,.065,m["steel"])
        cylinder("Valve stem",(x,0,1.53),.055,.15,m["copper"])
        torus("Handwheel",(x,0,1.65),.075,.013,m["red"])
    wire("Manifold",[(-.45,0,1.55),(-.45,.28,1.55),(.45,.28,1.55),(.45,0,1.55)],.025,m["copper"])
    box("Gauge panel",(0,-.45,1.16),(.35,.13,.40),m["dark"])
    for z in [1.08,1.27]:cylinder("Gauge",(0,-.53,z),.075,.035,m["glass"],rot=(math.pi/2,0,0))
def hydro(m):
    box("Grow module",(0,0,.59),(1.5,.94,1.18),m["steel"])
    box("Growth tray",(0,-.1,1.19),(1.38,.65,.12),m["dark"])
    leaf=material("Hydroponic leaf",(.12,.42,.12),0,.65)
    for i in range(5):
        x=(i-2)*.25
        cylinder("Plant stem",(x,-.1,1.43),.013,.35,leaf)
        for j in [-1,1]:box("Leaf",(x+j*.07,-.1,1.48),(.18,.06,.025),leaf,.01,(0,j*.55,0))
    for x in [-.70,.70]:box("Support",(x,.32,1.63),(.07,.07,.90),m["steel"])
    box("Grow light",(0,.05,2.03),(1.48,.35,.12),m["screen"])
def reactor(m):
    box("Reactor foundation",(0,0,.12),(1.45,1.0,.24),m["dark"])
    cylinder("Core housing",(0,0,.93),.38,1.45,m["steel"])
    for z in [.35,.65,1.0,1.35,1.57]:cylinder("Reinforced ring",(0,0,z),.42,.07,m["dark"])
    for i in range(6):
        a=i*math.tau/6
        box("Cooling fin",(.37*math.cos(a),.37*math.sin(a),.95),(.11,.11,1.15),m["teal"])
    box("Diagnostic panel",(0,-.43,1.05),(.52,.12,.43),m["dark"])
    box("Display",(0,-.50,1.13),(.39,.018,.17),m["screen"])
    for x in [-.14,0,.14]:cylinder("Indicator",(x,-.51,.97),.025,.025,m["amber"],rot=(math.pi/2,0,0))
def solar(m):
    box("Rack base",(0,0,.12),(1.45,.85,.24),m["steel"])
    for x in [-.57,.57]:box("Post",(x,.15,.83),(.07,.08,1.42),m["steel"])
    box("Panel backing",(0,0,1.29),(1.44,.1,.86),m["dark"],.02)
    for i in range(6):
        for j in range(4):box("Solar cell",(-.60+i*.24,-.06,.94+j*.23),(.21,.02,.20),m["blue"],.003)
    box("Controller",(0,-.22,.40),(.64,.22,.30),m["teal"])
    box("Controller display",(0,-.34,.44),(.40,.015,.13),m["screen"])
def airlock(m):
    box("Pressure bulkhead",(0,0,1.225),(2.68,.24,2.45),m["steel"],.04)
    for y in [-.13,.13]:
        for x in [-1.03,1.03]:box("Lock rail",(x,y,1.225),(.21,.05,2.28),m["dark"])
        cylinder("Hatch surround",(0,y,1.36),.68,.08,m["dark"],rot=(math.pi/2,0,0))
        cylinder("Pressure hatch",(0,y*1.4,1.36),.59,.055,m["teal"],rot=(math.pi/2,0,0))
        torus("Lock wheel",(0,y*1.9,1.36),.24,.035,m["steel"],(math.pi/2,0,0))
        for i in range(5):box("Caution stripe",(-.82+i*.41,y*1.3,.32),(.18,.025,.13),m["amber"],.002,(0,.5,0))
def window(m):
    box("Hull frame",(0,0,.65),(2.65,.22,1.3),m["dark"],.06)
    box("Deep space view",(0,-.127,.65),(2.39,.025,1.07),material("Space black",(.006,.009,.022),.1,.35),.035)
    for i in range(27):
        x=-1.05+((i*37)%211)/100
        z=.18+((i*29)%95)/100
        cylinder("Star",(x,-.145,z),.009 if i%5 else .018,.004,m["white"],rot=(math.pi/2,0,0),verts=8)
    for x in [-1.26,1.26]:
        for z in [.18,1.12]:cylinder("Hull fastener",(x,-.14,z),.035,.018,m["steel"],rot=(math.pi/2,0,0))
def main():
    builders={"cockpit":cockpit,"navigation":cockpit,"cargo-rack":rack,"life-support":life,"hydroponics":hydro,"reactor":reactor,"solar-rack":solar,"airlock":airlock,"viewport":window}
    path=lib.OUT/"manifest.json"
    if path.exists():path.unlink()
    assets={name:lib.generate(name,fn) for name,fn in builders.items()}
    path.write_text(json.dumps({"version":1,"assets":assets},indent=2),encoding="utf-8")
    print("SUCCESS: 9 spacecraft models exported to",lib.OUT)
if __name__=="__main__":main()
