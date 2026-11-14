from pathlib import Path
from playwright.sync_api import sync_playwright
import json, time
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader'])
    page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
    errors=[];requests=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.on('request',lambda r: requests.append(r.url))
    page.set_content((ROOT/'dist/IN_TIME_PLAY.html').read_text());page.wait_for_timeout(1500)
    page.screenshot(path=str(ROOT/'evidence/title-desktop.png'))
    print('TITLE',page.title(),'ERRORS',errors)
    page.locator('#begin').click();page.wait_for_timeout(1500)
    print('STATE',page.evaluate('IT.app.snapshot()'))
    page.screenshot(path=str(ROOT/'evidence/game-desktop.png'))
    page.keyboard.down('KeyD');page.wait_for_timeout(700);page.keyboard.up('KeyD')
    page.locator('#map-button').click();page.wait_for_timeout(200)
    page.screenshot(path=str(ROOT/'evidence/map-desktop.png'))
    print('ERRORS',errors,'REQUESTS',requests)
    browser.close()
