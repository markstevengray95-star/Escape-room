"""Original fictional classroom chemistry facility scenery. Visual models only."""
import sys,json,math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import generate_lab as lib
from generate_lab import box,cylinder,text,material,torus
lib.OUT=lib.ROOT/"public"/"models"/"chem"
lib.SOURCE=lib.ROOT/"blender"/"generated"/"chem"
lib.OUT.mkdir(parents=True,exist_ok=True)
lib.SOURCE.mkdir(parents=True,exist_ok=True)
def screen(m,x,y,z,label):
    box("Display housing",(x,y,z),(.48,.09,.29),m["dark"])
    box("LCD",(x,y-.055,z+.035),(.39,.02,.14),m["screen"])
    text("LCD label",label,(x,y-.07,z+.02),.045,m["white"])
    for i in range(3):
        cylinder("Button",(x+(i-1)*.13,y-.063,z-.075),.019,.018,[m["red"],m["amber"],m["teal"]][i],rot=(math.pi/2,0,0))
def cabinet(m):
    box("Cabinet",(0,0,1.05),(1.46,.95,2.1),m["amber"],.03)
    for x in [-.36,.36]:
        box("Door",(x,-.49,1.05),(.69,.085,1.96),m["amber"])
        box("Handle",(x+(.24 if x<0 else -.24),-.55,1.05),(.075,.045,.27),m["dark"])
        for z in [.25,1.83]:
            for j in range(5):box("Vent",(x,-.545,z+j*.025),(.42,.014,.012),m["dark"])
    box("Sign",(0,-.55,1.55),(.56,.02,.20),m["white"])
    text("Sign text","SAMPLE STORE",(0,-.565,1.52),.047,m["dark"])
def instrument(m,label,kind):
    lib.bench(m)
    box("Instrument housing",(-.35,.15,1.35),(.64,.57,.54),m["white"],.03)
    screen(m,-.35,-.17,1.39,label)
    if kind=="columns":
        for i in range(3):
            x=.10+i*.20
            cylinder("Sample tube",(x,.02,1.47),.075,.70,m["glass"])
            cylinder("Cap",(x,.02,1.84),.08,.035,m["dark"])
            for j in range(3):
                box("Colored marker",(x,-.078,1.25+j*.17),(.065,.01,.045),[m["blue"],m["amber"],m["red"]][j],.002)
    elif kind=="scale":
        box("Sample tray",(.35,0,1.13),(.54,.48,.09),m["steel"])
        box("Reference block",(.35,0,1.25),(.19,.19,.15),m["copper"])
    else:
        cylinder("Instrument body",(.32,0,1.39),.22,.62,m["glass"] if kind=="sample" else m["steel"])
        cylinder("Base",(.32,0,1.10),.25,.08,m["dark"])
        torus("Detail ring",(.32,0,1.62),.22,.013,m["steel"])
    for i in range(3):
        cylinder("Closed sample container",(-.12+i*.18,.40,1.21),.055,.25,m["white"])
        cylinder("Lid",(-.12+i*.18,.40,1.35),.057,.035,m["dark"])
def safety(m):
    lib.bench(m)
    box("Control panel",(0,.23,1.60),(1.37,.18,.91),m["dark"],.025)
    for x in [-.4,.4]:screen(m,x,.105,1.72,"STATUS" if x<0 else "LOCK")
    for i in range(8):cylinder("Status light",(-.52+i*.15,.10,1.33),.033,.035,[m["red"],m["amber"],m["teal"]][i%3],rot=(math.pi/2,0,0))
    box("Warning strip",(0,.11,1.19),(1.2,.025,.07),m["amber"])
def interlock(m):
    box("Door slab",(0,0,1.225),(2.78,.19,2.45),m["steel"],.025)
    for y in [-.11,.11]:
        box("Inset",(0,y,1.225),(2.47,.036,2.18),m["white"])
        box("Window frame",(0,y*1.28,1.7),(.84,.045,.43),m["dark"])
        box("Pane",(0,y*1.52,1.7),(.71,.018,.30),m["glass"])
        for i in range(8):box("Warning stripe",(-.98+i*.28,y*1.38,.34),(.17,.02,.13),m["amber"],.002,(0,.52,0))
        for x in [-1.06,1.06]:box("Lock rail",(x,y*1.3,1.20),(.14,.05,1.92),m["dark"])
def main():
    builders={"reagent-cabinet":cabinet,"electrolysis-bench":lambda m:instrument(m,"ION TEST","sample"),"reaction-rig":lambda m:instrument(m,"MASS","scale"),"calorimeter":lambda m:instrument(m,"TEMP","metal"),"gas-test-rig":lambda m:instrument(m,"SAMPLE","sample"),"chromatography-bench":lambda m:instrument(m,"COLOUR","columns"),"material-analyser":lambda m:instrument(m,"SCAN","scale"),"safety-console":safety,"safety-interlock":interlock}
    path=lib.OUT/"manifest.json"
    if path.exists():path.unlink()
    assets={name:lib.generate(name,fn) for name,fn in builders.items()}
    path.write_text(json.dumps({"version":1,"assets":assets},indent=2),encoding="utf-8")
    print("SUCCESS: 9 chemistry models exported to",lib.OUT)
if __name__=="__main__":main()
