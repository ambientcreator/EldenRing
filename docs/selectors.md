# Селекторы Discord

Тема основана на семантических токенах Discord. Для фона, рамок и отдельных состояний используются селекторы из CSS-модулей. Имена в таблице сверены 20 ноября 2026 года с CSS-бандлами веб-клиента Discord, build `a2fdecaddfade9c67280032ef26ac65d295be8ce`. [Точка входа Discord](https://discord.com/app)

| Область | Основные якоря | Модуль темы |
| --- | --- | --- |
| Фон приложения | `#app-mount`, `[id^="app-mount_"]`, `.bg_Fd0FEH` | `background.css`, `effects.css` |
| Серверы и каналы | `.guilds_pog62O`, `.sidebarList_pog62O`, `.privateChannels_u88IQl`, префикс `data-list-item-id` | `servers.css`, `channels.css` |
| Кнопка «Главная» | `[data-guilds-bar-home]`, `[data-list-item-id="guildsnav___home"]`, контейнер с префиксом `childWrapper_` | `servers.css` |
| Панель и поиск | `.container_ybUK7Z.themed_ybUK7Z`, `.searchBar_i16Ad0` | `header.css` |
| Друзья | `.container_zrUwGA`, `.tabBody_zrUwGA`, `.nowPlayingColumn_zrUwGA` | `home.css` |
| Чат и редактор | `.chat_z_gUBg`, `.chatContent_z_gUBg`, `.markup_ku1OHH`, `.channelTextArea_2x8-Qn` | `chat.css`, `composer.css` |
| Упоминание и переход к сообщению | `.wrapper_NDaLCQ.interactive`, `--message-highlight-background-default`, `--message-highlight-background-hover` | `chat.css`, `base.css` |
| Участники и профиль | `.membersWrap_86es0b`, `.outer_P1YEjQ`, `.themeContainer_nitlyF`, `.overlay_P1YEjQ` | `members.css`, `profiles.css` |
| Меню и настройки | `.menu_M3qk4j`, `.root__KoJTP`, `.container_XtY2mm` | `menus.css`, `settings.css` |
| Голос | `.wrapper_hbKzX7`, `.callContainer_hbKzX7`, `.wrapper_9U6LUN`, `.connection_9U6LUN` | `voice.css`, `background.css` |
| Дополнительные панели | `.tabBody_zrUwGA`, `.searchHeader_rfDq2B`, `.header_LSviKk` | `misc.css` |

Ограниченные префиксные селекторы и старые цветовые токены поддерживают часть поверхностей при смене суффиксов классов. Наличие класса в бандле подтверждает доступность селектора. Применение правила в конкретном экране проверяется в клиенте.

При обновлении Discord проверьте родителя и класс изменившегося элемента в инспекторе, обновите нужный CSS-модуль, пересоберите тему и повторите соответствующий сценарий. [Матрица проверок](test-matrix.md)

Фоновый WebP встраивается непосредственно в `background-image`, поскольку Chromium ограничивает размер CSS-переменной 2 МиБ. Стилевой запрос `@container style(--gr-wallpaper)` подключает пользовательское значение, включая `none`. Оба варианта используют один псевдоэлемент с заданными X/Y и масштабом.

На странице «Друзья» родительский контейнер и колонка активности прозрачны. Заливка `--gr-home-bg` применяется к `.tabBody_zrUwGA` один раз. `--font-primary` переопределяется на контейнере приложения, поэтому QuickCSS на `:root` может ссылаться на исходный шрифт Discord.

Индикатор непрочитанного темизируется через `.bar_oJAkDB`. Цвет маркера личных сообщений применяется к `.unreadPill_zln_tS`. Заливка текста сообщений находится в `background-image`, поэтому тёплый цвет перехода к результату поиска остаётся видимым в `background-color`.
