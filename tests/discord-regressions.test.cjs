const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { chromium } = require('playwright');

const theme = readFileSync(join(__dirname, '../dist/GoldenRuins.theme.css'), 'utf8');

// Model the Discord markup and default paint involved in the reported regressions.
const fixture = `
  <style>
    .theme-dark {
      --black: #000;
      --background-base-lowest: #111;
      --background-surface-highest: #303136;
      --message-highlight-background-default: rgb(88 101 242 / 20%);
      --brand-500: #5865f2;
      --white: #fff;
    }
    .guilds_pog62O { display: flex; }
    .childWrapper_JJ-hgR { display: grid; place-items: center; width: 40px; height: 40px; }
    .sidebarList_pog62O { width: 250px; border-inline-start: 1px solid; border-block-start: 1px solid; }
    .privateChannels_u88IQl, .scroller_Bce46W { background: var(--background-base-lowest); }
    .bar_oJAkDB { width: 100%; height: 24px; border-radius: 12px; border: 1px solid; }
    .unread_oJAkDB { background-color: var(--background-surface-highest); }
    .interactive:hover { background-color: var(--brand-500); color: var(--white); }
    .flash_EajVQV[data-flash="true"], .highlighted_SY_P2T { background: var(--message-highlight-background-default); }
    .wrapper_hbKzX7 { background: var(--background-base-lowest); }
    .callContainer_hbKzX7 { background: var(--black); }
    .wrapper_hbKzX7.minimum_hbKzX7 .callContainer_hbKzX7 { background: none; }
  </style>
  <div id="app-mount_gEkNtR" class="theme-dark">
    <nav class="guilds_pog62O">
      <div data-guilds-bar-home>
        <button aria-label="Главная" data-list-item-id="guildsnav___home">
          <span class="childWrapper_JJ-hgR"><svg width="24" height="24"><circle cx="12" cy="12" r="8"/></svg></span>
        </button>
      </div>
      <button aria-label="Сервер"><span class="childWrapper_JJ-hgR"><svg width="24" height="24"></svg></span></button>
    </nav>
    <aside class="sidebarList_pog62O">
      <div class="privateChannels_u88IQl">
        <div class="scroller_Bce46W" tabindex="0">
          <a href="#chat" data-list-item-id="channels___test">Канал</a>
          <canvas class="tabHoverGradient_zln_tS" width="10" height="10"></canvas>
        </div>
      </div>
      <div class="container_oJAkDB">
        <button class="bar_oJAkDB unread_oJAkDB">Непрочитанные</button>
      </div>
      <i class="unread_otherx" id="layout-marker"></i>
    </aside>
    <main class="chatContent_z_gUBg" id="chat">
      <article class="messageListItem_SY_P2T flash_EajVQV" data-flash="true">
        <span class="markup_ku1OHH"><span class="wrapper_NDaLCQ mention interactive" tabindex="0">@Путник</span></span>
      </article>
      <article class="highlighted_SY_P2T">Найденное сообщение</article>
    </main>
    <section class="wrapper_hbKzX7">
      <div class="callContainer_hbKzX7"><video></video></div>
    </section>
  </div>`;

test('keeps Discord layout and themes Home, unread bars, message highlights and calls', { timeout: 15_000 }, async () => {
  const browser = await chromium.launch({
    executablePath: process.env.GOLDEN_RUINS_CHROMIUM || undefined,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(fixture);
    const before = await page.getByRole('button', { name: 'Главная' }).boundingBox();
    const sidebarWidth = await page.locator('.sidebarList_pog62O').evaluate(element => element.offsetWidth);
    await page.addStyleTag({ content: theme });

    const style = (selector, name, pseudo = null) => page.locator(selector).evaluate(
      (element, { name, pseudo }) => getComputedStyle(element, pseudo)[name], { name, pseudo },
    );
    const transparent = 'rgba(0, 0, 0, 0)';

    assert.match(await style('[data-guilds-bar-home] span', 'maskImage', '::after'), /data:image\/svg\+xml;base64/);
    assert.equal(await style('[data-guilds-bar-home] svg', 'visibility'), 'hidden');
    assert.equal(await style('[aria-label="Сервер"] svg', 'visibility'), 'visible');
    const after = await page.getByRole('button', { name: 'Главная' }).boundingBox();
    assert.deepEqual([after.width, after.height], [before.width, before.height]);
    await page.getByRole('button', { name: 'Главная' }).click();

    assert.equal(await page.locator('.sidebarList_pog62O').evaluate(element => element.offsetWidth), sidebarWidth);
    assert.equal(await style('.privateChannels_u88IQl', 'backgroundColor'), transparent);
    assert.equal(await style('.scroller_Bce46W', 'backgroundColor'), transparent);
    assert.equal(await style('.tabHoverGradient_zln_tS', 'visibility'), 'hidden');
    assert.equal(await style('#layout-marker', 'backgroundColor'), transparent);
    assert.match(await style('.bar_oJAkDB', 'backgroundColor'), /\/ 0\.84\)/);
    await page.addStyleTag({ content: ':root { --gr-channel-row-height: 36px; }' });
    assert.equal(await style('[data-list-item-id="channels___test"]', 'minBlockSize'), '36px');

    await page.locator('.mention').hover();
    assert.equal(await style('.mention', 'color'), 'rgb(231, 201, 148)');
    assert.match(await style('.mention', 'backgroundColor'), /^color\(srgb/);
    assert.match(await style('.flash_EajVQV', 'backgroundColor'), /\/ 0\.19\)/);
    assert.equal(await style('.highlighted_SY_P2T', 'backgroundColor'), await style('.flash_EajVQV', 'backgroundColor'));

    assert.equal(await style('.wrapper_hbKzX7', 'backgroundColor'), transparent);
    assert.match(await style('.callContainer_hbKzX7', 'backgroundColor'), /\/ 0\.34\)/);
    await page.locator('.wrapper_hbKzX7').evaluate(element => element.classList.add('minimum_hbKzX7'));
    assert.match(await style('.callContainer_hbKzX7', 'backgroundColor'), /\/ 0\.34\)/);
    assert.equal(await style('video', 'opacity'), '1');
    assert.equal(await style('video', 'filter'), 'none');

    const hasFullscreenWallpaper = await page.locator('.wrapper_hbKzX7').evaluate(async element => {
      await element.requestFullscreen();
      const visible = getComputedStyle(element, '::before').backgroundImage.includes('data:image/webp;base64,');
      await document.exitFullscreen();
      return visible;
    });
    assert.equal(hasFullscreenWallpaper, true);
  } finally {
    await browser.close();
  }
});
