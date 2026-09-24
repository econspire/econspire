import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getFirestore, collection, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const list = document.querySelector('#event-list');
const empty = document.querySelector('#event-empty');
const count = document.querySelector('#event-count');
const today = () => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en',{timeZone:'Asia/Tashkent',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(part => [part.type,part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}
function safeLink(value) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; }
  catch { return null; }
}
function render(records) {
  const upcoming = records.filter(event => event.status === 'published' && /^\d{4}-\d{2}-\d{2}$/.test(event.date || '') && event.date >= today() && event.title && event.city)
    .sort((a,b) => a.date.localeCompare(b.date));
  list.replaceChildren();
  count.textContent = String(upcoming.length).padStart(2,'0');
  empty.hidden = upcoming.length > 0;
  upcoming.forEach(event => {
    const card = make('article','event-card');
    const [year,month,day] = event.date.split('-');
    const monthLabel = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(month)-1];
    const when = make('time','',`${Number(day)} ${monthLabel} ${year}`);
    when.dateTime = event.date;
    const body = make('div');
    body.append(make('span','event-meta',[event.city,event.time,event.venue].filter(Boolean).join(' / ')),make('h3','',event.title),make('p','',event.summary || ''));
    if (event.audience) body.append(make('p','',`Who can join: ${event.audience}`));
    if (event.fee) body.append(make('p','',`Participation: ${event.fee}`));
    card.append(when,body);
    const url = safeLink(event.registrationUrl);
    if (url) {
      const link = make('a','', 'Register ↗');
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      card.append(link);
    }
    list.append(card);
  });
}

render([]);
if (Object.values(firebaseConfig).every(Boolean)) {
  try {
    const db = getFirestore(initializeApp(firebaseConfig));
    onSnapshot(query(collection(db,'events'),where('status','==','published')),snapshot => render(snapshot.docs.map(item => item.data())),error => {
      console.error('Event updates unavailable',error);
      empty.querySelector('h3').textContent = 'Event updates are temporarily unavailable.';
      empty.querySelector('p').textContent = 'Check the official channel for current announcements.';
    });
  } catch (error) { console.error('Firebase could not start',error); }
}
