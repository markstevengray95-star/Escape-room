"""Modular original stylised exploration suit meshes with separate limb segments."""
import sys,json,math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import generate_lab as lib
from generate_lab import box,cylinder,torus,material
lib.OUT=lib.ROOT/"public"/"models"/"characters"
lib.SOURCE=lib.ROOT/"blender"/"generated"/"characters"
lib.OUT.mkdir(parents=True,exist_ok=True)
lib.SOURCE.mkdir(parents=True,exist_ok=True)
def suit():
    return material("Woven suit fabric",(.16,.28,.33),.04,.84)
def torso(m):
    fabric=suit()
    box("Jacket body",(0,0,.30),(.42,.29,.50),fabric,.07)
    box("Shoulder panel",(0,0,.49),(.46,.31,.15),m["dark"],.045)
    box("Utility belt",(0,0,.085),(.43,.31,.12),m["dark"],.02)
    box("Buckle",(0,-.165,.085),(.10,.025,.07),m["steel"],.007)
    for x in [-.12,.12]:
        box("Chest pocket",(x,-.157,.31),(.15,.025,.16),m["teal"],.012)
        box("Pocket flap",(x,-.175,.375),(.16,.025,.045),m["dark"],.008)
    box("Zip seam",(0,-.17,.30),(.018,.02,.34),m["steel"],.003)
    box("Rear utility panel",(0,.16,.30),(.28,.055,.32),m["dark"],.025)
def helmet(m):
    cylinder("Lower collar",(0,0,.045),.115,.09,m["dark"])
    # Rounded stacked shell segments.
    cylinder("Helmet base",(0,0,.125),.158,.12,m["white"],r2=.168)
    cylinder("Helmet crown",(0,0,.23),.168,.13,m["white"],r2=.12)
    cylinder("Crown cap",(0,0,.315),.12,.045,m["white"],r2=.065)
    box("Visor frame",(0,-.135,.18),(.29,.09,.15),m["dark"],.04)
    box("Visor",(0,-.19,.18),(.245,.032,.105),m["glass"],.028)
    for x in [-.156,.156]:cylinder("Side cover",(x,0,.18),.054,.038,m["steel"],rot=(0,math.pi/2,0))
def upper(m):
    cylinder("Sleeve",(0,0,.145),.073,.23,suit(),r2=.087)
    cylinder("Shoulder protection",(0,0,.26),.09,.058,m["dark"])
    cylinder("Cuff",(0,0,.038),.079,.06,m["teal"])
def forearm(m):
    cylinder("Sleeve",(0,0,.19),.067,.21,suit())
    cylinder("Cuff",(0,0,.095),.08,.06,m["dark"])
    box("Glove",(0,-.012,.045),(.125,.14,.095),m["teal"],.027)
def thigh(m):
    cylinder("Trouser leg",(0,0,.18),.087,.34,m["dark"],r2=.095)
    box("Side pocket",(.058,0,.21),(.06,.14,.15),suit(),.014)
def boot(m):
    cylinder("Lower trouser",(0,0,.31),.079,.31,m["dark"])
    box("Boot upper",(0,-.035,.115),(.16,.24,.19),m["dark"],.03)
    box("Boot sole",(0,-.052,.027),(.18,.30,.054),m["steel"],.012)
    for j in range(3):box("Boot detail",(0,-.13,.09+j*.035),(.11,.016,.013),m["teal"],.002)
def glove(m):
    fabric=suit()
    cylinder("Sleeve",(0,0,.115),.081,.23,fabric)
    cylinder("Cuff",(0,0,.235),.087,.055,m["dark"])
    box("Palm",(0,-.012,.30),(.16,.13,.14),m["teal"],.03)
    for i in range(4):
        x=(i-1.5)*.039
        box("Finger",(x,-.025,.405),(.033,.07,.13),m["teal"],.013)
    box("Thumb",(-.091,-.035,.30),(.048,.08,.10),m["teal"],.017,(0,-.35,0))
def main():
    builders={"torso":torso,"helmet":helmet,"upper-arm":upper,"forearm":forearm,"thigh":thigh,"boot-leg":boot,"glove":glove}
    path=lib.OUT/"manifest.json"
    if path.exists():path.unlink()
    assets={name:lib.generate(name,fn) for name,fn in builders.items()}
    path.write_text(json.dumps({"version":1,"assets":assets},indent=2),encoding="utf-8")
    print("SUCCESS: 7 character models exported to",lib.OUT)
if __name__=="__main__":main()
