"""penguin10 sound: house track t1 from its hook + soft SFX on every style switch (wipe swish L→R + glassy tick), tile pops + chime at the CTA."""
import numpy as np, subprocess, sys, wave, json
from pathlib import Path
SR=44100; DUR=16.2; N=int(SR*DUR); rng=np.random.default_rng(3); out=np.zeros((N,2))
BEAT=.3946; ST=[BEAT*(4+3*i) for i in range(9)]; CTA=BEAT*31
def put(x,at,g=1.0,pan=0.0):
    i=int(at*SR); j=min(N,i+len(x)); x=x[:j-i]*g
    p=pan if np.isscalar(pan) else pan[:j-i]
    out[i:j,0]+=x*np.sqrt(.5*(1-p)); out[i:j,1]+=x*np.sqrt(.5*(1+p))
def env(n,a,r): e=np.ones(n); A=max(1,int(a*SR)); e[:A]=np.linspace(0,1,A)**2; e*=np.exp(-np.arange(n)/SR*r); return e
def sine(f,d,a=.002,r=20): n=int(d*SR); s=np.arange(n)/SR; return np.sin(2*np.pi*f*s)*env(n,a,r)
def bp(n,lo,hi):
    X=np.fft.rfft(rng.standard_normal(n)); f=np.fft.rfftfreq(n,1/SR); X[(f<lo)|(f>hi)]=0; y=np.fft.irfft(X,n); return y/np.max(np.abs(y)+1e-9)
def swish(at,d=.24,g=.05):
    n=int(d*SR); s=np.arange(n)/d/SR; y=bp(n,1500,7000)*np.sin(np.pi*s)**2; put(y,at-.04,g,np.linspace(-.6,.6,n))
def tick(at,f,g=.03): put(sine(f,.08,.001,70)+.4*sine(f*1.5,.08,.001,90),at,g)
for i,t in enumerate(ST): swish(t); tick(t+.02,1900+i*110)
for i in range(10): put(sine(900+i*70,.12,.001,45),CTA+.04*i+.05,.022)
for i,f in enumerate([1318.5,1760,2093]): put(sine(f,1.0,.003,4)+.3*sine(f*2,1.0,.003,6),CTA+.32+i*.07,.035*(.85**i))
W=Path(sys.argv[1])
# voice: each style name placed on its switch, "Comment penguin" on the grid
VO=W/"voice.mp3"
if VO.exists():
    raw=subprocess.run(["ffmpeg","-v","error","-i",str(VO),"-f","f32le","-ac","1","-ar",str(SR),"-"],capture_output=True,check=True).stdout
    v=np.frombuffer(raw,np.float32); words=json.load(open(W/"voice.json"))
    groups=[];i=0
    for n in [2,2,2,2,2,2,1,2,2,2,2]: groups.append(words[i:i+n]); i+=n
    at=[.06]+[t+.05 for t in ST]+([] if (W/"voice_cta.mp3").exists() else [CTA+.3])
    win=int(.006*SR); en=np.sqrt(np.convolve(v**2,np.ones(win)/win,'same'))
    def quiet(t0,t1):  # quietest sample between two times (cut point in the gap between words)
        i0,i1=int(t0*SR),max(int(t0*SR)+1,int(t1*SR)); return i0+int(np.argmin(en[i0:i1]))
    cuts=[quiet(max(0,groups[0][0]["start"]-.12),groups[0][0]["start"])]
    for g,h in zip(groups,groups[1:]): cuts.append(quiet(g[-1]["end"]-.02,h[0]["start"]+.03))
    cuts.append(min(len(v)-1,int((groups[-1][-1]["end"]+.25)*SR)))
    edge=[]
    for k,(g,t0) in enumerate(zip(groups,at)):
        a0,a1=cuts[k],cuts[k+1]; seg=v[a0:a1].copy(); f=int(.008*SR); seg[:f]*=np.linspace(0,1,f); seg[-f:]*=np.linspace(1,0,f)
        edge.append((round(float(en[a0]),4),round(float(en[a1]),4)))
        put(seg,t0-(g[0]["start"]-a0/SR),1.3)
    print("edge rms",edge)
    CV=W/"voice_cta.mp3"
    if CV.exists():
        raw=subprocess.run(["ffmpeg","-v","error","-i",str(CV),"-f","f32le","-ac","1","-ar",str(SR),"-"],capture_output=True,check=True).stdout
        put(np.frombuffer(raw,np.float32).copy(),CTA+.3,1.3)
out=np.clip(out,-1,1)
with wave.open(str(W/"sfx.wav"),"wb") as f: f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype("<i2").tobytes())
M=Path(__file__).resolve().parents[3]/"video/public/music"; hs=json.load(open(M/"tracks.json"))["t1"]["hook_start"]
subprocess.run(["ffmpeg","-v","error","-y","-ss",str(hs),"-i",str(M/"t1.mp3"),"-i",str(W/"sfx.wav"),"-filter_complex",
  f"[0:a]atrim=0:{DUR},asetpts=PTS-STARTPTS,volume=0.12,afade=t=in:d=0.05,afade=t=out:st={DUR-1.0}:d=1.0[m];[m][1:a]amix=inputs=2:normalize=0,atrim=0:{DUR},alimiter=limit=0.89:attack=4:release=80[o]",
  "-map","[o]","-ar","44100",str(W/"mix.wav")],check=True)
print("ok")
