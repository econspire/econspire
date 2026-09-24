/* The channel export supplied on 24 September 2026 has no future event announcement.
   Add confirmed future events here when their information source is connected.
   Shape: {title, city, dateLabel, dateISO, format, details, eligibility, registrationUrl}. */
const UPCOMING_EVENTS = [];

const stages = [
  {word:'DISCOVER', kicker:'THE START', description:'New event details are posted on Econspire’s channel. Check the city, registration link, format and deadline before joining.'},
  {word:'RESEARCH', kicker:'THE BRIEF', description:'The case defines the problem. Read the instructions carefully, look for evidence and note which assumptions your team is making.'},
  {word:'DECIDE', kicker:'THE TEAM', description:'Compare options, consider trade-offs and choose a solution your team can explain clearly. Team rules vary by competition.'},
  {word:'DEFEND', kicker:'THE ROOM', description:'Present your reasoning, answer the judges’ questions and learn from their feedback. Awards and certificates depend on the event.'}
];

const tabs = [...document.querySelectorAll('.format-step')];
const panel = document.querySelector('#step-panel');
function setStage(index, moveFocus = false) {
  tabs.forEach((tab, i) => {
    const selected = i === index;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tabs[index].id);
  document.querySelector('#step-number').textContent = String(index + 1).padStart(2, '0');
  document.querySelector('#graphic-word').textContent = stages[index].word;
  document.querySelector('#step-kicker').textContent = stages[index].kicker;
  document.querySelector('#step-description').textContent = stages[index].description;
  if (moveFocus) tabs[index].focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setStage(index));
  tab.addEventListener('keydown', event => {
    const next = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? (index + 1) % tabs.length
      : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next !== null) { event.preventDefault(); setStage(next, true); }
  });
});
setStage(0);

const eventList = document.querySelector('#event-list');
const eventEmpty = document.querySelector('#event-empty');
const confirmedEvents = UPCOMING_EVENTS.filter(event => event.title && event.dateLabel && event.city);
document.querySelector('#event-count').textContent = String(confirmedEvents.length).padStart(2, '0');
if (confirmedEvents.length) {
  eventEmpty.hidden = true;
  confirmedEvents.forEach(event => {
    const card = document.createElement('article');
    card.className = 'event-card reveal';
    const when = document.createElement('time');
    when.textContent = event.dateLabel;
    if (event.dateISO) when.dateTime = event.dateISO;
    const detail = document.createElement('div');
    const city = document.createElement('span');
    city.className = 'event-meta';
    city.textContent = event.city + (event.format ? ' / ' + event.format : '');
    const title = document.createElement('h3');
    title.textContent = event.title;
    const description = document.createElement('p');
    description.textContent = event.details || '';
    detail.append(city, title, description);
    if (event.eligibility) {
      const eligibility = document.createElement('p');
      eligibility.textContent = 'Who can join: ' + event.eligibility;
      detail.append(eligibility);
    }
    card.append(when, detail);
    if (event.registrationUrl) {
      const link = document.createElement('a');
      link.href = event.registrationUrl;
      link.textContent = 'Event details ↗';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      card.append(link);
    }
    eventList.append(card);
  });
}

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
}
menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  mobileNav.hidden = !opening;
  document.body.classList.toggle('menu-open', opening);
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, {threshold:.08, rootMargin:'0px 0px 50px 0px'});
  reveals.forEach(element => observer.observe(element));
} else reveals.forEach(element => element.classList.add('visible'));

const progress = document.querySelector('.scroll-progress');
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let scrollQueued = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  let current = sections[0];
  for (const section of sections) if (section.getBoundingClientRect().top < 140) current = section;
  navLinks.forEach(link => link.classList.toggle('active', current && link.getAttribute('href') === '#' + current.id));
  scrollQueued = false;
}
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, {passive:true});
addEventListener('resize', updateScroll);
updateScroll();

const carousel = document.querySelector('.hero-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let timer;
  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === active);
      slide.setAttribute('aria-hidden', String(i !== active));
    });
  };
  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    if (!reducedMotion.matches && !document.hidden) {
      timer = setInterval(() => show(active + 1), 5000);
    }
  };
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener('change', start);
  start();
}
