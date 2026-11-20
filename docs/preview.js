const rooms = {
  travel: ['странствия', 'Зал благодати', 'Здесь путники делятся маршрутами и находками.'],
  atlas: ['карты-пути', 'Карты пути', 'Маршруты через долину и ориентиры у старых арок.'],
  chronicle: ['летопись', 'Летопись', 'Записи о местах и событиях Междуземья.'],
};
const byId = id => document.getElementById(id);
const messages = byId('messages');
const search = byId('search');
const composer = byId('compose-input');
const members = byId('members');
const membersToggle = byId('members-toggle');
const detail = byId('details');
const menu = byId('message-menu');
const roomButtons = document.querySelectorAll('.channel-list [data-channel]');
let room = 'travel';

function updateMessages() {
  const query = search.value.trim().toLocaleLowerCase('ru');
  let visible = 0;

  for (const message of messages.children) {
    const matches = message.dataset.room === room
      && message.textContent.toLocaleLowerCase('ru').includes(query);
    message.hidden = !matches;
    if (matches) visible++;
  }
  byId('no-messages').hidden = visible > 0;
}

function openRoom(nextRoom) {
  room = nextRoom;
  const [name, title, description] = rooms[room];
  byId('channel-name').textContent = name;
  byId('room-title').textContent = title;
  byId('room-description').textContent = description;
  composer.placeholder = `Написать в #${name}`;
  search.value = '';
  for (const button of roomButtons) {
    if (button.dataset.channel === room) {
      button.setAttribute('aria-current', 'page');
      button.querySelector('.unread_oJAkDB')?.remove();
    } else {
      button.removeAttribute('aria-current');
    }
  }
  updateMessages();
}

function setMembersHidden(hidden) {
  members.hidden = hidden;
  membersToggle.setAttribute('aria-pressed', String(!hidden));
  document.querySelector('.preview-layout').classList.toggle('members-hidden', hidden);
}

function showDetail(title, copy) {
  byId('dialog-title').textContent = title;
  byId('dialog-copy').textContent = copy;
  detail.showModal();
}

document.addEventListener('click', event => {
  const channel = event.target.closest('[data-channel]');
  if (channel) {
    event.preventDefault();
    openRoom(channel.dataset.channel);
  }
  const member = event.target.closest('[data-member]');
  if (member) {
    showDetail(member.dataset.member, 'Участник сервера «Золотые руины» · В сети');
  }
});

byId('effects-profile').addEventListener('change', event => {
  document.documentElement.dataset.effectsProfile = event.target.value;
});

membersToggle.addEventListener('click', () => setMembersHidden(!members.hidden));
const compactLayout = matchMedia('(max-width: 760px)');
compactLayout.addEventListener('change', event => setMembersHidden(event.matches));
setMembersHidden(compactLayout.matches);

byId('settings').addEventListener('click', () => {
  showDetail('Настройки предпросмотра', 'Выберите Full, Balanced или Lite в верхней панели. Для Discord параметры темы меняются через Custom CSS или QuickCSS.');
});
byId('invite').addEventListener('click', () => {
  showDetail('Приглашение', '«Золотые руины» — демонстрационный сервер в предпросмотре темы.');
});
byId('mic').addEventListener('click', event => {
  const button = event.currentTarget;
  button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
});
byId('voice-channel').addEventListener('click', event => {
  const button = event.currentTarget;
  const connected = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(connected));
  byId('voice-state').hidden = !connected;
});

search.addEventListener('input', updateMessages);

byId('emoji').addEventListener('click', () => {
  composer.value += '✧';
  composer.focus();
});

document.querySelector('.preview-form').addEventListener('submit', event => {
  event.preventDefault();
  const text = composer.value.trim();
  if (!text) return;

  const message = document.createElement('article');
  message.className = 'sample-message';
  message.dataset.room = room;
  const avatar = document.createElement('span');
  avatar.className = 'avatar avatar-olive';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = 'П';
  const copy = document.createElement('div');
  copy.className = 'message-copy';
  const heading = document.createElement('div');
  heading.className = 'message-head';
  const name = document.createElement('strong');
  name.textContent = 'Путник';
  const time = document.createElement('time');
  time.className = 'timestamp_2i8Bfm';
  time.textContent = new Intl.DateTimeFormat('ru', { hour: '2-digit', minute: '2-digit' }).format(new Date());
  const body = document.createElement('p');
  body.className = 'markup_ku1OHH messageContent_2i8Bfm';
  body.textContent = text;
  heading.append(name, time);
  copy.append(heading, body);
  message.append(avatar, copy);
  messages.append(message);
  composer.value = '';
  search.value = '';
  updateMessages();
  message.scrollIntoView({ block: 'nearest' });
});

const reaction = document.querySelector('.reaction');
reaction.addEventListener('click', () => {
  const selected = reaction.getAttribute('aria-pressed') !== 'true';
  reaction.setAttribute('aria-pressed', String(selected));
  reaction.querySelector('[data-count]').textContent = selected ? '3' : '2';
});

menu.addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'react') reaction.click();
  if (action === 'reply') {
    composer.value = `@Эрида ${composer.value}`;
    composer.focus();
  }
  if (action) menu.hidePopover();
});
