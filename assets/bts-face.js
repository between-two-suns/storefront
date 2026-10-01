// Full interaction exists only on SSR-approved Home/PDP instances.
class ProductFace extends HTMLElement {
  static parts = ['stage', 'card', 'front', 'back', 'turn', 'inci', 'inci-template'];
  static optional = ['inci', 'inci-template'];
  connectedCallback() {
    if (this.dataset.ready) { this.fitObserver?.observe(this.parts.back); return; }
    try {
      const parts = {};
      for (const part of ProductFace.parts) {
        const node = this.querySelector(`[data-part="${part}"]`);
        if (!node && !ProductFace.optional.includes(part)) throw new Error(`Missing face part: ${part}`);
        parts[part] = node;
      }
      this.parts = parts;
      this.hasInert = 'inert' in HTMLElement.prototype;
      if (!this.hasInert) this.dataset.fallback = 'true';
      parts.back.inert = true;
      parts.turn.hidden = false;
      parts.turn.addEventListener('click', () => this.turn());
      parts.inci?.addEventListener('click', event => {
        if (window.BTS?.sheet.openInci(parts['inci-template'], parts.inci)) event.preventDefault();
      });
      this.dataset.ready = 'true';
      if (typeof ResizeObserver === 'function') {
        this.fitObserver = new ResizeObserver(() => {
          const overflow = parts.back.scrollHeight > parts.back.clientHeight + 1;
          this.dataset.backOverflow = String(overflow);
          parts.turn.hidden = false;
          if (overflow && new URLSearchParams(location.search).get('bts_debug') === '1') console.assert(false, `Back does not fit: ${this.dataset.key}`);
        });
        this.fitObserver.observe(parts.back);
        parts.back.querySelectorAll('p, ul').forEach(node => this.fitObserver.observe(node));
      }
    } catch (error) {
      window.BTS?.track('bts_runtime_error', { component: 'bts-product-face', message: String(error) });
    }
  }
  disconnectedCallback() { this.fitObserver?.disconnect(); }
  turn(side = this.dataset.side === 'front' ? 'back' : 'front') {
    if (!this.parts || side === this.dataset.side) return;
    const { front, back, turn } = this.parts;
    if (side === 'front' && back.contains(document.activeElement)) turn.focus();
    clearTimeout(this.hideTimer);
    front.hidden = false; back.hidden = false;
    this.dataset.side = side;
    front.inert = side === 'back'; back.inert = side === 'front';
    this.hideTimer = setTimeout(() => { front.hidden = side === 'back'; back.hidden = side === 'front'; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 160 : 240);
    turn.setAttribute('aria-pressed', String(side === 'back'));
    window.BTS?.track('bts_product_turn', { side_to: side, sku_handle: this.dataset.key, surface: this.dataset.variant });
  }
}
if (!customElements.get('bts-product-face')) customElements.define('bts-product-face', ProductFace);

function observeShelfInfo(root = document) {
  if (typeof ResizeObserver !== 'function') return;
  for (const face of root.querySelectorAll('.pf[data-variant="shelf"]')) {
    const info = face.querySelector('.pf__info');
    if (!info || face.infoObserver) continue;
    face.infoObserver = new ResizeObserver(() => {
      const contentFloor = info.getBoundingClientRect().bottom - parseFloat(getComputedStyle(info).paddingBottom);
      const overflow = info.scrollHeight > info.clientHeight + 1 || [...info.children].some(node => node.getBoundingClientRect().bottom > contentFloor + 1);
      face.dataset.infoOverflow = String(overflow);
      if (overflow && new URLSearchParams(location.search).get('bts_debug') === '1') console.assert(false, `Shelf info does not fit: ${face.dataset.key || info.querySelector('.pf__name')?.textContent}`);
    });
    face.infoObserver.observe(info);
    [...info.children].forEach(node => face.infoObserver.observe(node));
  }
}
observeShelfInfo();
document.addEventListener('shopify:section:load', event => observeShelfInfo(event.target));
