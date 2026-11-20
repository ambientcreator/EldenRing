# Настройка Golden Ruins

Добавьте один из блоков CSS в **Custom CSS** (BetterDiscord) или **QuickCSS** (Vencord).

## Профили

### Balanced

Эти значения уже включены в тему. Сияние и искры остаются статичными.

~~~css
:root {
  --gr-glass-blur: 2px;
  --gr-popout-filter: blur(var(--gr-glass-blur));
  --gr-ornament-opacity: 0.72;
  --gr-corner-opacity: 0.40;
  --gr-glow-opacity: 0.30;
  --gr-shadow-opacity: 0.52;
  --gr-effects: block;
  --gr-ambient-motion: paused;
  --gr-particles-opacity: 0.34;
  --gr-canopy-opacity: 0.22;
}
~~~

### Full

Этот профиль включает движение сияния и искр.

~~~css
:root {
  --gr-glass-blur: 6px;
  --gr-popout-filter: blur(var(--gr-glass-blur));
  --gr-ornament-opacity: 0.92;
  --gr-corner-opacity: 0.80;
  --gr-glow-opacity: 0.52;
  --gr-shadow-opacity: 0.60;
  --gr-effects: block;
  --gr-ambient-motion: running;
  --gr-particles-opacity: 0.60;
  --gr-canopy-opacity: 0.40;
}
~~~

### Lite

~~~css
:root {
  --gr-glass-blur: 0px;
  --gr-popout-filter: none;
  --gr-ornament-opacity: 0.40;
  --gr-corner-opacity: 0;
  --gr-shadow-opacity: 0.30;
  --gr-effects: none;
  --gr-motion: 0;
}
~~~

Замените весь блок при переключении профиля. Системный режим снижения движения отключает оба фоновых эффекта и переходы темы во всех трёх профилях.

Чтобы включить только движение фона в Balanced, задайте `:root { --gr-ambient-motion: running; }`. Сияние меняет яркость за 16 секунд, а искры поднимаются за 19 секунд. Затем оба эффекта воспроизводятся в обратную сторону.

## Переменные

| Назначение | Переменные | Значения |
| --- | --- | --- |
| Обои | `--gr-wallpaper`, `--gr-wallpaper-size`, `--gr-wallpaper-x`, `--gr-wallpaper-y` | `url("…")` или `none`, `cover` или `contain`, проценты |
| Затемнение | `--gr-dim`, `--gr-vignette` | От 0 до 1 |
| Плотность панелей | `--gr-chat-opacity`, `--gr-channels-opacity`, `--gr-members-opacity`, `--gr-home-opacity`, `--gr-popout-opacity`, `--gr-card-opacity`, `--gr-control-opacity` | От 0 до 1 |
| Голосовой канал | `--gr-voice-opacity`, `--gr-voice-tile-opacity` | Плотность фона вокруг плиток и плотность подложки каждой плитки, от 0 до 1 |
| Подложка под текстом | `--gr-reading-opacity` | От 0 до 1 |
| Палитра | `--gr-bg-base`, `--gr-surface`, `--gr-surface-raised`, `--gr-gold`, `--gr-gold-bright`, `--gr-gold-dim`, `--gr-bronze`, `--gr-text`, `--gr-text-muted`, `--gr-link` | Цвета CSS |
| Состояния | `--gr-success`, `--gr-warning`, `--gr-danger` | Цвета CSS |
| Размеры | `--gr-radius`, `--gr-border-width`, `--gr-channel-row-height`, `--gr-heading-scale` | Первые три в px, масштаб числом. Высота строк по умолчанию берётся из Discord |
| Шрифт | `--gr-font-heading`, `--gr-font-body` | Списки шрифтов CSS |
| Декор | `--gr-ornament-opacity`, `--gr-corner-opacity`, `--gr-glow-opacity`, `--gr-shadow-opacity` | От 0 до 1 |
| Анимации | `--gr-motion`, `--gr-effects`, `--gr-hover-duration`, `--gr-popout-duration` | `0` или `1`, `none` или `block`, длительности |
| Движение фона | `--gr-ambient-motion` | `paused` для статичного фона, `running` для анимации |
| Сияние и искры | `--gr-canopy-opacity`, `--gr-particles-opacity`, `--gr-particles-play-state` | От 0 до 1, `running` или `paused` |
| Размытие модального окна | `--gr-glass-blur`, `--gr-popout-filter` | Пиксели, `blur(var(--gr-glass-blur))` или `none` |

При удалении `--gr-wallpaper` используется встроенная иллюстрация 1670 × 941 без потерь. Режим `cover` увеличивает её, когда окно больше исходника. Для собственных обоев укажите доступный URL изображения. Режим `contain` вписывает всю картинку в окно. Значение `none` оставляет тёмную подложку. Текст на ярких обоях легче читать с более плотными панелями или большим `--gr-dim`.

В Balanced непрозрачность чата составляет 29%, списка каналов 30%, друзей 25%, области звонка 20%, а подложек плиток 24%. Параметр `--gr-reading-opacity` регулирует затемнение ленты и текста в списке участников. Градиент чата затухает вправо и рисуется один раз на всю область прокрутки.

`--gr-radius` задаёт радиус углов панелей и кнопок. Значение по умолчанию — `2px`. Для прямых углов задайте `0px`. Параметр `--gr-button-bg` задаёт тёмную подложку кнопок.

По умолчанию сообщения и основной текст интерфейса используют Literata. Для заголовков, кнопок и окна демонстрации экрана используется Forum. Шрифт для кода берётся из настроек Discord. Пример возврата системных шрифтов и более плотного чата.

~~~css
:root {
  --gr-font-heading: var(--font-primary, system-ui, sans-serif);
  --gr-font-body: var(--font-primary, system-ui, sans-serif);
  --gr-chat-opacity: 0.92;
}
~~~
