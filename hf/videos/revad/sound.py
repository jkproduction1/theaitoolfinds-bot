"""revad sound (placeholder until Jan sends his music): our track t1 + felt SFX (taps, whooshes on cuts, notification, NFC chime, end tone), limiter."""
import numpy as np, subprocess, json, sys, wave
from pathlib import Path
SR=44100; DUR=13.0; N=int(SR*DUR); rng=np.random.default_rng(3); out=np.zeros((N,2))
T={"tap":1.0,"grow":1.12,"s2":1.4,"notif":2.1,"push":2.95,"s3":3.2,"conv":4.0,"exTap":4.95,"s4":5.4,"nfc":6.7,"paid":6.95,"s5":7.6,"s6":8.6,"end":10.6}
def add(x,at,g=1.0):
    i=int(at*SR); j=min(N,i+len(x)); out[i:j,0]+=x[:j-i]*g; out[i:j,1]+=x[:j-i]*g
def tone(f,d,dec,g):
    s=np.arange(int(d*SR))/SR; return np.sin(2*np.pi*f*s)*np.exp(-s*dec)*g
def whoosh(d=.45,g=.08):
    n=int(d*SR); s=np.arange(n)/SR; w=rng.standard_normal(n); a=np.linspace(.03,.3,n)**1.6; y=np.empty(n); z=0.0
    for i in range(n): z+=a[i]*(w[i]-z); y[i]=z
    return y*np.sin(np.pi*s/d)**2*g
add(tone(90,.16,30,.12)+np.pad(tone(1500,.05,80,.03),(0,int(.11*SR))),T["tap"])
add(tone(90,.16,30,.1)+np.pad(tone(1500,.05,80,.03),(0,int(.11*SR))),T["exTap"])
for k in ("grow","s3","s4","s5","s6","end"): add(whoosh(),T[k]-.22)
add(tone(1320,.25,14,.045)+np.pad(tone(1760,.2,16,.035),(int(.09*SR),0))[:int(.25*SR)],T["notif"])
for i in range(3): add(tone(2093+i*300,.3,10,.035),T["nfc"]+i*.12)
add(tone(1568,.35,9,.05)+np.pad(tone(2093,.3,10,.04),(int(.08*SR),0))[:int(.35*SR)],T["paid"])
for i in range(6): add(tone(1900+i*120,.04,110,.025),T["conv"]+.55+i*.07)
s=np.arange(int(1.6*SR))/SR; add((np.sin(2*np.pi*55*s)+.4*np.sin(2*np.pi*110*s))*np.exp(-s*2.2)*np.clip(s/.08,0,1)*.07,T["end"]+.05)
W=Path(sys.argv[1]); W.mkdir(parents=True,exist_ok=True); out=np.clip(out,-1,1)
with wave.open(str(W/"sfx.wav"),"wb") as f: f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype("<i2").tobytes())
H=Path(__file__).resolve().parents[3]; tr=json.load(open(H/"video/public/music/tracks.json"))["t1"]
subprocess.run(["ffmpeg","-v","error","-y","-ss",str(tr["hook_start"]),"-i",str(H/"video/public/music/t1.mp3"),"-i",str(W/"sfx.wav"),"-filter_complex",
  f"[0:a]atrim=0:{DUR},asetpts=PTS-STARTPTS,volume=0.18,afade=t=in:d=0.3,afade=t=out:st={DUR-1.2}:d=1.2[m];[m][1:a]amix=inputs=2:normalize=0,atrim=0:{DUR},alimiter=limit=0.89[o]","-map","[o]","-ar","44100",str(W/"mix.wav")],check=True)
print("ok")
