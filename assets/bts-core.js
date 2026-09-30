// Launch is intentionally locked until a real Shopify adapter passes staging QA.
const mode = 'prototype';
const reviewOnly = document.body.dataset.btsReview === 'true';
let config = null;
try { config = JSON.parse(document.getElementById('bts-proto')?.textContent || 'null'); } catch {}
let catalog = {};
let moneyConfig = {};
try { catalog = JSON.parse(document.getElementById('bts-catalog')?.textContent || '{}') || {}; } catch {}
try { moneyConfig = JSON.parse(document.getElementById('bts-money-config')?.textContent || '{}') || {}; } catch {}
const maxQty = Math.max(1, Math.min(99, Number(document.body.dataset.btsQtyMax) || 6));
const emptyCart = (currency = '') => ({ lines: [], count: 0, subtotal: 0, routineSaving: 0, total: 0, currency });

class PrototypeCartAdapter {
  constructor(data) {
    this.config = data;
    this.scenario = data?.scenarios?.[data.scenario];
    this.items = [];
    try {
      const stored = JSON.parse(localStorage.getItem('bts:proto-cart') || '[]');
      if (Array.isArray(stored)) this.items = this.clean(stored);
    } catch {}
  }
  price(handle) {
    if (!catalog[handle]?.name) return null;
    const value = handle === 'the-full-routine' ? this.scenario?.routine?.price : this.scenario?.prices?.[handle];
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.round(value * 100) : null;
  }
  clean(items) {
    if (reviewOnly) return [];
    const merged = new Map();
    for (const item of items) {
      if (!item || typeof item.handle !== 'string' || this.price(item.handle) === null) continue;
      const qty = Math.min(maxQty, Math.max(0, Math.trunc(Number(item.qty) || 0)));
      if (qty) merged.set(item.handle, Math.min(maxQty, (merged.get(item.handle) || 0) + qty));
    }
    return [...merged].map(([handle, qty]) => ({ handle, qty }));
  }
  async get() {
    const lines = this.items.map(({ handle, qty }) => {
      const unit = this.price(handle);
      return { key: handle, handle, title: catalog[handle].name, role: catalog[handle].role || '', size: catalog[handle].size || '', colour: catalog[handle].colour || '', step: catalog[handle].step, image: catalog[handle].image || '', qty, unit, line: unit * qty, isBundle: handle === 'the-full-routine' };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.line, 0);
    const bundleQty = lines.find(line => line.isBundle)?.qty || 0;
    return { lines, count: lines.reduce((sum, line) => sum + line.qty, 0), subtotal, routineSaving: Math.round((this.scenario?.routine?.save || 0) * 100) * bundleQty, total: subtotal, currency: this.config?.currency || '' };
  }
  async save(items) {
    this.items = this.clean(items);
    try { localStorage.setItem('bts:proto-cart', JSON.stringify(this.items)); } catch {}
    return this.get();
  }
  async add(items) { return this.save([...this.items, ...items]); }
  async change(key, qty) { return this.save(this.items.map(item => item.handle === key ? { ...item, qty } : item)); }
  async remove(key) { return this.change(key, 0); }
  async swapToRoutine() {
    if (this.price('the-full-routine') === null || this.items.some(item => item.handle === 'the-full-routine')) return this.get();
    const singles = Object.keys(this.scenario?.prices || {});
    return this.save([...this.items.map(item => singles.includes(item.handle) ? { ...item, qty: item.qty - 1 } : item), { handle: 'the-full-routine', qty: 1 }]);
  }
}

class ShopifyCartAdapter {
  async get() { return emptyCart(); }
  async add() { throw new Error('Launch adapter is not enabled'); }
  async change() { throw new Error('Launch adapter is not enabled'); }
  async remove(key) { return this.change(key, 0); }
  async swapToRoutine() { throw new Error('Launch adapter is not enabled'); }
}
const adapter = mode === 'prototype' ? new PrototypeCartAdapter(config) : new ShopifyCartAdapter();
function money(amount, currency = 'EGP') {
  if (!Number.isFinite(amount) || amount < 0 || typeof moneyConfig.pattern !== 'string' || !currency) return '—';
  const grouped = Math.round(amount / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const label = currency === 'EGP' ? moneyConfig.currency_label : currency;
  if (!label) return '—';
  return moneyConfig.pattern.replace('__AMOUNT__', grouped).replace('__CURRENCY__', label);
}
function track(event, payload = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, mode, locale: document.documentElement.lang, ...payload });
}
window.BTS = { mode, adapter, PrototypeCartAdapter, ShopifyCartAdapter, money, track };
function render(cart) {
  document.querySelectorAll('[data-bts-count]').forEach(node => { node.textContent = String(cart.count); });
  document.querySelectorAll('[data-bts-cart]').forEach(root => {
    const list = root.querySelector('[data-bts-lines]');
    const template = root.querySelector('[data-bts-line]');
    if (!list || !template) return;
    list.replaceChildren();
    for (const line of cart.lines) {
      const fragment = template.content.cloneNode(true);
      fragment.querySelector('[data-title]').textContent = line.title;
      const qty = fragment.querySelector('[data-qty]');
      qty.value = String(line.qty); qty.max = String(maxQty); qty.dataset.key = line.key;
      fragment.querySelector('[data-chip]').dataset.colour = line.colour;
      const image = fragment.querySelector('[data-line-image]');
      if (image && line.image) { image.src = line.image; image.alt = ''; image.hidden = false; }
      fragment.querySelector('[data-meta]').textContent = [line.step ? String(line.step).padStart(2, '0') : '', line.role, line.size].filter(Boolean).join(' · ');
      fragment.querySelector('[data-line-total]').textContent = money(line.line, cart.currency);
      fragment.querySelector('[data-remove]').dataset.remove = line.key;
      list.append(fragment);
    }
    const empty = root.querySelector('[data-bts-empty]');
    if (empty) empty.hidden = cart.count > 0;
    const saving = root.querySelector('[data-bts-saving]');
    if (saving) { saving.hidden = cart.routineSaving <= 0; saving.querySelector('[data-bts-saving-amount]').textContent = money(cart.routineSaving, cart.currency); }
    const total = root.querySelector('[data-bts-total]');
    if (total) total.textContent = money(cart.total, cart.currency);
  });
}
function reportError() {
  document.querySelectorAll('[data-bts-status]').forEach(node => { node.textContent = node.dataset.error; });
}
const invokers = new WeakMap();
let activeDialog = null;
let scrollPosition = 0;
function unlock() {
  document.documentElement.classList.remove('bts-scroll-locked');
  document.documentElement.style.removeProperty('--bts-scroll-offset');
  window.scrollTo(0, scrollPosition);
}
function openDialog(id, invoker) {
  const dialog = document.getElementById(id);
  if (!dialog || typeof dialog.showModal !== 'function') return false;
  if (dialog.open) return true;
  const previous = activeDialog;
  activeDialog = dialog;
  if (previous?.open) previous.close();
  else {
    scrollPosition = window.scrollY;
    document.documentElement.style.setProperty('--bts-scroll-offset', `${-scrollPosition}px`);
    document.documentElement.classList.add('bts-scroll-locked');
  }
  invokers.set(dialog, invoker || document.activeElement);
  try { dialog.showModal(); }
  catch { activeDialog = null; unlock(); return false; }
  dialog.querySelector('h2')?.focus();
  document.dispatchEvent(new Event('bts:sheet'));
  return true;
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || !dialog.open) return;
    const targets = [...dialog.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]')].filter(node => !node.disabled && node.tabIndex >= 0 && !node.closest('[inert]') && node.getClientRects().length);
    const index = targets.indexOf(document.activeElement);
    if (!targets.length) { event.preventDefault(); dialog.querySelector('h2')?.focus(); return; }
    if (index < 0 || (!event.shiftKey && index === targets.length - 1) || (event.shiftKey && index === 0)) {
      event.preventDefault(); targets[event.shiftKey ? targets.length - 1 : 0].focus();
    }
  });
  dialog.addEventListener('close', () => {
    if (activeDialog !== dialog) return;
    activeDialog = null;
    unlock();
    document.dispatchEvent(new Event('bts:sheet'));
    const invoker = invokers.get(dialog);
    if (invoker?.isConnected) invoker.focus();
  });
  let backdropDown = false;
  dialog.addEventListener('pointerdown', e => { backdropDown = e.target === dialog; });
  dialog.addEventListener('click', e => {
    const rect = dialog.getBoundingClientRect();
    if (backdropDown && e.target === dialog && (e.clientX < rect.x || e.clientX > rect.x + rect.width || e.clientY < rect.y || e.clientY > rect.y + rect.height)) dialog.close();
    backdropDown = false;
  });
});
window.BTS.sheet = {
  open: openDialog,
  get isOpen() { return Boolean(activeDialog?.open); },
  openInci(template, invoker) {
    const host = document.getElementById('bts-inci-content');
    if (!host || !template?.content) return false;
    host.replaceChildren(template.content.cloneNode(true));
    return openDialog('bts-inci', invoker);
  }
};
document.addEventListener('click', async event => {
  const target = event.target.closest?.('button,a');
  if (!target) return;
  if (target.dataset.btsOpen) {
    if (openDialog(target.dataset.btsOpen, target)) event.preventDefault();
    return;
  }
  if (target.hasAttribute('data-bts-close')) { target.closest('dialog')?.close(); return; }
  try {
    if (target.dataset.btsAdd && !target.disabled && target.dataset.btsPurchasable !== 'false' && mode === 'prototype') {
      render(await adapter.add([{ handle: target.dataset.btsAdd, qty: 1 }]));
      if (target.closest('.pf[data-variant="shelf"]')) {
        const label = target.dataset.addLabel || target.textContent;
        target.dataset.addLabel = label;
        target.textContent = target.dataset.added;
        clearTimeout(target.btsAddedTimer);
        target.btsAddedTimer = setTimeout(() => { target.textContent = label; }, 1200);
        document.querySelector('[data-bts-added-status]').textContent = `${catalog[target.dataset.btsAdd].name} · ${target.dataset.added}`;
      } else openDialog('bts-drawer', target);
    }
    if (target.dataset.remove) render(await adapter.remove(target.dataset.remove));
  } catch { reportError(); }
});
if (mode === 'prototype') {
  document.querySelectorAll('[data-bts-add]').forEach(button => { button.disabled = button.dataset.btsPurchasable === 'false' || adapter.price(button.dataset.btsAdd) === null; });
}
// Founder links retain exactly the same persistent server-rendered prototype marker.
document.addEventListener('change', async event => {
  const input = event.target;
  if (!input.matches?.('[data-qty]')) return;
  try {
    render(await adapter.change(input.dataset.key, input.value));
    document.querySelectorAll('[data-qty]').forEach(node => { if (node.dataset.key === input.dataset.key && node.closest('dialog')?.open) node.focus(); });
  } catch { reportError(); }
});
window.addEventListener('storage', event => {
  if (event.key !== 'bts:proto-cart') return;
  try { adapter.items = adapter.clean(JSON.parse(event.newValue || '[]')); adapter.get().then(render).catch(reportError); } catch {}
});
document.querySelectorAll('[data-bts-money]').forEach(node => { node.textContent = money(Number(node.dataset.amount), node.dataset.currency); });
adapter.get().then(render).catch(reportError);
