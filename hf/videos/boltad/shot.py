import asyncio,sys
from pathlib import Path
from playwright.async_api import async_playwright
H=str(Path(__file__).with_name('frames.html'))
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files'])
        pg=await br.new_page(viewport={'width':1080,'height':1920})
        pg.on('console',lambda m:print('C',m.text)); pg.on('pageerror',lambda e:print('ERR',e))
        for f in sys.argv[2:]:
            await pg.goto(f'file://{H}?f={f}'); await pg.wait_for_function('window.READY===true',timeout=60000); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'{sys.argv[1]}/sf{f}.png')
        await br.close()
asyncio.run(main())
