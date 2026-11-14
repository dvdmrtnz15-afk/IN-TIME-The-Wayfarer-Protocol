"""Browser verification. Uses exact HTML via set_content because URL navigation
is restricted in this environment. Real localStorage origin persistence is NOT
certified by this harness. Test-only acceleration supplies normal core inputs."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, time
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'dist/IN_TIME_PLAY.html').read_text()
checks=[];errors=[];requests=[]
def check(name,condition):
    assert condition,name
    checks.append(name)
def run(mode='desktop'):
  with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader'])
    mobile=mode=='mobile'
    page=browser.new_page(viewport={'width':390 if mobile else 1440,'height':844 if mobile else 900},device_scale_factor=1,is_mobile=mobile,has_touch=mobile)
    page.set_default_timeout(5000)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('request',lambda r:requests.append(r.url))
    page.evaluate('window.__INTIME_TEST__=true')
    page.set_content(HTML);page.wait_for_timeout(600)
    check('title and renderer initialize',page.locator('#begin').is_visible() and page.evaluate('!!IT.app'))
    check('storage-unavailable fallback is truthful',not page.evaluate('IT.app.diagnostics().storageAvailable'))
    page.locator('#title-help').click();check('title field guide opens',page.locator('#modal-title').inner_text()=='Your past is a partner.')
    page.locator('#modal-close').click();page.locator('#begin').click();page.wait_for_timeout(400)
    check('new game enters playing mode',page.evaluate("IT.app.snapshot().mode==='playing'"))
    if mobile:
      box=page.locator('#joystick').bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
      before=page.evaluate('IT.app.snapshot().player')
      touch=page.context.new_cdp_session(page)
      touch.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x+28,'y':y}]})
      page.wait_for_timeout(600);touch.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
      after=page.evaluate('IT.app.snapshot().player');check('touch joystick moves player',abs(after['x']-before['x'])>.3)
      page.locator('#touch-echo').tap();check('touch echo creates a recording',page.evaluate('IT.app.snapshot().echoes.length===1'))
      page.locator('#map-button').tap();check('mobile map opens',page.locator('.district-map').is_visible());page.locator('#modal-close').tap()
      check('portrait has no horizontal document overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
      page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'evidence/game-mobile.png'))
      page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(350)
      check('landscape touch controls stay visible',page.locator('#touch-echo').is_visible() and page.locator('#joystick').is_visible())
      page.screenshot(path=str(ROOT/'evidence/game-mobile-landscape.png'))
    else:
      before=page.evaluate('IT.app.snapshot().player')
      page.keyboard.down('KeyD');page.wait_for_timeout(650);page.keyboard.up('KeyD')
      after=page.evaluate('IT.app.snapshot().player');check('real keyboard input moves player',abs(after['x']-before['x'])>.5)
      page.keyboard.press('KeyQ');check('keyboard rewind creates echo',page.evaluate('IT.app.snapshot().echoes.length===1'))
      page.locator('#map-button').click();t=page.evaluate('IT.app.snapshot().remaining');page.wait_for_timeout(250)
      check('map pauses time',page.evaluate('IT.app.snapshot().remaining')==t)
      page.screenshot(path=str(ROOT/'evidence/map-desktop.png'));page.locator('#modal-close').click()
      page.locator('#pause-button').click();page.get_by_role('button',name='Retry this checkpoint',exact=True).click()
      check('checkpoint retry clears echoes without broken UI',page.evaluate("IT.app.snapshot().mode==='playing' && IT.app.snapshot().echoes.length===0"))
      page.evaluate('IT.app.walkTo({x:2,z:17})');page.wait_for_function('Math.hypot(IT.app.snapshot().player.x-2,IT.app.snapshot().player.z-17)<.3')
      page.keyboard.press('KeyE');check('proximity interaction opens authored dialogue',page.locator('#dialogue-panel').is_visible())
      t=page.evaluate('IT.app.snapshot().remaining');page.wait_for_timeout(250);check('dialogue pauses clock',page.evaluate('IT.app.snapshot().remaining')==t)
      page.locator('#dialogue-choices button').first.click()
      # Test fixed-step acceleration is activated explicitly; rendering/UI are unchanged.
      page.evaluate('IT.qa.freeze()');page.add_script_tag(content=(ROOT/'tests/browser_route.js').read_text())
      for stage in range(3):
        for ident in [['relay-a'],['archive-a','archive-b'],['final-a','final-b']][stage]:
          page.evaluate('(id)=>routeTo(IT.WORLD.plates.find(p=>p.id===id))',ident)
          page.keyboard.press('KeyQ')
        page.evaluate('waitForEchoes()')
        check('gate '+str(stage+1)+' opens from actual echo occupancy',page.evaluate('(s)=>IT.gateOpen(IT.qa.state(),IT.WORLD.gates[s])',stage))
        if stage==1:
          page.wait_for_timeout(180);page.screenshot(path=str(ROOT/'evidence/two-echo-puzzle.png'))
        page.evaluate('(id)=>routeTo(IT.WORLD.nodes.find(n=>n.id===id))','memory-'+str(stage+1))
        page.keyboard.press('KeyE');check('memory '+str(stage+1)+' opens real dialogue',page.locator('#dialogue-panel').is_visible());page.locator('#dialogue-choices button').first.click()
        page.evaluate('(s)=>routeTo(IT.WORLD.nodes.find(n=>n.id===IT.WORLD.gates[s].id))',stage)
        page.keyboard.press('KeyE')
        if stage<2:
          page.locator('#dialogue-choices button').first.click();check('checkpoint '+str(stage+1)+' advances',page.evaluate('IT.qa.state().stage')==stage+1)
        else:
          check('two ending choices become available',page.get_by_role('button',name='Restore the district',exact=True).is_visible() and page.get_by_role('button',name='Carry the signal away',exact=True).is_visible())
          page.get_by_role('button',name='Restore the district',exact=True).click()
      check('full browser route reaches home ending',page.evaluate("IT.app.snapshot().ending==='home'"))
      page.wait_for_timeout(200);page.screenshot(path=str(ROOT/'evidence/ending-desktop.png'))
      with page.expect_download() as d:
          page.get_by_role('button',name='Export this ending',exact=True).click()
      save=ROOT/'evidence/browser-exported-save.json';d.value.save_as(str(save))
      check('browser downloads a complete save',save.stat().st_size>500)
      page.get_by_role('button',name='Begin another timeline',exact=True).click();check('new game resets ended state',page.evaluate("IT.app.snapshot().stage===0 && IT.app.snapshot().mode==='playing'"))
      page.locator('#save-input').set_input_files(str(save));page.wait_for_timeout(250)
      check('imported save restores ending in the UI',page.evaluate("IT.app.snapshot().ending==='home' && IT.app.snapshot().mode==='ended'"))
      bad=ROOT/'evidence/invalid-save.json';bad.write_text('{bad json')
      page.locator('#save-input').set_input_files(str(bad));page.wait_for_timeout(180)
      check('invalid import preserves existing game',page.evaluate("IT.app.snapshot().ending==='home'"))
      page.get_by_role('button',name='Begin another timeline',exact=True).click();page.evaluate('IT.qa.advance({},21600)')
      check('time failure renders retry controls',page.get_by_role('button',name='Retry checkpoint',exact=True).is_visible())
      page.get_by_role('button',name='Retry checkpoint',exact=True).click();check('failure retry returns to playable game',page.evaluate("IT.app.snapshot().mode==='playing'"))
      page.evaluate("window.dispatchEvent(new Event('blur'))");check('focus loss opens a paused state',page.evaluate("IT.app.snapshot().mode==='paused'"))
      page.get_by_role('button',name='Return to the city',exact=True).click()
      page.wait_for_timeout(300);page.screenshot(path=str(ROOT/'evidence/game-desktop.png'))
    check('no browser JavaScript errors',not errors);check('no external requests',not requests)
    report={'mode':mode,'checks':checks,'passed':len(checks),'errors':errors,'requests':requests,'renderer':page.evaluate('IT.app.diagnostics().renderer'),'navigation':'exact standalone bytes injected via set_content','localStorage':'unavailable-origin fallback tested; origin persistence not certified','playthrough':'normal-input fixed-step acceleration, no coordinate or quest overrides' if not mobile else 'pointer touch events and actual touch button taps','timestamp':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
    (ROOT/('evidence/browser-'+mode+'.json')).write_text(json.dumps(report,indent=2))
    print(json.dumps(report,indent=2));browser.close()
if __name__=='__main__':
  import sys
  run(sys.argv[1] if len(sys.argv)>1 else 'desktop')
