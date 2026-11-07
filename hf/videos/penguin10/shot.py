import asyncio,sys
from pathlib import Path
from playwright.async_api import async_playwright
H=str(Path(__file__).with_name('scene.html'))
async def main():
    out=Path(sys.argv[1]);out.mkdir(parents=True,exist_ok=True)
    async with async_playwright() as p:
        br=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files'])
        pg=await br.new_page(viewport={'width':1080,'height':1920})
        pg.on('pageerror',lambda e:print('ERR',e))
        await pg.goto('file://'+H); await pg.wait_for_function('window.READY===true',timeout=90000)
        for t in sys.argv[2:]:
            await pg.evaluate(f'window.setT({t})'); await pg.screenshot(path=str(out/f't{t}.jpg'),type='jpeg',quality=85)
        await br.close()
asyncio.run(main())
