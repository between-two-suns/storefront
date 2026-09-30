const shelf = document.querySelector('.bts-shelf');
const nav = document.querySelector('.bts-shelf-nav');
if (shelf && nav && typeof IntersectionObserver === 'function') {
  const items = [...shelf.children];
  const links = [...nav.querySelectorAll('[data-shelf-target]')];
  const controls = nav.querySelector('[data-shelf-controls]');
  const mobile = matchMedia('(max-width: 989px)');
  nav.dataset.enhanced = 'true';
  let current = 0;
  const ratios = new Map();
  const update = () => {
    controls.hidden = !mobile.matches || items.length < 2;
    links.forEach((link, index) => {
      if (mobile.matches && index === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    nav.querySelector('[data-shelf-direction="previous"]').disabled = current === 0;
    nav.querySelector('[data-shelf-direction="next"]').disabled = current === items.length - 1;
  };
  const go = index => {
    current = Math.max(0, Math.min(items.length - 1, index));
    items[current].scrollIntoView({ block: 'nearest', inline: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    update();
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
    if (mobile.matches) current = items.reduce((index, item, next) => (ratios.get(item) || 0) > (ratios.get(items[index]) || 0) ? next : index, 0);
    update();
  }, { root: shelf, threshold: [0, .25, .5, .75, 1] });
  items.forEach(item => observer.observe(item));
  links.forEach((link, index) => link.addEventListener('click', event => { if (mobile.matches) { event.preventDefault(); go(index); } }));
  nav.querySelectorAll('[data-shelf-direction]').forEach(button => button.addEventListener('click', () => go(current + (button.dataset.shelfDirection === 'next' ? 1 : -1))));
  mobile.addEventListener('change', update);
  update();
}
