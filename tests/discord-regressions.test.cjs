const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { chromium } = require('playwright');

const theme = readFileSync(join(__dirname, '../dist/GoldenRuins.theme.css'), 'utf8');
const computedStyle = (locator, name, pseudo = null) => locator.evaluate(
  (element, { name, pseudo }) => getComputedStyle(element, pseudo)[name], { name, pseudo },
);
const transparent = 'rgba(0, 0, 0, 0)';

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
      --status-speaking: #248046;
    }
    .guilds_pog62O { display: flex; }
    .childWrapper_JJ-hgR { display: grid; place-items: center; width: 40px; height: 40px; }
    #app-mount_gEkNtR, .appAsidePanelWrapper_YRXZu0, .page_pog62O { background: #111; }
    .sidebarList_pog62O { width: 250px; border-inline-start: 1px solid; border-block-start: 1px solid; }
    #channels, .container_H5ozaj, .privateChannels_u88IQl, .scroller_Bce46W {
      background: var(--background-base-lowest);
    }
    [class$="-sidebarList"] { background: #111; }
    .bar_oJAkDB { width: 100%; height: 24px; border-radius: 12px; border: 1px solid; }
    .unread_oJAkDB { background-color: var(--background-surface-highest); }
    .interactive:hover { background-color: var(--brand-500); color: var(--white); }
    .flash_EajVQV[data-flash="true"], .highlighted_SY_P2T { background: var(--message-highlight-background-default); }
    .wrapper_hbKzX7 { background: var(--background-base-lowest); }
    .callContainer_hbKzX7, .root_rTsZa_, .videoWrapper_7NOr2f { background: var(--black); }
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
      <div class="wrapper_hqZPsU">
        <svg width="48" height="48" viewBox="-4 -4 48 48">
          <defs><mask id="guild-action-mask"><rect width="40" height="40" rx="12" fill="white"/></mask></defs>
          <g class="focusStroke_hqZPsU"><rect width="40" height="40" rx="12" fill="none"/></g>
          <foreignObject width="40" height="40" mask="url(#guild-action-mask)">
            <div class="circleIconButton_g8YUxD button_fixture" role="button" tabindex="0" aria-label="Добавить сервер">+</div>
          </foreignObject>
        </svg>
      </div>
      <div class="circleIconButton_1czW-w" id="masked-guild-wrapper"><svg width="40" height="40"></svg></div>
    </nav>
    <aside class="sidebarList_pog62O">
      <div class="container_H5ozaj"><nav id="channels">Список каналов сервера</nav></div>
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
    <aside class="_c48ade-sidebarList" id="desktop-sidebar">Боковая панель</aside>
    <div class="appAsidePanelWrapper_YRXZu0"><div class="page_pog62O"></div></div>
    <main class="chatContent_z_gUBg" id="chat">
      <article class="messageListItem_SY_P2T flash_EajVQV" data-flash="true">
        <span class="markup_ku1OHH"><span class="wrapper_NDaLCQ mention interactive" tabindex="0">@Путник</span></span>
      </article>
      <article class="highlighted_SY_P2T">Найденное сообщение</article>
    </main>
    <section class="wrapper_hbKzX7">
      <div class="callContainer_hbKzX7">
        <div class="root_rTsZa_">
          <div class="gradientTop_rTsZa_ gradientContainer_rTsZa_"></div>
          <div class="gradientBottom_rTsZa_ gradientContainer_rTsZa_"></div>
          <div class="tile_7NOr2f" style="background-color: #d6c0c0">
            <div class="content_7NOr2f" style="background: linear-gradient(#4a3d32, #282527)">Участник</div>
            <div class="border_7NOr2f" id="speaking-tile-border" style="box-shadow: 0 0 0 0 var(--status-speaking), inset 0 0 0 2px var(--status-speaking), inset 0 0 0 3px var(--background-base-lower)"></div>
          </div>
          <div class="videoWrapper_7NOr2f"><video></video><div class="border_7NOr2f" id="idle-tile-border"></div></div>
          <div class="bottomControls_rTsZa_ controlSection_rTsZa_">
            <div class="buttonSection_9bvEB0">
              <button class="button_F7qvhY critical_9EByBZ toggleButton_9EByBZ" aria-pressed="true">Микрофон</button>
              <button class="centerButton_K9Xq13 colorable_K9Xq13 disconnect_K9Xq13">
                <span class="centerIcon_K9Xq13">Отключиться</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="panels_pog62O">
      <div class="voiceButtonsContainer_9U6LUN">
        <button class="button_9U6LUN buttonColor_9U6LUN buttonActive_9U6LUN">Трансляция включена</button>
        <button class="button_9U6LUN buttonColor_9U6LUN fauxDisabled_9U6LUN" aria-disabled="true">Камера</button>
        <button class="button_9U6LUN buttonColor_9U6LUN" id="voice-effects">Эффекты</button>
      </div>
    </div>
  </div>
  <div data-popout-root><div class="root_rTsZa_" id="floating-call">Отдельное окно звонка</div></div>`;

test('keeps Discord layout and themes Home, unread bars, message highlights and calls', { timeout: 15_000 }, async () => {
  const browser = await chromium.launch({
    executablePath: process.env.GOLDEN_RUINS_CHROMIUM || undefined,
  });

  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.setContent(fixture);
    const before = await page.getByRole('button', { name: 'Главная' }).boundingBox();
    const sidebarWidth = await page.locator('.sidebarList_pog62O').evaluate(element => element.offsetWidth);
    await page.addStyleTag({ content: theme });
    await page.addStyleTag({ content: `
      #channels, .container_H5ozaj { background: #111; }
      .wrapper_hbKzX7, .wrapper_hbKzX7.minimum_hbKzX7 { background: #111; }
      .callContainer_hbKzX7, .root_rTsZa_, .videoWrapper_7NOr2f { background: #000; }
      .gradientContainer_rTsZa_ { background: linear-gradient(black, transparent); }
      .buttonSection_9bvEB0, .colorable_K9Xq13 { border-radius: 12px; }
      .colorable_K9Xq13.disconnect_K9Xq13 { background: red; }
      .colorable_K9Xq13.disconnect_K9Xq13 .centerIcon_K9Xq13 { color: white; }
      .button_9U6LUN.buttonColor_9U6LUN.buttonActive_9U6LUN { background: green; color: white; }
      .circleIconButton_g8YUxD { width: 40px; height: 40px; background: var(--background-mod-subtle); }
      .circleIconButton_g8YUxD:hover { background: var(--background-brand); }
      .keyboard-mode .focusStroke_hqZPsU { stroke: #5865f2; stroke-width: 8px; }
    ` });

    const style = (selector, name, pseudo) => computedStyle(page.locator(selector), name, pseudo);

    assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundImage.includes('data:image/webp;base64,')), true);
    for (const selector of ['#app-mount_gEkNtR', '.appAsidePanelWrapper_YRXZu0', '.page_pog62O']) {
      assert.equal(await style(selector, 'backgroundColor'), transparent);
    }

    assert.match(await style('[data-guilds-bar-home] span', 'maskImage', '::after'), /data:image\/svg\+xml;base64/);
    assert.equal(await style('[data-guilds-bar-home] svg', 'visibility'), 'hidden');
    assert.equal(await style('[aria-label="Сервер"] svg', 'visibility'), 'visible');
    const after = await page.getByRole('button', { name: 'Главная' }).boundingBox();
    assert.deepEqual([after.width, after.height], [before.width, before.height]);
    await page.getByRole('button', { name: 'Главная' }).click();

    const addServer = page.getByRole('button', { name: 'Добавить сервер' });
    assert.equal(await computedStyle(addServer, 'boxShadow'), 'none');
    assert.equal(await style('#masked-guild-wrapper', 'boxShadow'), 'none');
    assert.equal(await style('#masked-guild-wrapper', 'backgroundColor'), transparent);
    await addServer.hover();
    assert.equal(await computedStyle(addServer, 'boxShadow'), 'none');
    await page.evaluate(() => document.documentElement.classList.add('keyboard-mode'));
    await page.getByRole('button', { name: 'Сервер', exact: true }).press('Tab');
    assert.equal(await addServer.evaluate(element => element.matches(':focus-visible')), true);
    assert.equal(await computedStyle(addServer, 'outlineStyle'), 'none');
    assert.equal(await style('.focusStroke_hqZPsU', 'stroke'), 'rgb(231, 201, 148)');
    await addServer.click();

    assert.equal(await page.locator('.sidebarList_pog62O').evaluate(element => element.offsetWidth), sidebarWidth);
    assert.match(await style('.sidebarList_pog62O', 'backgroundColor'), /\/ 0\.3\)/);
    assert.equal(await style('#desktop-sidebar', 'backgroundColor'), await style('.sidebarList_pog62O', 'backgroundColor'));
    assert.equal(await style('#channels', 'backgroundColor'), transparent);
    assert.equal(await style('.container_H5ozaj', 'backgroundColor'), transparent);
    assert.equal(await style('.privateChannels_u88IQl', 'backgroundColor'), transparent);
    assert.equal(await style('.scroller_Bce46W', 'backgroundColor'), transparent);
    assert.equal(await style('.tabHoverGradient_zln_tS', 'visibility'), 'hidden');
    assert.equal(await style('#layout-marker', 'backgroundColor'), transparent);
    assert.match(await style('.bar_oJAkDB', 'backgroundColor'), /\/ 0\.8\)/);
    await page.addStyleTag({ content: ':root { --gr-channel-row-height: 36px; }' });
    assert.equal(await style('[data-list-item-id="channels___test"]', 'minBlockSize'), '36px');

    await page.locator('.mention').hover();
    assert.equal(await style('.mention', 'color'), 'rgb(231, 201, 148)');
    assert.match(await style('.mention', 'backgroundColor'), /^color\(srgb/);
    assert.match(await style('.flash_EajVQV', 'backgroundColor'), /\/ 0\.19\)/);
    assert.equal(await style('.highlighted_SY_P2T', 'backgroundColor'), await style('.flash_EajVQV', 'backgroundColor'));

    assert.match(await style('.wrapper_hbKzX7', 'backgroundColor'), /\/ 0\.2\)/);
    assert.equal(await style('.callContainer_hbKzX7', 'backgroundColor'), transparent);
    assert.equal(await style('.callContainer_hbKzX7 .root_rTsZa_', 'backgroundColor'), transparent);
    assert.equal(await style('#floating-call', 'backgroundColor'), transparent);
    assert.equal(await style('.videoWrapper_7NOr2f', 'backgroundColor'), transparent);
    assert.match(await style('.tile_7NOr2f', 'backgroundColor'), /\/ 0\.24\)/);
    assert.equal(await style('.content_7NOr2f', 'backgroundImage'), 'none');
    assert.match(await style('#speaking-tile-border', 'boxShadow'), /rgb\(196, 164, 108\) 0px 0px 0px 2px inset/);
    assert.equal(await style('#idle-tile-border', 'boxShadow'), 'none');
    assert.equal(await page.locator('.root_rTsZa_').first().evaluate(element => (
      getComputedStyle(element).getPropertyValue('--status-speaking').trim()
    )), '#248046');
    await page.locator('.wrapper_hbKzX7').evaluate(element => element.classList.add('minimum_hbKzX7'));
    assert.equal(await style('.callContainer_hbKzX7', 'backgroundColor'), transparent);
    assert.equal(await style('video', 'opacity'), '1');
    assert.equal(await style('video', 'filter'), 'none');

    for (const selector of ['.gradientTop_rTsZa_', '.gradientBottom_rTsZa_']) {
      assert.equal(await style(selector, 'backgroundImage'), 'none');
      assert.equal(await style(selector, 'backgroundColor'), transparent);
    }
    assert.equal(await style('.buttonSection_9bvEB0', 'borderRadius'), '2px');
    assert.equal(await style('.disconnect_K9Xq13 span', 'color'), 'rgb(225, 152, 141)');
    assert.equal(await style('.toggleButton_9EByBZ', 'color'), 'rgb(225, 152, 141)');
    assert.equal(await style('.buttonActive_9U6LUN', 'color'), 'rgb(163, 182, 156)');
    assert.equal(await style('.fauxDisabled_9U6LUN', 'opacity'), '0.54');
    assert.match(await style('#voice-effects', 'backgroundColor'), /\/ 0\.74\)/);
    assert.match(await style('#voice-effects', 'boxShadow'), /\/ 0\.32\)/);
    const disabledFrame = await style('.fauxDisabled_9U6LUN', 'boxShadow');
    await page.getByRole('button', { name: 'Камера' }).hover();
    assert.equal(await style('.fauxDisabled_9U6LUN', 'boxShadow'), disabledFrame);

    const disconnect = page.getByRole('button', { name: 'Отключиться' });
    const idleFrame = await computedStyle(disconnect, 'boxShadow');
    await page.getByRole('button', { name: 'Микрофон' }).press('Tab');
    assert.equal(await disconnect.evaluate(element => element.matches(':focus-visible')), true);
    assert.notEqual(await computedStyle(disconnect, 'boxShadow'), idleFrame);

    const hasFullscreenWallpaper = await page.locator('.wrapper_hbKzX7').evaluate(async element => {
      await element.requestFullscreen();
      const visible = getComputedStyle(element).backgroundImage.includes('data:image/webp;base64,');
      await document.exitFullscreen();
      return visible;
    });
    assert.equal(hasFullscreenWallpaper, true);
  } finally {
    await browser.close();
  }
});

test('squares Discord folders and styles the desktop screen-share picker', { timeout: 15_000 }, async () => {
  const browser = await chromium.launch({
    executablePath: process.env.GOLDEN_RUINS_CHROMIUM || undefined,
  });

  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.setContent(`
      <div id="app-mount_gEkNtR" class="theme-dark refresh-fast-follow-avatars">
        <nav class="guilds_pog62O">
          <div class="folderGroup_RTMSuZ">
            <div class="folderGroupBackground_RTMSuZ"></div>
            <div class="folderHeader_RTMSuZ">
              <div role="button" class="folderButton_RTMSuZ" tabindex="0">
                <div class="folderButtonInner_RTMSuZ">
                  <div class="folderPreviewWrapper_RTMSuZ">
                    <div class="folderPreview_RTMSuZ"><img class="folderPreviewGuildIcon_RTMSuZ" alt=""></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div role="dialog" aria-label="Демонстрация экрана">
          <div data-mana-component="modal" class="container_dvN-MP">
            <div class="root_oszuaw">
              <div class="segmentedControl_oszuaw pillContainer_I4ubrz" role="tablist">
                <div class="pillItem_I4ubrz pillItemSelected_I4ubrz" role="tab" aria-selected="true">
                  <div data-text-variant="body-sm/medium">Приложения</div>
                </div>
              </div>
              <div class="source_4HfQya" role="button" tabindex="0">
                <div class="sourcePreviewContainer_4HfQya">
                  <div class="sourcePreview_4HfQya">
                    <div class="sourceOverlay_4HfQya"><div class="sourceOverlayCTA_4HfQya">Демонстрировать экран</div></div>
                  </div>
                </div>
                <div class="sourceName_4HfQya" data-text-variant="body-sm/medium">Летопись</div>
              </div>
              <div class="footer_oszuaw">
                <div class="rightButtonGroup_oszuaw">
                  <div class="selector_IeXlUE pillContainer_I4ubrz" role="list">
                    <div class="pillItem_I4ubrz premiumOption_IeXlUE" role="button">HD</div>
                  </div>
                  <button class="button_F7qvhY secondary_F7qvhY">Настройки стрима</button>
                </div>
                <div class="root_RmOtW7">
                  <div class="infoText_RmOtW7" data-text-variant="body-xs/normal">Стримьте в HD с <a href="#nitro">Nitro</a></div>
                  <div role="button" class="wishlistButton_RmOtW7" aria-label="В список желаемого" tabindex="0"></div>
                  <button class="button_9OQtot lookFilled_9OQtot colorBrandInverted_9OQtot ctaButton_RmOtW7">
                    <svg class="premiumIcon_RmOtW7" width="16" height="16"><path d="M0 0h16v16H0z" fill="#dc58b8"/></svg>
                    <span class="ctaButtonText_RmOtW7" data-text-variant="body-xs/semibold">Подписаться на Nitro</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div role="menu" id="stream-options"><div data-text-variant="body-sm/medium">Частота кадров</div></div>
        <span id="outside-picker">Чат</span>
      </div>`);

    await page.addStyleTag({ content: theme });
    await page.addStyleTag({ content: `
      :root { --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --white: #fff; --black: #000; }
      .folderGroupBackground_RTMSuZ { background: var(--background-mod-subtle); border-radius: var(--radius-lg); opacity: 0; }
      .isExpanded_RTMSuZ .folderGroupBackground_RTMSuZ { opacity: 1; }
      .folderButtonInner_RTMSuZ { border-radius: var(--radius-md); overflow: hidden; }
      .folderPreviewWrapper_RTMSuZ { background: var(--background-mod-subtle); border-radius: var(--radius-lg); padding: 4px; }
      .refresh-fast-follow-avatars .folderPreviewGuildIcon_RTMSuZ:first-child { border-radius: 10px 4px 4px; }
      .folderGroup_RTMSuZ[data-drop-hovering=true]:not(.isExpanded_RTMSuZ) .folderHeader_RTMSuZ {
        border-radius: 12px; outline: 1px solid green;
      }
      .container_dvN-MP { background: var(--background-surface-high); border-radius: var(--radius-md); }
      .pillContainer_I4ubrz { background: var(--background-base-lowest); border-radius: var(--radius-md); }
      .pillItemSelected_I4ubrz { background: var(--background-surface-high); }
      .premiumOption_IeXlUE { color: #dc58b8; }
      .sourcePreviewContainer_4HfQya { position: relative; }
      .sourcePreviewContainer_4HfQya::before { content: ""; border: 2px solid transparent; }
      .selectedSource_4HfQya .sourcePreviewContainer_4HfQya::before { border-color: #5865f2; }
      .sourcePreview_4HfQya { aspect-ratio: 16 / 9; background: var(--black); border-radius: var(--radius-sm); width: 224px; }
      .sourceOverlay_4HfQya { display: none; background: rgb(0 0 0 / 40%); }
      .source_4HfQya:hover .sourceOverlay_4HfQya { display: flex; }
      .sourceOverlayCTA_4HfQya { background: var(--white); color: var(--black); border-radius: var(--radius-sm); }
      .button_F7qvhY { border-radius: var(--radius-sm); }
      .secondary_F7qvhY { background: var(--control-secondary-background-default); }
      .secondary_F7qvhY:hover { background: var(--control-secondary-background-hover); }
      .footer_oszuaw { background: var(--background-surface-high); }
      .root_RmOtW7 { background: linear-gradient(90deg, #8440bd, #dc58b8); border-radius: var(--radius-sm); }
      .ctaButtonText_RmOtW7 { background: linear-gradient(90deg, #8440bd, #dc58b8); background-clip: text; color: transparent; }
      .lookFilled_9OQtot.colorBrandInverted_9OQtot { background: #fff; color: #111; }
      .lookFilled_9OQtot.colorBrandInverted_9OQtot:hover { background: #eee; }
      .theme-dark .wishlistButton_RmOtW7 { background: #38222f; }
      [data-text-variant] { font-family: var(--font-primary); }
    ` });

    const style = (selector, name, pseudo) => computedStyle(page.locator(selector), name, pseudo);
    const brightGold = 'rgb(231, 201, 148)';
    const text = 'rgb(240, 231, 216)';

    for (const selector of ['.folderButton_RTMSuZ', '.folderPreview_RTMSuZ']) {
      assert.equal(await style(selector, 'backgroundColor'), transparent);
    }
    for (const selector of [
      '.folderGroupBackground_RTMSuZ', '.folderButtonInner_RTMSuZ', '.folderPreviewWrapper_RTMSuZ', '.folderPreviewGuildIcon_RTMSuZ',
      '.container_dvN-MP', '.sourceOverlayCTA_4HfQya', '.button_F7qvhY', '.root_RmOtW7',
    ]) {
      assert.equal(await style(selector, 'borderRadius'), '2px', selector);
    }
    assert.equal(await style('.folderButtonInner_RTMSuZ', 'overflow'), 'hidden');
    assert.equal(await style('.folderGroupBackground_RTMSuZ', 'opacity'), '0');
    const folder = page.locator('.folderGroup_RTMSuZ');
    await folder.evaluate(element => { element.dataset.dropHovering = 'true'; });
    assert.equal(await style('.folderHeader_RTMSuZ', 'borderRadius'), '2px');
    assert.equal(await style('.folderHeader_RTMSuZ', 'outlineColor'), 'rgb(0, 128, 0)');
    await folder.evaluate(element => element.classList.add('isExpanded_RTMSuZ'));
    assert.equal(await style('.folderGroupBackground_RTMSuZ', 'opacity'), '1');

    const source = page.locator('.source_4HfQya');
    await source.hover();
    assert.equal(await style('.sourceOverlay_4HfQya', 'display'), 'flex');
    assert.equal(await style('.sourceOverlay_4HfQya', 'backgroundColor'), transparent);
    assert.equal(await style('.source_4HfQya', 'backgroundColor'), transparent);
    assert.match(await style('.sourceOverlayCTA_4HfQya', 'boxShadow'), /inset/);
    assert.equal(await style('.sourceOverlayCTA_4HfQya', 'color'), text);
    await source.evaluate(element => element.classList.add('selectedSource_4HfQya'));
    assert.equal(await style('.sourcePreviewContainer_4HfQya', 'borderTopColor', '::before'), brightGold);
    assert.match(await style('.footer_oszuaw', 'backgroundColor'), /\/ 0\.5\)/);
    assert.equal(await style('.premiumOption_IeXlUE', 'color'), brightGold);
    assert.match(await style('.root_RmOtW7', 'backgroundImage'), /rgb\(101, 82, 58\)/);
    assert.equal(await style('.ctaButtonText_RmOtW7', 'backgroundImage'), 'none');
    assert.equal(await style('.ctaButtonText_RmOtW7', 'color'), text);
    assert.equal(await style('.premiumIcon_RmOtW7 path', 'fill'), text);

    const subscribe = page.getByRole('button', { name: 'Подписаться на Nitro' });
    await page.mouse.move(0, 0);
    assert.equal(await computedStyle(subscribe, 'backgroundColor'), await style('.sourceOverlayCTA_4HfQya', 'backgroundColor'));
    const idleFrame = await computedStyle(subscribe, 'boxShadow');
    await subscribe.hover();
    assert.notEqual(await computedStyle(subscribe, 'boxShadow'), idleFrame);
    for (const selector of [
      '.sourceName_4HfQya', '.sourceOverlayCTA_4HfQya', '.button_F7qvhY',
      '.ctaButtonText_RmOtW7', '#stream-options [data-text-variant]',
    ]) {
      assert.match(await style(selector, 'fontFamily'), /^"Golden Ruins Forum"/);
    }
    assert.match(await style('#outside-picker', 'fontFamily'), /^"Golden Ruins Literata"/);
    const forumSubsets = await page.evaluate(async () => (
      await document.fonts.load('14px "Golden Ruins Forum"', 'Nitro Демонстрация')
    ).length);
    assert.equal(forumSubsets, 2);

    await page.addStyleTag({ content: ':root { --gr-radius: 0px; }' });
    assert.equal(await style('.folderPreviewGuildIcon_RTMSuZ', 'borderRadius'), '0px');
    assert.equal(await style('.container_dvN-MP', 'borderRadius'), '0px');
    assert.equal(await style('.root_RmOtW7', 'borderRadius'), '0px');
  } finally {
    await browser.close();
  }
});
