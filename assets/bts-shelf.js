const shelf = document.querySelector('.bts-shelf');
const nav = document.querySelector('.bts-shelf-nav');
if (shelf && nav && typeof IntersectionObserver === 'function') {
  const items = [...shelf.children];
  const links = [...nav.querySelectorAll('[data-shelf-target]')];
  const controls = nav.querySelector('[data-shelf-controls]');
  const previous = nav.querySelector('[data-shelf-direction="previous"]');
  const next = nav.querySelector('[data-shelf-direction="next"]');
  const ratios = new Map();
  let current = 0;
  nav.dataset.enhanced = 'true';
  const update = () => {
    controls.hidden = items.length < 2;
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    previous.disabled = current === 0;
    next.disabled = current === items.length - 1;
  };
  const go = index => {
    current = Math.max(0, Math.min(items.length - 1, index));
    items[current].scrollIntoView({ block: 'nearest', inline: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    update();
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
    current = items.reduce((index, item, candidate) => (ratios.get(item) || 0) > (ratios.get(items[index]) || 0) ? candidate : index, 0);
    update();
  }, { root: shelf, threshold: [0, .25, .5, .75, 1] });
  items.forEach(item => observer.observe(item));
  links.forEach((link, index) => link.addEventListener('click', event => { event.preventDefault(); go(index); }));
  previous.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  update();
}
