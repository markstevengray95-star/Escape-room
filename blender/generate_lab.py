"""Generate original game-ready Escape Lab assets with Blender 3.6+.
Run: blender --background --factory-startup --python-exit-code 1 --python blender/generate_lab.py
Coordinates: metres, Z up, front faces -Y (glTF +Z).
"""
import bpy
import math
import json
import hashlib
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "models" / "lab"
SOURCE = ROOT / "blender" / "generated"
OUT.mkdir(parents=True, exist_ok=True)
SOURCE.mkdir(parents=True, exist_ok=True)

def material(name, color, metallic=0.0, roughness=.45, emission=0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Metallic"].default_value = metallic
    p.inputs["Roughness"].default_value = roughness
    if emission:
        p.inputs.get("Emission Color", p.inputs.get("Emission")).default_value = (*color,1)
        strength = p.inputs.get("Emission Strength")
        if strength: strength.default_value = emission
    return m

def palette():
    return {
      "white":material("Porcelain enamel",(.78,.82,.82),.1,.29),
      "steel":material("Brushed stainless",(.35,.43,.48),.75,.34),
      "dark":material("Graphite polymer",(.035,.05,.064),.05,.48),
      "rubber":material("Black rubber",(.018,.024,.026),0,.83),
      "teal":material("Petrol green",(.055,.27,.28),.2,.35),
      "screen":material("LCD teal",(.04,.35,.32),.05,.22,.45),
      "amber":material("Safety yellow",(.86,.48,.055),.1,.42),
      "red":material("Indicator red",(.65,.055,.035),.03,.35),
      "blue":material("Sample blue",(.09,.37,.66),.05,.24),
      "glass":material("Tinted instrument glass",(.43,.73,.75),.16,.17),
      "copper":material("Copper",(.64,.28,.1),.78,.31),
      "paper":material("Ivory label",(.87,.85,.73),0,.7),
    }

def finish(o,name,mat,bevel=0):
    o.name=name
    if mat: o.data.materials.append(mat)
    if bevel:
        mod=o.modifiers.new("Rounded manufactured edges","BEVEL")
        mod.width=bevel
        mod.segments=2
        mod.limit_method="ANGLE"
        bpy.context.view_layer.objects.active=o
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return o

def box(name,loc,size,mat,bevel=.008,rot=None):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    o=bpy.context.object
    o.dimensions=size
    if rot: o.rotation_euler=rot
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(o,name,mat,bevel)

def cylinder(name,loc,r,h,mat,r2=None,rot=None,verts=24):
    bpy.ops.mesh.primitive_cone_add(vertices=verts,radius1=r,radius2=r if r2 is None else r2,depth=h,location=loc)
    o=bpy.context.object
    if rot: o.rotation_euler=rot
    finish(o,name,mat,.002)
    for p in o.data.polygons: p.use_smooth=len(p.vertices)==4
    return o

def torus(name,loc,r,t,mat,rot=None):
    bpy.ops.mesh.primitive_torus_add(major_segments=24,minor_segments=8,location=loc,major_radius=r,minor_radius=t)
    o=bpy.context.object
    if rot: o.rotation_euler=rot
    return finish(o,name,mat)

def wire(name,points,r,mat):
    c=bpy.data.curves.new(name,"CURVE")
    c.dimensions="3D"
    c.bevel_depth=r
    c.bevel_resolution=2
    s=c.splines.new("POLY")
    s.points.add(len(points)-1)
    for p,co in zip(s.points,points): p.co=(*co,1)
    o=bpy.data.objects.new(name,c)
    bpy.context.collection.objects.link(o)
    c.materials.append(mat)
    bpy.ops.object.select_all(action="DESELECT")
    o.select_set(True)
    bpy.context.view_layer.objects.active=o
    bpy.ops.object.convert(target="MESH")
    return bpy.context.object

def text(name,value,loc,size,mat,rot=(math.pi/2,0,0)):
    bpy.ops.object.text_add(location=loc,rotation=rot)
    o=bpy.context.object
    o.name=name
    o.data.body=value
    o.data.size=size
    o.data.align_x="CENTER"
    o.data.extrude=.0003
    o.data.materials.append(mat)
    bpy.ops.object.convert(target="MESH")
    return bpy.context.object

def feet(m,w=.47,d=.38):
    for x in [-w/2,w/2]:
        for y in [-d/2,d/2]:
            cylinder("Rubber foot",(x,y,.018),.035,.036,m["rubber"])

def microscope(m):
    feet(m,.32,.34)
    box("Cast enamel foot",(0,0,.065),(.44,.44,.075),m["white"],.025)
    box("Illuminator",(0,-.035,.12),(.21,.22,.035),m["dark"])
    cylinder("Lamp lens",(0,-.035,.148),.055,.018,m["glass"])
    box("Upright",(-.13,.12,.29),(.11,.12,.43),m["white"],.022,(0,-.15,0))
    box("Stage",(0,-.035,.28),(.34,.26,.04),m["dark"])
    for x in [-.09,.09]: box("Slide clip",(x,-.035,.307),(.025,.14,.012),m["steel"])
    box("Specimen slide",(0,-.04,.309),(.12,.055,.008),m["glass"],.001)
    cylinder("Nosepiece",(0,-.015,.40),.087,.045,m["steel"])
    for i in range(3):
        a=i*math.tau/3
        x,y=.05*math.cos(a),-.015+.05*math.sin(a)
        cylinder("Objective",(x,y,.353),.022,.07,m["steel"])
        cylinder("Objective collar",(x,y,.378),.024,.012,[m["red"],m["amber"],m["blue"]][i])
    cylinder("Optical tube",(0,.012,.49),.055,.18,m["white"],rot=(.28,0,0))
    cylinder("Eyepiece",(0,-.022,.58),.041,.075,m["dark"],rot=(.28,0,0))
    for x in [-.2,.0]:
        cylinder("Focus wheel",(x,.115,.30),.063,.04,m["dark"],rot=(0,math.pi/2,0))
        for i in range(12):
            a=i*math.tau/12
            box("Focus grip",(x,.115+.058*math.cos(a),.30+.058*math.sin(a)),(.043,.009,.009),m["rubber"],.001)
    text("Model label","EL-40X",(0,-.226,.077),.025,m["dark"])

def glassware(m,mode):
    box("Chemical spill tray",(0,0,.04),(.57,.43,.065),m["steel"])
    box("Rack",(0,.05,.14),(.48,.13,.035),m["dark"])
    for i in range(3):
        x=(i-1)*.16
        cylinder("Sample bottle",(x,.04,.22),.052,.16,m["glass"],r2=.046)
        cylinder("Cap",(x,.04,.315),.052,.035,m["dark"])
        box("Sample label",(x,-.013,.21),(.065,.008,.05),m["paper"],.001)
        text("Sample identifier",chr(65+i),(x,-.019,.20),.025,m["dark"])
        for j in range(3): box("Bottle graduation",(x+.035,-.014,.16+j*.026),(.022,.008,.004),m["white"],.001)
    if mode=="separation":
        cylinder("Support rod",(-.22,.14,.37),.012,.62,m["steel"])
        wire("Support arm",[(-.22,.14,.46),(0,.14,.46),(0,-.09,.46)],.009,m["steel"])
        cylinder("Funnel",(0,-.10,.42),.016,.14,m["glass"],r2=.10)
        cylinder("Funnel stem",(0,-.10,.30),.014,.13,m["glass"])
        cylinder("Receiver",(0,-.10,.14),.084,.17,m["glass"],r2=.062)
    else:
        cylinder("Beaker",(0,-.14,.16),.082,.18,m["glass"])
        torus("Beaker lip",(0,-.14,.25),.078,.004,m["white"])
        cylinder("Sample solution",(0,-.14,.13),.077,.09,m["blue"] if mode=="osmosis" else m["amber"])
        for i in range(4): box("Graduation",(.06,-.197,.12+i*.026),(.032,.005,.003),m["white"],.0005)

def balance(m):
    feet(m)
    box("Cast base",(0,0,.055),(.56,.42,.06),m["dark"])
    box("Pivot tower",(0,.015,.21),(.095,.13,.30),m["steel"])
    box("Pivot beam",(0,.0,.39),(.55,.045,.052),m["white"])
    for i in range(11): box("Scale mark",(-.25+i*.05,-.025,.405),(.003,.006,.018),m["dark"],0)
    cylinder("Pivot axle",(0,-.04,.39),.04,.07,m["steel"],rot=(math.pi/2,0,0))
    for x in [-.22,.22]:
        wire("Hanger",[(x,0,.39),(x,0,.25)],.009,m["steel"])
        cylinder("Slotted weight",(x,0,.21),.05,.065,m["amber"])
        cylinder("Weight top",(x,0,.249),.038,.015,m["steel"])
    text("Balance label","MOMENT RIG",(0,-.212,.055),.03,m["white"])

def density(m):
    feet(m)
    box("Scale housing",(-.1,0,.075),(.32,.36,.12),m["white"])
    box("Weighing pan",(-.1,.035,.146),(.26,.23,.025),m["steel"])
    box("Mass block",(-.1,.035,.205),(.10,.10,.09),m["copper"])
    box("Display",(-.10,-.186,.078),(.16,.016,.046),m["screen"])
    text("Reading","50.0 g",(-.10,-.197,.063),.025,m["white"])
    cylinder("Measuring cylinder",(.19,.04,.27),.067,.48,m["glass"])
    cylinder("Cylinder base",(.19,.04,.035),.10,.045,m["dark"])
    torus("Cylinder rim",(.19,.04,.51),.066,.005,m["white"])
    for i in range(15): box("Volume mark",(.23,-.015,.09+i*.027),(.032 if i%5==0 else .018,.004,.003),m["white"],0)

def console(m,kind):
    feet(m)
    box("Console base",(0,0,.065),(.56,.43,.085),m["dark"])
    box("Monitor stand",(0,.08,.19),(.13,.11,.22),m["steel"])
    box("Monitor bezel",(0,.07,.36),(.53,.12,.32),m["dark"],.019)
    box("Screen",(0,.005,.36),(.465,.013,.254),m["screen"],.003)
    text("Display heading",kind.upper(),(0,-.004,.438),.028,m["white"])
    for i in range(5):
        h=.03+.025*i
        box("Display bar",(-.17+i*.075,-.004,.28+h/2),(.04,.003,h),m["white"],0)
    box("Keyboard",(0,-.095,.13),(.45,.18,.035),m["steel"])
    for row in range(3):
        for i in range(9):
            box("Key",(-.18+i*.045,-.15+row*.045,.155),(.035,.03,.014),m["dark"],.002)
    for i in range(3): cylinder("Control button",(.20,-.13+i*.05,.145),.015,.013,[m["red"],m["amber"],m["teal"]][i])

def motor(m,kind):
    feet(m)
    box("Mounting plate",(0,0,.055),(.56,.42,.05),m["steel"])
    cylinder("Motor case",(-.06,0,.25),.125,.28,m["teal"],rot=(0,math.pi/2,0))
    for i in range(10):
        a=i*math.tau/10
        box("Cooling fin",(-.06,.12*math.cos(a),.25+.12*math.sin(a)),(.23,.028,.026),m["steel"],.002,(a,0,0))
    cylinder("Drive shaft",(.12,0,.25),.027,.17,m["steel"],rot=(0,math.pi/2,0))
    cylinder("Fan hub",(.21,0,.25),.044,.04,m["dark"],rot=(0,math.pi/2,0))
    for i in range(4):
        a=i*math.tau/4
        box("Fan blade",(.21,.07*math.cos(a),.25+.07*math.sin(a)),(.025,.14,.04),m["amber"],.004,(a,0,0))
    torus("Fan guard",(.23,0,.25),.146,.012,m["steel"],(0,math.pi/2,0))
    box("Meter housing",(0,-.17,.13),(.34,.095,.11),m["dark"])
    text("Meter text",kind.upper(),(0,-.22,.11),.03,m["white"])
    wire("Supply cable",[(-.2,.05,.18),(-.25,-.02,.10),(-.20,-.15,.1)],.014,m["rubber"])

def bench(m):
    box("Worktop",(0,0,1.01),(1.5,1.1,.10),m["dark"],.018)
    box("Splashback",(0,.50,1.13),(1.48,.06,.16),m["steel"])
    for x in [-.66,.66]:
        for y in [-.46,.46]:
            box("Tubular leg",(x,y,.50),(.065,.065,.95),m["steel"])
            box("Rubber pad",(x,y,.035),(.09,.09,.06),m["rubber"])
    box("Equipment shelf",(0,.04,.28),(1.30,.8,.045),m["steel"])
    for x in [-.43,0,.43]:
        box("Cabinet drawer",(x,-.44,.83),(.39,.14,.20),m["white"])
        box("Drawer handle",(x,-.53,.83),(.21,.04,.03),m["steel"])
    box("Socket plate",(0,.455,1.16),(.28,.025,.085),m["white"])
    for x in [-.065,.065]:
        for j in range(3): box("Socket contact",(x+(j-1)*.014,.438,1.16),(.007,.006,.019),m["dark"],0)

def generate(name,build):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablock in list(bpy.data.meshes):
        if datablock.users==0: bpy.data.meshes.remove(datablock)
    m=palette()
    build(m)
    # Preserve editable .blend scene, and export mesh-only GLB.
    bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE / (name+".blend")))
    path=OUT / (name+".glb")
    bpy.ops.export_scene.gltf(filepath=str(path),export_format="GLB",export_apply=True,export_cameras=False,export_lights=False)
    data=path.read_bytes()
    if data[:4]!=b"glTF" or len(data)>4_000_000: raise RuntimeError("Invalid or oversized asset: "+name)
    print("Generated",name,len(data),"bytes")
    return {"file":name+".glb","bytes":len(data),"sha256":hashlib.sha256(data).hexdigest()}

def main():
    builders={
      "microscope":microscope,
      "indicator":lambda m:glassware(m,"indicator"),
      "osmosis":lambda m:glassware(m,"osmosis"),
      "separation":lambda m:glassware(m,"separation"),
      "moments":balance,"density":density,
      "equation":lambda m:console(m,"reaction"),
      "graph":lambda m:console(m,"decay"),
      "variables":lambda m:console(m,"analysis"),
      "energy":lambda m:motor(m,"energy"),
      "spectrum":lambda m:motor(m,"spectrum"),
      "bench":bench}
    manifest=OUT / "manifest.json"
    if manifest.exists(): manifest.unlink()
    assets={name:generate(name,fn) for name,fn in builders.items()}
    manifest.write_text(json.dumps({"version":1,"assets":assets},indent=2),encoding="utf-8")
    print("SUCCESS:",len(assets),"assets exported to",OUT)

if __name__=="__main__": main()
