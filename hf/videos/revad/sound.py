"""revad sound: Jan's track (Timeless instrumental, from 24 s) + crafted, felt SFX synced to scene.js T.
Whips get a stereo-panned noise sweep that follows the motion direction; landings get a soft sub thump; UI gets glassy ticks;
NFC + paid get a small chime; the end gets a gentle swell. Everything sits under the music and goes through a limiter."""
import numpy as np, subprocess, sys, wave
from pathlib import Path
SR=44100; DUR=13.0; N=int(SR*DUR); rng=np.random.default_rng(5); out=np.zeros((N,2))
B=lambda k:.03+.375*k
T=dict(tap=.42,c2=B(2),land=B(2)+.55,notif=B(4),c3=B(8),conv=B(10),exTap=B(12)+.15,c4=B(14),toTerm=B(16)+.1,nfc=B(17)+.05,paid=B(18),c5=B(20),c6=B(23),end=B(29))
def put(x,at,g=1.0,pan=0.0):
    i=int(at*SR); j=min(N,i+len(x)); x=x[:j-i]*g; out[i:j,0]+=x*np.sqrt(.5*(1-pan)); out[i:j,1]+=x*np.sqrt(.5*(1+pan))
def env(n,a,r): e=np.ones(n); A=max(1,int(a*SR)); e[:A]=np.linspace(0,1,A)**2; e*=np.exp(-np.arange(n)/SR*r); return e
def sine(f,d,a=.002,r=20): n=int(d*SR); s=np.arange(n)/SR; return np.sin(2*np.pi*f*s)*env(n,a,r)
def bp_noise(n,lo,hi):
    X=np.fft.rfft(rng.standard_normal(n)); f=np.fft.rfftfreq(n,1/SR); X[(f<lo)|(f>hi)]=0; y=np.fft.irfft(X,n); return y/np.max(np.abs(y)+1e-9)
def whoosh(d,up=True):
    n=int(d*SR); s=np.arange(n)/SR; y=np.zeros(n)
    for lo,hi,g in ((300,1200,.6),(1200,5000,.4)):
        seg=bp_noise(n,lo,hi); y+=seg*g
    shape=np.sin(np.pi*np.clip(s/d,0,1))**1.6; shape*=np.where(s/d<.55,(s/d/.55)**1.5,1)
    return y*shape
def whip(at,direction,g=.07):  # direction: 'down','up','left'
    w=whoosh(.42); n=len(w); pan=np.linspace(.35,-.35,n) if direction=='left' else np.zeros(n)
    i=int((at-.3)*SR); j=min(N,i+n); seg=w[:j-i]*g; p=pan[:j-i]; out[i:j,0]+=seg*np.sqrt(.5*(1-p)); out[i:j,1]+=seg*np.sqrt(.5*(1+p))
def thump(at,g=.16): n=int(.35*SR); s=np.arange(n)/SR; f=70*np.exp(-s*6)+38; put(np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.003,14),at,g)
def tick(at,f=2400,g=.03):
    a=sine(f,.05,.001,90); b=sine(f*1.5,.05,.001,110); put(a+.5*b,at,g)
def tap(at):
    a=sine(160,.12,.001,40)*.8; n=int(.03*SR); a[:n]+=bp_noise(n,2000,7000)*env(n,.0005,200)*.25; put(a,at,.12)
def chime(at,notes,g=.045,gap=.07):
    for i,f in enumerate(notes): put(sine(f,.9,.003,5)+.35*sine(f*2,.9,.003,7),at+i*gap,g*(.85**i))
tap(T['tap']); whip(T['c2'],'down'); thump(T['land']-.05,.12); thump(T['land']+.06,.08)
chime(T['notif'],[1318.5,1760],.035,.06)
whip(T['c3'],'down',.065); [tick(T['c3']+.2+i*.09,2200+i*90,.018) for i in range(9)]
tick(T['conv'],1800,.03); [tick(T['conv']+.55+i*.06,2600+i*60,.02) for i in range(7)]
tap(T['exTap']); whip(T['c4'],'left',.07); thump(T['c4']+.25,.08)
whip(T['toTerm']+.3,'down',.03)
[put(sine(2093+i*262,.5,.002,9),T['nfc']+i*.12,.03) for i in range(3)]
chime(T['paid'],[1568,2093,2637],.05,.06)
whip(T['c5'],'down',.06); whip(T['c6'],'up',.06)
[tick(T['c6']+.45+i*.16,1500+i*150,.03) for i in range(3)]
n=int(2.2*SR); s=np.arange(n)/SR; swell=(np.sin(2*np.pi*55*s)+.45*np.sin(2*np.pi*82.4*s)+.25*np.sin(2*np.pi*110*s))*np.clip(s/.6,0,1)*np.exp(-np.clip(s-.6,0,None)*1.4)
put(swell,T['end']-.1,.06)
W=Path(sys.argv[1]); W.mkdir(parents=True,exist_ok=True); out=np.clip(out,-1,1)
with wave.open(str(W/"sfx.wav"),"wb") as f: f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype("<i2").tobytes())
MUS=sys.argv[2]
subprocess.run(["ffmpeg","-v","error","-y","-ss","24","-i",MUS,"-i",str(W/"sfx.wav"),"-filter_complex",
  f"[0:a]atrim=0:{DUR},asetpts=PTS-STARTPTS,volume=0.55,afade=t=in:d=0.25,afade=t=out:st={DUR-1.4}:d=1.4[m];[m][1:a]amix=inputs=2:normalize=0,atrim=0:{DUR},alimiter=limit=0.89:attack=4:release=80[o]",
  "-map","[o]","-ar","44100",str(W/"mix.wav")],check=True)
print("ok")
