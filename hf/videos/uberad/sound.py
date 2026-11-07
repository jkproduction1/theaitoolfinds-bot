"""uberad sound: everything synthesized here (rain, ticks, whoosh, engine, door, haptics, end tone) + our music track t2.
Story beat: at the moment the phone dies (11.15 s) everything goes silent; one soft low tone under the end card."""
import numpy as np, subprocess, json, sys
from pathlib import Path
SR=44100; DUR=13.0; N=int(SR*DUR); rng=np.random.default_rng(7)
T={"type0":.3,"type1":.8,"confirm":1.0,"fly0":1.15,"c3":3.2,"n1":3.55,"c4":5.8,"n2":5.9,"ride0":5.95,"c5":8.2,"arrHome":9.3,"n3":9.45,"die":10.6,"end":11.0}
t=np.arange(N)/SR; out=np.zeros((N,2))
def lp(x,a):  # one-pole lowpass
    y=np.empty_like(x); s=0.0
    for i in range(len(x)): s+=a*(x[i]-s); y[i]=s
    return y
def env(n,a,d): e=np.ones(n); A=int(a*SR); D=int(d*SR); e[:A]=np.linspace(0,1,A) if A else 1; e[-D:]*=np.linspace(1,0,D); return e
def add(x,at,gain=1.0,pan=0.0):
    i=int(at*SR); j=min(N,i+len(x)); x=x[:j-i]*gain; out[i:j,0]+=x*(1-pan)/1; out[i:j,1]+=x*(1+pan)/1
# rain bed (two decorrelated filtered noises)
def rain():
    L=np.zeros(N); R=np.zeros(N)
    for ch in (L,R):
        n=rng.standard_normal(N); hp=n-lp(n,.02); ch+=lp(hp,.35)*.06
        drops=np.zeros(N); idx=rng.integers(0,N,2600); drops[idx]=rng.uniform(.2,1,len(idx)); ch+=lp(drops,.5)*.05
    g=np.clip(t/.6,0,1)*np.where(t<T["die"],1,np.clip(1-(t-T["die"])/.12,0,1)); return L*g,R*g
L,R=rain(); out[:,0]+=L; out[:,1]+=R
def tick(f=2400,d=.05,g=.12):
    n=int(d*SR); x=np.sin(2*np.pi*f*np.arange(n)/SR)*np.exp(-np.arange(n)/SR*90); return x*g
for k in range(4): add(tick(3000,.04,.06), T["type0"]+k*(T["type1"]-T["type0"])/4, pan=.1)
add(tick(1600,.08,.12), T["confirm"])
def haptic():
    n=int(.22*SR); s=np.arange(n)/SR; x=(np.sin(2*np.pi*1320*s)*np.exp(-s*60)*.09+np.sin(2*np.pi*90*s)*np.exp(-s*25)*.22)
    x[int(.09*SR):]+=(np.sin(2*np.pi*1760*s[:n-int(.09*SR)])*np.exp(-s[:n-int(.09*SR)]*60)*.07); return x
for k in ("n1","n2","n3"): add(haptic(), T[k])
def whoosh(d=1.3):
    n=int(d*SR); s=np.arange(n)/SR; w=rng.standard_normal(n); a=np.linspace(.02,.35,n)**1.5
    y=np.empty(n); z=0.0
    for i in range(n): z+=a[i]*(w[i]-z); y[i]=z
    return y*np.sin(np.pi*s/d)**2*.35
add(whoosh(), T["fly0"]-.1)
for k in ("c3","c4","c5"): add(whoosh(.6)*.6, T[k]-.3)
# engine: low rumble while the car is on screen, louder while it moves
def engine():
    n=N; s=t; base=55+12*np.sin(2*np.pi*.2*s)
    ph=np.cumsum(2*np.pi*base/SR); x=(np.sin(ph)*.5+np.sin(2*ph)*.25+lp(rng.standard_normal(n),.01)*1.5)
    g=np.clip((s-3.2)/.5,0,1)*np.clip((T["arrHome"]+.3-s)/.6,0,1)*.05; return x*g
out[:,0]+=engine(); out[:,1]+=engine()
def thunk():
    n=int(.35*SR); s=np.arange(n)/SR; return (np.sin(2*np.pi*70*s)*np.exp(-s*22)+lp(rng.standard_normal(n),.08)*np.exp(-s*40)*2)*.25
add(thunk(), T["ride0"]-.35, pan=-.2)
# end tone
def tone():
    n=int(1.4*SR); s=np.arange(n)/SR; x=(np.sin(2*np.pi*55*s)+.5*np.sin(2*np.pi*110*s)+.15*np.sin(2*np.pi*220*s))*np.exp(-s*1.6)*np.clip(s/.05,0,1); return x*.22
add(tone(), T["end"]+.1)
# female VO (ElevenLabs, per-job voice) placed line by line
import json as _j
H0=Path(__file__).parent; vw=_j.load(open(H0/"voice.json")); vraw=H0/"media"/"voice.mp3"
if vraw.exists():
    pcm=subprocess.run(["ffmpeg","-v","error","-i",str(vraw),"-f","s16le","-ac","1","-ar",str(SR),"-"],capture_output=True,check=True).stdout
    v=np.frombuffer(pcm,dtype="<i2").astype(np.float64)/32768
    LINES=[(0,3,.15),(4,5,2.0),(6,10,3.45),(11,13,5.95),(14,17,9.0)]
    for a,b,at in LINES:
        s0=max(0,vw[a]["start"]-.05); s1=vw[b]["end"]+.12; seg=v[int(s0*SR):int(s1*SR)].copy(); f=int(.01*SR); seg[:f]*=np.linspace(0,1,f); seg[-f:]*=np.linspace(1,0,f)
        add(seg, at, gain=1.0)
out=np.clip(out,-1,1); W=Path(sys.argv[1]); W.mkdir(parents=True,exist_ok=True)
import wave
with wave.open(str(W/"sfx.wav"),"wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype("<i2").tobytes())
H=Path(__file__).resolve().parents[3]; tr=json.load(open(H/"video/public/music/tracks.json"))["t2"]
subprocess.run(["ffmpeg","-v","error","-y","-ss",str(tr["hook_start"]),"-i",str(H/"video/public/music/t2.mp3"),"-i",str(W/"sfx.wav"),"-filter_complex",
  f"[0:a]atrim=0:{DUR},asetpts=PTS-STARTPTS,volume=0.11,afade=t=in:d=0.8,afade=t=out:st={T['die']-0.25}:d=0.3[m];[1:a]volume=1.0[s];[m][s]amix=inputs=2:normalize=0,atrim=0:{DUR}[o]",
  "-map","[o]","-ar","44100",str(W/"mix.wav")],check=True)
print("ok", W/"mix.wav")
