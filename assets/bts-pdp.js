const openInciTarget = () => {
  if (!location.hash.startsWith('#inci-')) return;
  const target = document.getElementById(location.hash.slice(1));
  if (target instanceof HTMLDetailsElement) target.open = true;
};
openInciTarget();
window.addEventListener('hashchange', openInciTarget);
const primary = document.querySelector('[data-bts-primary-add]');
const sticky = document.querySelector('[data-bts-sticky-add]');
const footer = document.querySelector('footer');
if (primary && sticky && typeof IntersectionObserver === 'function') {
  const update = () => {
    const primaryPassed = primary.getBoundingClientRect().bottom < 0;
    const footerBox = footer?.getBoundingClientRect();
    const footerVisible = footerBox && footerBox.top < innerHeight && footerBox.bottom > 0;
    const keyboard = window.visualViewport && window.visualViewport.height < window.innerHeight * .75;
    const enabled = primary.querySelector('[data-bts-add]')?.disabled === false;
    const show = matchMedia('(max-width: 989px)').matches && primaryPassed && !footerVisible && !window.BTS?.sheet.isOpen && !keyboard && enabled;
    if (!show && sticky.contains(document.activeElement)) document.querySelector('[data-bts-open="bts-drawer"]')?.focus({ preventScroll: true });
    sticky.hidden = !show; sticky.inert = !show;
    document.documentElement.style.setProperty('--sticky-h', show ? `${sticky.getBoundingClientRect().height}px` : '0px');
  };
  const visibility = new IntersectionObserver(update);
  visibility.observe(primary);
  const product = primary.closest('.pf__inner');
  if (product) visibility.observe(product);
  if (footer) visibility.observe(footer);
  new ResizeObserver(update).observe(primary);
  document.addEventListener('bts:sheet', update);
  window.visualViewport?.addEventListener('resize', update);
  matchMedia('(max-width: 989px)').addEventListener('change', update);
  new MutationObserver(update).observe(primary, { subtree: true, attributes: true, attributeFilter: ['disabled'] });
}
