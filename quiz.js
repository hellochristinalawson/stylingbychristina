// "What's holding your wardrobe back?" — 8 questions, scored across four challenges.
const PILLARS = {
  clarity: {
    name: 'Style Clarity', title: ['You know what you like,', 'but can’t make it your own.'],
    body: 'Your taste is fine. The gap is translation: which shapes, proportions and fabrics turn what you love into what works on you. Until that’s clear, every purchase is a guess.',
    steps: ['Pull the three pieces you feel best in and look for what they share: neckline, length, weight of fabric.', ['Choose three style words.', 'Think about how you want to feel in your clothes. Polished? Relaxed? Playful? Pick three words to describe your ideal style and use them as a reference when putting outfits together or shopping.'], ['Recreate, don’t replicate.', 'Choose an outfit you love and try recreating it with what you already own. Focus on the overall silhouette and proportions rather than finding identical pieces.']],
    pkg: 'discovery', pkgName: 'Style Discovery', price: '<span class="cur">€</span>110',
    why: 'A 60-minute session, a moodboard and three outfit formulas that give you rules you can actually use.'
  },
  overwhelm: {
    name: 'Wardrobe Overwhelm', title: ['A full wardrobe.', 'Nothing to wear.'],
    body: 'You don’t need more clothes. You need the ones you own edited and seen with fresh eyes.',
    steps: ['Turn every hanger backwards. In 30 days, anything still backwards is a question mark.', 'Make a pile of things that almost fit. Many are one alteration away from your favourite piece.', 'Add or change one thing in one of your go-to outfits that you wouldn’t normally pair. Try a different shoe, accessory, or swap a basic for your loudest piece.'],
    pkg: 'edit', pkgName: 'Wardrobe Edit', price: '<span class="cur">€</span>245',
    why: 'A two-hour review of what you own: keep, alter, sell or donate, plus up to 8 outfits and a short list of what’s missing.'
  },
  shopping: {
    name: 'Shopping Frustration', title: ['Good pieces.', 'No outfits.'],
    body: 'You buy things you like one at a time, and they never quite go together.',
    steps: ['Before you buy, name three things you already own that it goes with. No three, no purchase.', ['Keep a wardrobe wishlist.', 'Whenever you notice yourself wishing you owned something, write it down. Revisit your list in a week. You’ll start noticing which items you repeatedly need and which were just passing impulses.'], 'Check the fibre label and the seams. Good construction outlasts a good price.'],
    pkg: 'builder', pkgName: 'Outfit Builder', price: '<span class="cur">€</span>345',
    why: 'Up to 3 hours of personal shopping or sourcing, a moodboard and a lookbook of up to 8 outfits.'
  },
  lifestyle: {
    name: 'Lifestyle Disconnect', title: ['Your life changed.', 'Your wardrobe didn’t.'],
    body: 'New role, new business, new city, new chapter. Your clothes are still dressing the old version of you.',
    steps: ['List what a normal week looks like now: where you go, who you see, what you need to do in your clothes. Notice which pieces belong to the old routine.', 'Notice what is causing the disconnect. Is it fit, quality, or your taste? Some of these are fixable with an alteration and a fresh perspective.', 'Pick one setting that matters most right now, like a pitch, a stage or a first date, and dress for that first.'],
    pkg: 'reset', pkgName: 'Complete Style Reset', price: '<span class="cur">€</span>549',
    why: 'Everything in Wardrobe Edit and Outfit Builder, with a lookbook of up to 12 outfits and a follow-up session.'
  }
};

const Q = [
  { q: ['Weekday morning.', 'Getting dressed feels like…'], a: [
    ['A coin toss. I never know what actually works on me.', 'clarity'],
    ['Staring at a full rail with nothing to wear.', 'overwhelm'],
    ['The same four things, while new stuff hangs with tags on.', 'shopping'],
    ['Dressing for a life I don’t really live any more.', 'lifestyle'] ] },
  { q: ['Your last shopping trip', 'ended with…'], a: [
    ['Something I loved on the hanger and hated on me.', 'clarity'],
    ['Honestly? I already have too much.', 'overwhelm'],
    ['A great piece that goes with nothing I own.', 'shopping'],
    ['Nothing. I don’t know what “me” wears now.', 'lifestyle'] ] },
  { q: ['Be honest. How much of your wardrobe', 'do you actually wear?'], a: [
    ['Hard to say. It’s pretty random.', 'clarity'],
    ['Less than a third.', 'overwhelm'],
    ['Mostly the newest things, until they go stale.', 'shopping'],
    ['The “old me” clothes just sit there.', 'lifestyle'] ] },
  { q: ['Where does fit', 'let you down?'], a: [
    ['I don’t know which shapes suit my body.', 'clarity'],
    ['Lots of things almost fit. Almost.', 'overwhelm'],
    ['I buy by size label and send half of it back.', 'shopping'],
    ['My body or routine changed. My clothes didn’t.', 'lifestyle'] ] },
  { q: ['What’s putting the pressure', 'on right now?'], a: [
    ['Photos, a personal brand, being seen.', 'clarity'],
    ['Nothing big. I just want easy mornings.', 'overwhelm'],
    ['A budget I’m tired of wasting.', 'shopping'],
    ['A new role, business, city or chapter.', 'lifestyle'] ] },
  { q: ['Your saved style inspiration', 'looks like…'], a: [
    ['Hundreds of images, and none of them look like me.', 'clarity'],
    ['I don’t have time to save inspiration.', 'overwhelm'],
    ['A wishlist of things I’ll probably buy anyway.', 'shopping'],
    ['Someone I’m trying to become.', 'lifestyle'] ] },
  { q: ['What would change things', 'the most?'], a: [
    ['Knowing my own style rules.', 'clarity'],
    ['Outfits ready to go from what I already own.', 'overwhelm'],
    ['A shopping list I can trust.', 'shopping'],
    ['A wardrobe that fits who I’m becoming.', 'lifestyle'] ] },
  { q: ['Walking into the room,', 'you want to feel…'], a: [
    ['Unmistakably myself.', 'clarity'],
    ['Effortless. Not overthought.', 'overwhelm'],
    ['Polished, put together, worth the investment.', 'shopping'],
    ['Like the person I’m becoming.', 'lifestyle'] ] }
];

const stage = document.getElementById('quiz-stage');
const bar = document.querySelector('.quiz__bar i');
let i = 0; const picks = [];

function esc(s) { return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function renderQ() {
  const item = Q[i];
  bar.style.width = (i / Q.length * 100) + '%';
  stage.innerHTML = `
    <div class="fade-in">
      <div class="quiz__meta"><span class="label label--chalk">Question ${String(i + 1).padStart(2, '0')} / ${String(Q.length).padStart(2, '0')}</span><span class="label">Pick the closest</span></div>
      <h2 class="quiz__q">${esc(item.q[0])} <span class="serif">${esc(item.q[1])}</span></h2>
      <div class="opts">${item.a.map((a, k) => `<button class="opt${picks[i] === k ? ' is-picked' : ''}" type="button" data-k="${k}"><b>${'ABCD'[k]}</b><span>${esc(a[0])}</span></button>`).join('')}</div>
      <div class="quiz__nav">${i > 0 ? '<button class="linkbtn" type="button" data-back>← Back</button>' : '<span></span>'}<span class="label">${Q.length - i - 1 ? (Q.length - i - 1) + ' to go' : 'Last one'}</span></div>
    </div>`;
  stage.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
    picks[i] = +b.dataset.k;
    b.classList.add('is-picked');
    setTimeout(() => { i++; i < Q.length ? renderQ() : renderResult(); }, 260);
  }));
  const back = stage.querySelector('[data-back]');
  if (back) back.addEventListener('click', () => { i--; renderQ(); });
  stage.querySelector('.opt').focus({ preventScroll: true });
}

function renderResult() {
  bar.style.width = '100%';
  const score = { clarity: 0, overwhelm: 0, shopping: 0, lifestyle: 0 };
  picks.forEach((k, n) => score[Q[n].a[k][1]]++);
  const order = Object.keys(score).sort((a, b) => score[b] - score[a]);
  const top = PILLARS[order[0]];
  const second = score[order[1]] >= 2 ? PILLARS[order[1]] : null;
  const mix = order.filter((k) => score[k] > 0);
  stage.innerHTML = `
    <div class="fade-in">
      <div class="result__head">
        <h2 class="display">${esc(top.title[0])} <span class="serif">${esc(top.title[1])}</span></h2>
        <p class="lead">${esc(top.body)}</p>
        <div class="mix" aria-label="Your mix of challenges">${mix.map((k) => `<div style="flex-grow:${score[k]}">${esc(PILLARS[k].name)} · ${score[k]}</div>`).join('')}</div>
        ${second ? `<p class="label">There’s a strong streak of ${esc(second.name)} in there too. Most people are a mix.</p>` : ''}
      </div>
      <div class="result__cols">
        <div>
          <span class="label">Three things to try this week</span>
          <ol>${top.steps.map((s) => Array.isArray(s) ? `<li>${esc(s[0])} ${esc(s[1])}</li>` : `<li>${esc(s)}</li>`).join('')}</ol>
        </div>
        <div class="rx">
          <h3>Start with ${esc(top.pkgName)}</h3>
          <div class="price">${top.price}</div>
          <p>${esc(top.why)}</p>
          <div class="btn-row" style="margin-top:22px">
            <a class="btn btn--chalk" href="book.html?p=${top.pkg}">Book this <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
            <a class="btn" style="border-color:#efe9df;color:#efe9df" href="services.html#${top.pkg}">Details</a>
          </div>
        </div>
      </div>
      <p style="margin-top:36px"><button class="linkbtn" type="button" data-restart>↺ Take it again</button></p>
    </div>`;
  stage.querySelector('[data-restart]').addEventListener('click', () => { i = 0; picks.length = 0; renderQ(); });
  window.scrollTo({ top: stage.offsetTop - 120, behavior: 'smooth' });
}

document.getElementById('quiz-start').addEventListener('click', () => {
  document.getElementById('quiz-intro').hidden = true;
  document.getElementById('quiz-run').hidden = false;
  renderQ();
  window.scrollTo({ top: stage.offsetTop - 140, behavior: 'smooth' });
});
