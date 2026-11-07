"""Render uberad frames deterministically via window.setT(t) (resumable: skips frames already on disk).
usage: python3 frames.py <outdir> <first> <last> [subframes]   (30 fps; subframes>1 = motion blur by averaging)"""
import sys, asyncio, os
from pathlib import Path
from playwright.async_api import async_playwright
from PIL import Image, ImageChops
HTML=str(Path(__file__).with_name('scene.html')); out=Path(sys.argv[1]); out.mkdir(parents=True,exist_ok=True)
a,b=int(sys.argv[2]),int(sys.argv[3]); SUB=int(sys.argv[4]) if len(sys.argv)>4 else 1
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files'])
        pg=await br.new_page(viewport={'width':1080,'height':1920}); await pg.goto('file://'+HTML); await pg.wait_for_function('window.READY===true',timeout=60000)
        for f in range(a,b+1):
            dst=out/f'f{f:04d}.jpg'
            if dst.exists(): continue
            acc=None
            for k in range(SUB):
                t=(f+(k/SUB-0.5+0.5/SUB)*0.5)/30 if SUB>1 else f/30
                await pg.evaluate(f'window.setT({t})')
                tmp=out/'_tmp.jpg'; await pg.screenshot(path=str(tmp),type='jpeg',quality=95); im=Image.open(tmp).convert('RGB')
                acc=im if acc is None else Image.blend(acc,im,1/(k+1))
            acc.save(dst,quality=93)
        await br.close()
asyncio.run(main())
