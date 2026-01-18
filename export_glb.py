import bpy
import sys
from pathlib import Path

argv = sys.argv
argv = argv[argv.index("--") + 1:] if "--" in argv else []
out_path = Path(argv[0]) if argv else Path("out.glb")

bpy.ops.object.select_all(action='SELECT')

bpy.ops.export_scene.gltf(
    filepath=str(out_path),
    export_format='GLB',
    export_apply=True,
    export_yup=True,
)

print(f"Exported -> {out_path}")
