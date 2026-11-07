"""uberad -> HyperFrames project hf/work/uberad (index.html drives window.setT from a paused GSAP timeline), sound via sound.py."""
import re, shutil, subprocess, sys
from pathlib import Path
HERE=Path(__file__).parent; H=HERE.parent.parent; W=H/"work"/"uberad"; A=W/"assets"; A.mkdir(parents=True,exist_ok=True); (A/"fonts").mkdir(exist_ok=True)
for f in (H/"template").iterdir(): shutil.copy(f,W/f.name)
shutil.copy(H/"assets"/"gsap.min.js",A)
for f in (HERE/"media").iterdir(): shutil.copy(f,A/f.name)
for w in ("Regular","Medium","SemiBold","Bold"): shutil.copy(f"/usr/share/fonts/opentype/inter/InterDisplay-{w}.otf",A/"fonts")
shutil.copy(HERE/"scene.js",A/"scene.js")
subprocess.run([sys.executable,str(HERE/"sound.py"),str(A)],check=True)
src=(HERE/"scene.html").read_text()
css=re.search(r"<style>(.*?)</style>",src,re.S).group(1).replace("file:///usr/share/fonts/opentype/inter/","assets/fonts/")
body=re.search(r'<div id="root">(.*)</div>\s*<script src="scene.js">',src,re.S).group(1)
DUR=13.0
html=f'''<!doctype html><html lang="en" data-resolution="portrait"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920">
<script src="assets/gsap.min.js"></script><script src="assets/three.min.js"></script><script src="assets/three-extras.js"></script><script src="assets/studio_exr.js"></script>
<style>*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1080px;height:1920px;overflow:hidden;background:#0A0A0B}}{css}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920" data-motion-blur="on">
<div id="s0" class="clip" data-start="0" data-duration="{DUR}" data-track-index="1" style="position:absolute;inset:0">{body}</div>
<audio id="fx" class="clip" src="assets/mix.wav" data-start="0" data-duration="{DUR}" data-track-index="20" data-volume="1"></audio>
</div>
<script src="assets/scene.js"></script>
<script>const tl=gsap.timeline({{paused:true}});const clock={{t:0}};tl.fromTo(clock,{{t:0}},{{t:{DUR},duration:{DUR},ease:'none',onUpdate:()=>window.setT(clock.t)}},0);window.setT(0);
window.__timelines['main']=tl; tl.seek(0);</script></body></html>'''
(W/"index.html").write_text(html); print("ok",W)
