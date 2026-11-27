"""Original fictional archaeological scenery. No external assets required."""
import sys,json,math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import generate_lab as lib
from generate_lab import box,cylinder,torus,text,material
lib.OUT=lib.ROOT/"public"/"models"/"tomb"
lib.SOURCE=lib.ROOT/"blender"/"generated"/"tomb"
lib.OUT.mkdir(parents=True,exist_ok=True)
lib.SOURCE.mkdir(parents=True,exist_ok=True)
def stone():
    return material("Weathered sandstone",(.43,.31,.19),0,.94)
def trim():
    return material("Pale limestone",(.62,.48,.31),0,.87)
def bronze():
    return material("Aged bronze",(.36,.21,.09),.65,.64)
def marks(x,y,z,s,mat):
    # Abstract invented geometric marks; not actual historical writing.
    for i in range(5):
        box("Incised mark",(x+(i-2)*s*.19,y,z),(s*.105,.014,s*.045),mat,.002,(0,(i%3-1)*.6,0))
        box("Incised mark",(x+(i-2)*s*.19,y,z-s*.11),(s*.035,.014,s*.105),mat,.002)
def plinth(m):
    st, tr=stone(),trim()
    box("Base",(0,0,.12),(1.65,1.18,.24),st,.04)
    box("Plinth",(0,0,.58),(1.31,.87,.78),tr,.045)
    box("Cap",(0,0,1.03),(1.61,1.12,.15),st,.035)
    for x in [-.34,.34]:
        cylinder("Replica vessel",(x,0,1.38),.21,.55,bronze(),r2=.16)
        torus("Vessel rim",(x,0,1.67),.17,.023,bronze())
    marks(0,-.45,.66,1.0,st)
def urns(m):
    clay=material("Terracotta",(.47,.21,.11),0,.92)
    st=stone()
    box("Low stone platform",(0,0,.12),(1.45,1.12,.24),st,.03)
    for x,y,r,h in [(-.38,0,.25,.80),(.34,.08,.21,.66),(0,-.26,.16,.42)]:
        cylinder("Urn base",(x,y,.29),r*.65,.10,clay)
        cylinder("Urn shoulder",(x,y,.32+h*.30),r*.68,h*.50,clay,r2=r)
        cylinder("Urn upper body",(x,y,.32+h*.70),r,h*.30,clay,r2=r*.60)
        cylinder("Urn neck",(x,y,.32+h*.93),r*.54,h*.20,clay)
        torus("Urn rim",(x,y,.32+h*1.05),r*.57,.025,bronze())
        for k in [.38,.59]:torus("Decorative band",(x,y,.32+h*k),r*.86,.012,bronze())
def rig(m):
    st,tr,br=stone(),trim(),bronze()
    box("Mechanism footing",(0,0,.14),(2.6,1.45,.28),st,.035)
    box("Support block",(0,0,.66),(.52,.75,.83),tr,.04)
    cylinder("Pivot",(0,0,1.17),.16,.70,br,rot=(math.pi/2,0,0))
    box("Balance beam",(0,0,1.18),(2.40,.20,.15),br,.018)
    for x in [-.92,.92]:
        cylinder("Hanger",(x,0,.93),.024,.43,br)
        box("Stone weight",(x,0,.57),(.38,.39,.32),st,.025)
    marks(0,-.40,.72,.45,st)
def scale(m):
    st,tr,br=stone(),trim(),bronze()
    box("Scale platform",(0,0,.15),(1.58,1.12,.30),st,.03)
    cylinder("Stand",(0,0,.85),.07,1.20,br)
    box("Balance arm",(0,0,1.42),(1.36,.10,.095),br)
    for x in [-.53,.53]:
        for dx in [-.13,.13]:cylinder("Suspension",(x+dx,0,1.15),.012,.48,br)
        cylinder("Weighing pan",(x,0,.89),.26,.055,br)
    box("Sample",(-.53,0,1.04),(.24,.22,.24),tr,.03)
def stele(m):
    st,tr=stone(),trim()
    box("Stele base",(0,0,.14),(1.46,.94,.28),st,.035)
    box("Carved slab",(0,0,1.10),(1.18,.34,1.70),tr,.065)
    for z in [.58,.82,1.06,1.30,1.54]:marks(0,-.184,z,1.0,st)
    for x in [-.51,.51]:box("Border",(x,-.19,1.10),(.06,.025,1.55),st)
def minerals(m):
    st,tr=stone(),trim()
    box("Display base",(0,0,.45),(1.90,1.16,.90),st,.045)
    box("Table top",(0,0,.94),(2.02,1.23,.13),tr,.03)
    colors=[(.38,.32,.22),(.53,.59,.55),(.35,.47,.44),(.50,.28,.18),(.66,.63,.50)]
    for i,c in enumerate(colors):
        rock=material("Mineral "+str(i),c,0,.73)
        x=(i-2)*.33
        cylinder("Faceted specimen",(x,0,1.15),.15,.33,rock,r2=.08,verts=5+i%3,rot=(.12,(-1)**i*.2,0))
        box("Specimen marker",(x,-.36,1.025),(.21,.13,.018),m["paper"])
def chest(m):
    st,br=stone(),bronze()
    box("Chest body",(0,0,.41),(1.46,.95,.82),st,.045)
    box("Chest lid",(0,0,.86),(1.52,1.01,.15),trim(),.03)
    for x in [-.48,.48]:box("Metal strap",(x,-.49,.47),(.085,.035,.83),br)
    box("Decorative latch",(0,-.52,.78),(.22,.065,.19),br,.015)
    torus("Handle",(0,-.57,.75),.07,.015,br,(math.pi/2,0,0))
def dating(m):
    st,tr=stone(),trim()
    box("Table",(0,0,.48),(1.75,1.13,.96),st,.04)
    box("Stone top",(0,0,1.02),(1.88,1.20,.14),tr,.03)
    for i in range(3):
        x=(i-1)*.46
        box("Sample tile",(x,0,1.15),(.34,.44,.12),st,.024)
        box("Record label",(x,-.30,1.10),(.29,.13,.02),m["paper"])
        for j in range(3):box("Mark",(x-.09+j*.09,-.30,1.115),(.035,.07,.006),bronze())
def pillar(m):
    st,tr=stone(),trim()
    for z,w,h in [(.11,.74,.22),(.28,.62,.12),(2.50,.62,.12),(2.68,.74,.24)]:box("Pillar molding",(0,0,z),(w,w,h),tr,.018)
    for i in range(7):
        z=.55+i*.29
        box("Sandstone course",(0,0,z),(.53,.53,.277),st,.017,(0,0,(i%2-.5)*.018))
def seal(m):
    st,tr,br=stone(),trim(),bronze()
    box("Stone seal",(0,0,1.225),(2.68,.30,2.45),st,.045)
    for y in [-.16,.16]:
        for x in [-1.08,1.08]:box("Carved border",(x,y,1.22),(.16,.045,2.21),tr,.015)
        for z in [.24,2.20]:box("Carved band",(0,y,z),(2.3,.042,.13),tr,.012)
        cylinder("Seal disc",(0,y*1.32,1.30),.68,.08,tr,rot=(math.pi/2,0,0))
        torus("Outer ring",(0,y*1.66,1.30),.49,.035,br,(math.pi/2,0,0))
        for i in range(8):
            a=i*math.tau/8
            box("Geometric symbol",(.35*math.cos(a),y*1.85,1.30+.35*math.sin(a)),(.10,.025,.065),br,.006,(0,-a,0))
def main():
    builders={"artefact-plinth":plinth,"urn-cluster":urns,"counterweight-rig":rig,"stone-scale":scale,"inscribed-stele":stele,"mineral-display":minerals,"survey-chest":chest,"dating-table":dating,"pillar":pillar,"stone-seal":seal}
    path=lib.OUT/"manifest.json"
    if path.exists():path.unlink()
    assets={name:lib.generate(name,fn) for name,fn in builders.items()}
    path.write_text(json.dumps({"version":1,"assets":assets},indent=2),encoding="utf-8")
    print("SUCCESS: 10 archaeological scenery models exported to",lib.OUT)
if __name__=="__main__":main()
