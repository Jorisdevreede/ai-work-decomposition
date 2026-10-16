import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('/Users/Joris.deVreede/.npm/_npx/420ff84f11983ee5/node_modules/playwright');
const dir=path.dirname(fileURLToPath(import.meta.url));
const base='http://localhost:8790/mockups/c-conversation/index.html';
const results={checkedAt:new Date().toISOString(),checks:[],opportunities:[],console:[],pageErrors:[],failedRequests:[],externalRequests:[]};
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
  for(const width of [1440,390]){
    const context=await browser.newContext({viewport:{width,height:width===1440?1000:844},reducedMotion:'reduce'});
    const page=await context.newPage();
    page.on('console',m=>{if(['warning','error'].includes(m.type()))results.console.push(m.text());});
    page.on('pageerror',e=>results.pageErrors.push(e.message));
    page.on('requestfailed',r=>results.failedRequests.push(r.url()));
    page.on('request',r=>{if(!r.url().startsWith('http://localhost:8790/')&&!r.url().startsWith('data:'))results.externalRequests.push(r.url());});
    const scan=async()=>{
      assert.doesNotMatch(await page.locator('body').innerText(),/\b\d{2}-\d{4}\.\d{2}\b|Task trace:|O\*NET|tasks? (?:1885[234]|268[79])/i,'No visible raw task references');
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
    };
    const capture=async name=>{
      await page.mouse.move(1,1);
      await page.waitForFunction(()=>!document.querySelector('.toast.visible'));
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      await scan();
      await page.screenshot({path:path.join(dir,'qa',`${name}-${width}.png`),fullPage:true,animations:'disabled'});
    };
    await page.goto(`${base}#/team`);
    await page.locator('.capacity-summary').waitFor();
    assert.equal(await page.locator('.estimate-strip').count(),0);
    assert.match(await page.locator('.capacity-summary').innerText(),/8,850 hours.*5.5 FTE.*EUR 586k/);
    assert.equal(await page.locator('.capacity-bar').getAttribute('role'),'img');
    assert.equal(await page.locator('.capacity-bar span').evaluate(e=>Math.round(e.getBoundingClientRect().width/e.parentElement.getBoundingClientRect().width*100)),55);
    await scan();results.checks.push({width,name:'Team twin uses one gross-estimate sentence and 55% capacity bar',passed:true});
    await page.goto(`${base}#/opportunities`);
    await page.locator('.opportunity-button').first().waitFor();
    assert.equal(await page.locator('.opportunity-button').count(),10);
    const ids=await page.locator('.opportunity-button').evaluateAll(els=>els.map(e=>e.dataset.id));
    for(const id of ids){
      const button=page.locator(`[data-action=open-opportunity][data-id="${id}"]`);
      const name=await button.locator('h3').innerText();
      await button.click();
      assert.equal(await page.locator('#opportunity-detail h2').innerText(),name);
      assert.ok(await page.locator('.steps .step').count()>=4);
      const target=await page.locator('#opportunity-detail .panel-actions a').getAttribute('href');
      assert.match(target,/#\/plan\?focus=initiative-Q[1-4]/);
      await scan();
      results.opportunities.push({width,id,name,planTarget:target,passed:true});
    }
    await page.locator('[data-action=open-opportunity][data-id=payroll]').click();
    await capture('opportunity-payroll');
    results.checks.push({width,name:'Ten opportunities open with readable steps, gross labels, no raw IDs and quarter links',passed:true});
    await page.goto(`${base}#/goal`);
    if(width===390)await page.locator('[data-view=conversation]').click();
    await page.locator('[data-chat-target="module?chat=1"]').click();
    await page.locator('#agent-suggestions [data-action=start-sort]').click();
    assert.match(await page.locator('#conversation-thread').innerText(),/Task 1 of 5/);
    await page.locator('#message').fill('Not sure yet');
    await page.locator('#message').press('Enter');
    assert.match(await page.locator('#card-chat-error').innerText(),/Choose Keep/);
    await page.locator('#message').fill('Keep with me');
    await page.locator('#message').press('Enter');
    assert.match(await page.locator('.sort-progress').textContent(),/Task 2 of 5/);
    assert.match(await page.locator('#conversation-thread').innerText(),/You chose: Keep with me/);
    await capture('card-chat');
    if(width===390){
      await page.locator('[data-view=canvas]').click();
      assert.match(await page.locator('.sort-progress').innerText(),/Task 2 of 5/);
      await page.locator('[data-view=conversation]').click();
    }
    for(const pile of ['amplify','human','remove','amplify'])await page.locator(`#agent-suggestions [data-action=sort-card][data-pile=${pile}]`).click();
    assert.equal(await page.locator('.chat-sort-choice').count(),5);
    assert.equal(await page.locator('.review-row').count(),5);
    await page.locator('#agent-suggestions [data-action=card-review-canvas]').click();
    await page.locator('#review-1').selectOption('remove');
    if(width===390)await page.locator('[data-view=conversation]').click();
    assert.match(await page.locator('.chat-sort-choice').nth(1).innerText(),/Take it off my plate/);
    await capture('card-chat-review');
    await page.locator('#agent-suggestions [data-action=complete-sort]').click();
    assert.match(await page.locator('#conversation-thread').innerText(),/Your priorities now shape the goal/);
    await capture('card-chat-complete');
    await page.locator('#agent-suggestions a[href="#/goal"]').click();
    await page.locator('.goal-map').waitFor();
    assert.match(await page.locator('.goal-row').first().innerText(),/Evidence added/);
    await scan();
    await page.goto(`${base}#/role`);
    assert.match(await page.locator('.role-ambition').innerText(),/1 task to amplify.*2 to keep with you.*2 to take off/);
    await scan();
    results.checks.push({width,name:'Agent runs five card-sort decisions, canvas responds, editable review syncs, save updates goal and role',passed:true});
    await context.close();
  }
  for(const key of ['console','pageErrors','failedRequests','externalRequests'])assert.equal(results[key].length,0,key);
  results.passed=true;
}catch(error){results.passed=false;results.failure=error.stack;process.exitCode=1;}
finally{await browser.close();await writeFile(path.join(dir,'qa','fix-results.json'),JSON.stringify(results,null,2));}
console.log(JSON.stringify(results,null,2));
