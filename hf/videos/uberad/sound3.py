"""uberad v3 sound: everything synthesized + music t2 + energetic female VO (ElevenLabs 'Jessica', per-job voice_id).
SFX are felt, not heard: rain/street only under the 3D shots, UI shots are clean; soft ticks/haptics on taps; final limiter."""
import numpy as np, subprocess, json, sys, wave
from pathlib import Path
SR=44100; DUR=13.0; N=int(SR*DUR); rng=np.random.default_rng(7); t=np.arange(N)/SR; out=np.zeros((N,2))
T={"tap":1.05,"grow0":1.18,"s2":1.45,"chip":1.95,"s3":3.0,"iris":3.62,"arrPick":4.9,"s4":5.0,"s5":5.95,"s6":8.0,"s7":8.75,"arrHome":9.45,"s8":10.0,"doneTap":10.95,"wipe":11.15,"end":11.45}
def lp(x,a):
    y=np.empty_like(x); s=0.0
    for i in range(len(x)): s+=a*(x[i]-s); y[i]=s
    return y
def add(x,at,g=1.0,pan=0.0):
    i=int(at*SR); j=min(N,i+len(x)); x=x[:j-i]*g; out[i:j,0]+=x*(1-pan); out[i:j,1]+=x*(1+pan)
def gate(a,b,f=.08): return np.clip((t-a)/f,0,1)*np.clip((b-t)/f,0,1)
# street bed only in 3D shots
G3=np.maximum.reduce([gate(T["iris"],T["s4"]),gate(T["s5"]-.1,T["s6"]),gate(T["s7"],T["s8"])])
for ch in (0,1):
    n=rng.standard_normal(N); hp=n-lp(n,.02); d=np.zeros(N); d[rng.integers(0,N,2200)]=rng.uniform(.2,1,2200)
    out[:,ch]+=(lp(hp,.35)*.035+lp(d,.5)*.03)*G3
ph=np.cumsum(2*np.pi*(52+10*np.sin(2*np.pi*.3*t))/SR); eng=(np.sin(ph)*.5+np.sin(2*ph)*.2+lp(rng.standard_normal(N),.01)*1.2)*.03
out[:,0]+=eng*G3; out[:,1]+=eng*G3
def tick(f=2600,d=.04,g=.035):
    n=int(d*SR); s=np.arange(n)/SR; return np.sin(2*np.pi*f*s)*np.exp(-s*110)*g
def haptic(g=.12):
    n=int(.16*SR); s=np.arange(n)/SR; return (np.sin(2*np.pi*95*s)*np.exp(-s*30)*g+np.sin(2*np.pi*1500*s)*np.exp(-s*80)*.03)
def whoosh(d=.45,g=.1):
    n=int(d*SR); s=np.arange(n)/SR; w=rng.standard_normal(n); a=np.linspace(.03,.3,n)**1.6; y=np.empty(n); z=0.0
    for i in range(n): z+=a[i]*(w[i]-z); y[i]=z
    return y*np.sin(np.pi*s/d)**2*g
for k in range(4): add(tick(), .22+k*.08, pan=.1)
add(haptic(), T["tap"]); add(tick(1800,.06,.05), T["tap"])
for k in ("grow0","s3","iris","s4","s5","s6","s7","s8","wipe"): add(whoosh(), T[k]-.2)
add(haptic(.09), T["chip"]+.1)
for i in range(5): add(tick(1900+i*180,.05,.04), T["chip"]+.15+i*.1)        # odometer clicks
add(haptic(.1), T["s4"]+.05); add(haptic(.1), T["s6"]+.05)
for i in range(5): add(tick(1400+i*220,.07,.05), T["s8"]+.25+i*.12)          # stars
add(haptic(), T["doneTap"])
n=int(.3*SR); s=np.arange(n)/SR; add((np.sin(2*np.pi*70*s)*np.exp(-s*24))*.12, T["s5"]-.35, pan=-.2)  # door
n=int(1.6*SR); s=np.arange(n)/SR; add((np.sin(2*np.pi*55*s)+.4*np.sin(2*np.pi*110*s))*np.exp(-s*2.2)*np.clip(s/.08,0,1)*.07, T["end"]+.05)
# VO
H0=Path(__file__).parent; vw=json.load(open(H0/"voice3.json"))
pcm=subprocess.run(["ffmpeg","-v","error","-i",str(H0/"media"/"voice3.mp3"),"-f","s16le","-ac","1","-ar",str(SR),"-"],capture_output=True,check=True).stdout
v=np.frombuffer(pcm,dtype="<i2").astype(np.float64)/32768
for a,b,at in [(0,1,.72),(2,4,1.95),(5,7,5.05),(8,9,8.02),(10,11,10.2)]:
    s0=max(0,vw[a]["start"]-.04); s1=vw[b]["end"]+.1; seg=v[int(s0*SR):int(s1*SR)].copy(); f=int(.008*SR); seg[:f]*=np.linspace(0,1,f); seg[-f:]*=np.linspace(1,0,f); add(seg,at,.9)
W=Path(sys.argv[1]); W.mkdir(parents=True,exist_ok=True); out=np.clip(out,-1,1)
with wave.open(str(W/"sfx3.wav"),"wb") as f: f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype("<i2").tobytes())
H=Path(__file__).resolve().parents[3]; tr=json.load(open(H/"video/public/music/tracks.json"))["t1"]
subprocess.run(["ffmpeg","-v","error","-y","-ss",str(tr["hook_start"]),"-i",str(H/"video/public/music/t1.mp3"),"-i",str(W/"sfx3.wav"),"-filter_complex",
  f"[0:a]atrim=0:{DUR},asetpts=PTS-STARTPTS,volume=0.13,afade=t=in:d=0.4,afade=t=out:st={T['wipe']}:d=0.5[m];[m][1:a]amix=inputs=2:normalize=0,atrim=0:{DUR},alimiter=limit=0.89:attack=5:release=60[o]",
  "-map","[o]","-ar","44100",str(W/"mix3.wav")],check=True)
print("ok")
