document.documentElement.classList.add('js');

// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });
}

// Reveal on scroll
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { threshold: 0.12 }) : null;
document.querySelectorAll('.rv').forEach((el) => io ? io.observe(el) : el.classList.add('is-in'));

// Chalk notes on the hero photo appear one by one
document.querySelectorAll('.note').forEach((n, i) => setTimeout(() => n.classList.add('is-in'), 500 + i * 260));

// Diagnosis rows (homepage problem selector)
document.querySelectorAll('.diag__row').forEach((row) => {
  row.addEventListener('click', () => {
    const panel = document.getElementById(row.getAttribute('aria-controls'));
    const open = row.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.diag__row').forEach((r) => {
      r.setAttribute('aria-expanded', 'false');
      document.getElementById(r.getAttribute('aria-controls')).classList.remove('is-open');
    });
    if (!open) { row.setAttribute('aria-expanded', 'true'); panel.classList.add('is-open'); }
  });
});

// Booking form: preselect package from ?p= and fake submit
const book = document.getElementById('book-form');
if (book) {
  const p = new URLSearchParams(location.search).get('p');
  if (p) { const r = book.querySelector(`input[name="package"][value="${p}"]`); if (r) r.checked = true; }
  // Some choices only work one way: the intro call is a video call
  const onlyFormat = { call: ['online', 'The free call is a quick video call.'] };
  const formatNote = document.getElementById('format-note');
  const syncFormat = () => {
    const pkg = book.querySelector('input[name="package"]:checked');
    const rule = pkg && onlyFormat[pkg.value];
    book.querySelectorAll('[data-format]').forEach((opt) => { opt.hidden = !!rule && opt.dataset.format !== rule[0]; });
    formatNote.hidden = !rule;
    if (rule) { formatNote.textContent = rule[1]; book.querySelector(`input[name="format"][value="${rule[0]}"]`).checked = true; }
  };
  // The free call books straight into cal.com instead of the enquiry form
  const calStep = document.getElementById('cal-step');
  const calFrame = document.getElementById('cal-frame');
  const syncCall = () => {
    const isCall = book.querySelector('input[name="package"]:checked')?.value === 'call';
    calStep.hidden = !isCall;
    book.querySelectorAll('[data-step="details"]').forEach((el) => { el.hidden = isCall; });
    const link = calFrame.dataset.cal;
    if (isCall && link && !calFrame.querySelector('iframe')) {
      calFrame.innerHTML = `<iframe src="https://cal.com/${link}?embed=true&layout=month_view&theme=light" title="Book a free 20-minute call" loading="lazy"></iframe>`;
    }
  };
  book.querySelectorAll('input[name="package"]').forEach((r) => r.addEventListener('change', () => { syncFormat(); syncCall(); }));
  syncFormat();
  syncCall();
  book.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!book.reportValidity()) return;
    const data = new FormData(book);
    // Send ticked 'What's it for?' options as one readable line
    const picks = data.getAll('for');
    data.delete('for');
    if (picks.length) data.set('for', picks.join(', '));
    const endpoint = book.dataset.endpoint;
    if (endpoint) {
      // Live: send the enquiry to the form service (e.g. Formspree)
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('send failed');
      } catch (err) {
        alert('Sorry, that didn’t send. Please try again, or email hello@christinalawson.com.');
        return;
      }
    } else {
      // Until a form service is connected, hand the enquiry to the visitor's email app
      const lines = [];
      for (const [k, v] of data.entries()) if (v) lines.push(`${k}: ${v}`);
      location.href = `mailto:hello@christinalawson.com?subject=${encodeURIComponent('Styling enquiry')}&body=${encodeURIComponent(lines.join('\n'))}`;
    }
    const name = (book.querySelector('#f-name').value || '').trim().split(' ')[0];
    book.hidden = true;
    const ok = document.getElementById('book-ok');
    ok.querySelector('[data-name]').textContent = name || 'there';
    ok.hidden = false;
    ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// Diagnosis tabs: hover or click a problem to preview where to start
const dtabs = [...document.querySelectorAll('.dtab')];
if (dtabs.length) {
  const narrow = window.matchMedia('(max-width: 900px)');
  const activate = (t, scroll) => {
    dtabs.forEach((r) => { const on = r === t; r.classList.toggle('is-active', on); r.setAttribute('aria-selected', on); document.getElementById(r.getAttribute('aria-controls')).classList.toggle('is-active', on); });
    if (scroll && narrow.matches) document.querySelector('.dpanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  dtabs.forEach((t) => {
    t.addEventListener('click', () => activate(t, true));
    t.addEventListener('mouseenter', () => { if (!narrow.matches) activate(t); });
  });
}

