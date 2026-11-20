# Селекторы Discord

Тема основана на семантических токенах Discord. Для фона, рамок и отдельных состояний используются селекторы из CSS-модулей. Имена в таблице сверены 20 ноября 2026 года с CSS-бандлами веб-клиента Discord, build `a2fdecaddfade9c67280032ef26ac65d295be8ce`. [Точка входа Discord](https://discord.com/app)

| Область | Основные якоря | Модуль темы |
| --- | --- | --- |
| Фон приложения | `body`, `#app-mount`, `[id^="app-mount_"]`, `[data-popout-root]` | `background.css`, `effects.css` |
| Серверы и каналы | `.guilds_pog62O`, `#channels`, `.container_H5ozaj`, `.container__2637a`, основы `sidebarList` и `privateChannels` | `servers.css`, `channels.css` |
| Папки серверов | `.folderGroup_RTMSuZ`, `.folderHeader_RTMSuZ`, `.folderPreviewGuildIcon_RTMSuZ`, `--radius-md`, `--radius-lg` | `servers.css`, `base.css` |
| Кнопка «Главная» | `[data-guilds-bar-home]`, `[data-list-item-id="guildsnav___home"]`, контейнер с префиксом `childWrapper_` | `servers.css` |
| Панель и поиск | `.container_ybUK7Z.themed_ybUK7Z`, `.searchBar_i16Ad0` | `header.css` |
| Друзья | `.container_zrUwGA`, `.tabBody_zrUwGA`, `.nowPlayingColumn_zrUwGA` | `home.css` |
| Чат и редактор | `.chat_z_gUBg`, `.chatContent_z_gUBg`, префикс `messagesWrapper_`, `.markup_ku1OHH`, `.channelTextArea_2x8-Qn` | `chat.css`, `composer.css` |
| Упоминание и переход к сообщению | `.wrapper_NDaLCQ.interactive`, `--message-highlight-background-default`, `--message-highlight-background-hover` | `chat.css`, `base.css` |
| Участники и профиль | `.membersWrap_86es0b`, `.outer_P1YEjQ`, `.themeContainer_nitlyF`, `.overlay_P1YEjQ` | `members.css`, `profiles.css` |
| Меню и настройки | `.menu_M3qk4j`, `.root__KoJTP`, `.container_XtY2mm` | `menus.css`, `settings.css` |
| Поля и элементы управления | `.wrapper_UcGqzv`, `.focus-rings-ring`, `.checkboxOption_vTUVyc`, `.radioGroupOption_oJuRbG`, `.switchIndicator_9AraPt`, `.slider_OnqacX`, `.slider_p3RiOL` | `controls.css`, `accessibility.css` |
| Громкость и чувствительность | `.micTest_lUTBfB`, `.inputSensitivityToggle_d-Ihb0`, `.inputSensitivitySlider_d-Ihb0` | `controls.css` |
| Кнопки | `[data-mana-component="button"]`, `.button_F7qvhY`, `.button_9OQtot`, `.colorable_K9Xq13`, `.buttonColor_9U6LUN` | `buttons.css`, `base.css` |
| BetterDiscord | `.bd-store-card`, `.bd-addon-controls`, `.bd-search-wrapper`, `.bd-switch-body` | `compatibility.css`, `buttons.css`, `accessibility.css` |
| Голос | `.wrapper_hbKzX7`, `.callContainer_hbKzX7`, `.root_rTsZa_`, `.tile_7NOr2f`, `.videoWrapper_7NOr2f`, `.gradientContainer_rTsZa_`, `--status-speaking` на `.border_7NOr2f` | `voice.css`, `background.css` |
| Голос в списке каналов | `--status-speaking` на `.voiceUser_YUoOxm`, `.iconLive_Wx6SnQ`, `.channelInfo_Wx6SnQ`, `.voiceChannelHighlightBorder_Wx6SnQ` | `voice.css` |
| Демонстрация экрана | `.root_oszuaw`, `.sourceOverlayCTA_4HfQya`, `.root_RmOtW7`, `#stream-options` | `screenshare.css` |
| Дополнительные панели | `.tabBody_zrUwGA`, `.searchHeader_rfDq2B`, `.header_LSviKk` | `misc.css` |

Ограниченные префиксные селекторы и старые цветовые токены поддерживают часть поверхностей при смене суффиксов классов. Наличие класса в бандле подтверждает доступность селектора. Применение правила в конкретном экране проверяется в клиенте.

При обновлении Discord проверьте родителя и класс изменившегося элемента в инспекторе, обновите нужный CSS-модуль, пересоберите тему и повторите соответствующий сценарий. [Матрица проверок](test-matrix.md)

В `background-image` встроен оптимизированный WebP. Затемнение и виньетка рисуются вместе с обоями. Стилевой запрос `@container style(--gr-wallpaper)` подключает пользовательское значение, включая `none`. Обои рисуются на `body` и на контейнере звонка, когда он переходит в полноэкранный режим.

Корневые оболочки приложения прозрачны. Список каналов получает одну заливку на `sidebarList`, а `#channels` и промежуточные обёртки пропускают её. Голос получает одну заливку на внешней панели и отдельную подложку плиток. Приоритет правил рассчитан на загрузку CSS звонка после темы.

На странице «Друзья» родительский контейнер и колонка активности прозрачны. Заливка `--gr-home-bg` применяется к `.tabBody_zrUwGA` один раз. `--font-primary` переопределяется на контейнере приложения, поэтому QuickCSS на `:root` может ссылаться на исходный шрифт Discord.

Индикатор непрочитанного темизируется через `.bar_oJAkDB`. Цвет маркера личных сообщений применяется к `.unreadPill_zln_tS`. Градиент ленты находится на обёртке прокрутки. Подсветка перехода к результату поиска остаётся заливкой отдельного сообщения.
