(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => {
    const t = clamp((v - a) / Math.max(b - a, 0.0001));
    return t * t * (3 - 2 * t);
  };

  const SHAPES = {
    base:      [108, 124, 134, 142, 136, 122, 108],
    compress:  [142, 153, 160, 166, 160, 151, 142],
    open:      [ 86, 101, 112, 122, 114, 101,  88],
    sun:       [ 88, 103, 116, 126, 118, 104,  90],
    dust:      [ 98, 119, 109, 142, 122, 116,  96],
    pollution: [108, 131, 128, 151, 137, 124, 106],
    dryAc:     [ 83, 111,  99, 131, 106, 116,  86],
    humidity:  [ 94, 116, 132, 115, 137, 111,  92]
  };

  const ENV = [
    { key:'sun', title:'SUN', index:'01 / 05', copy:'Stronger UV. Higher exposure.', shape:SHAPES.sun },
    { key:'dust', title:'DUST', index:'02 / 05', copy:'Fine particles. Constant contact.', shape:SHAPES.dust },
    { key:'pollution', title:'POLLUTION', index:'03 / 05', copy:'Urban exposure. Particles and buildup.', shape:SHAPES.pollution },
    { key:'dry-ac', title:'DRY AC', index:'04 / 05', copy:'Cooler air. Lower humidity.', shape:SHAPES.dryAc },
    { key:'humidity', title:'HUMIDITY', index:'05 / 05', copy:'More moisture. Oil and comfort can shift.', shape:SHAPES.humidity }
  ];

  const PRODUCTS = {
    reset: {
      name:'Daily Reset Cleanser', size:'200 ml',
      image:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-reset-transparent.webp?v=1790629352'
    },
    clarity: {
      name:'Clarity Serum', size:'30 ml',
      image:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-clarity-transparent.webp?v=1790629358'
    },
    barrier: {
      name:'Daily Barrier Moisturizing Cream', size:'50 g',
      image:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-barrier-transparent.webp?v=1790629363'
    },
    defense: {
      name:'Daily Defense Sunscreen SPF 50', size:'50 g',
      image:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-defense-transparent.webp?v=1790629368'
    }
  };

  const pathD = (v, right = false, lineOnly = false) => {
    const x = (n) => right ? 390 - n : n;
    const [a,b,c,d,e,f,g] = v;
    if (lineOnly) {
      return `M ${x(a)} 0 C ${x(b)} 110 ${x(c)} 235 ${x(d)} 378 C ${x(e)} 500 ${x(f)} 665 ${x(g)} 844`;
    }
    if (right) {
      return `M 390 0 H ${x(a)} C ${x(b)} 110 ${x(c)} 235 ${x(d)} 378 C ${x(e)} 500 ${x(f)} 665 ${x(g)} 844 H 390 Z`;
    }
    return `M 0 0 H ${x(a)} C ${x(b)} 110 ${x(c)} 235 ${x(d)} 378 C ${x(e)} 500 ${x(f)} 665 ${x(g)} 844 H 0 Z`;
  };

  const interpolateShape = (a, b, t) => a.map((n, i) => mix(n, b[i], t));

  function init() {
    const root = document.querySelector('[data-bts7]');
    if (!root || root.dataset.ready === 'true') return;
    root.dataset.ready = 'true';

    const header = document.querySelector('[data-bts-header]');
    const pageProgress = root.querySelector('[data-bts7-progress]');

    const updatePage = () => {
      const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
      const p = clamp(scrollY / max);
      if (pageProgress) pageProgress.style.transform = `scaleX(${p})`;
      header?.classList.toggle('is-scrolled', scrollY > 20);
    };
    updatePage();
    addEventListener('scroll', updatePage, { passive:true });
    addEventListener('resize', updatePage);

    const hero = root.querySelector('[data-bts7-hero]');
    const heroStage = hero?.querySelector('.bts7-hero-stage');
    const left = hero?.querySelector('[data-bts7-left]');
    const right = hero?.querySelector('[data-bts7-right]');
    const leftLine = hero?.querySelector('[data-bts7-left-line]');
    const rightLine = hero?.querySelector('[data-bts7-right-line]');
    const envButtons = [...(hero?.querySelectorAll('[data-env]') || [])];
    const envIndex = hero?.querySelector('[data-bts7-env-index]');
    const envTitle = hero?.querySelector('[data-bts7-env-title]');
    const envCopy = hero?.querySelector('[data-bts7-env-copy]');
    const heroCopyEl = hero?.querySelector('[data-bts7-hero-copy]');
    const betweenEl = hero?.querySelector('[data-bts7-between]');
    const envTabsEl = hero?.querySelector('[data-bts7-env-tabs]');

    const paintShape = (shape) => {
      if (left) left.setAttribute('d', pathD(shape));
      if (right) right.setAttribute('d', pathD(shape, true));
      if (leftLine) leftLine.setAttribute('d', pathD(shape, false, true));
      if (rightLine) rightLine.setAttribute('d', pathD(shape, true, true));
    };

    const setEnvUI = (idx) => {
      const env = ENV[idx];
      if (!env || !heroStage) return;
      heroStage.dataset.environment = env.key;
      envButtons.forEach((btn, i) => btn.setAttribute('aria-pressed', i === idx ? 'true' : 'false'));
      if (envIndex) envIndex.textContent = env.index;
      if (envTitle) envTitle.textContent = env.title;
      if (envCopy) envCopy.textContent = env.copy;
    };

    paintShape(SHAPES.base);

    envButtons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        setEnvUI(i);
        paintShape(ENV[i].shape);
        if (reduce || !hero) return;
        const travel = Math.max(hero.offsetHeight - innerHeight, 1);
        const heroTop = scrollY + hero.getBoundingClientRect().top;
        const envStart = .54;
        const envEnd = .96;
        const target = envStart + (envEnd - envStart) * (i / (ENV.length - 1));
        scrollTo({ top:heroTop + travel * target, behavior:'smooth' });
      });
    });

    if (hero && heroStage && !reduce) {
      let ticking = false;
      const updateHero = () => {
        const r = hero.getBoundingClientRect();
        const travel = Math.max(hero.offsetHeight - innerHeight, 1);
        const p = clamp(-r.top / travel);

        const heroOpacity = 1 - smooth(.10, .19, p);
        const bridgeIn = smooth(.17, .215, p);
        const bridgeOut = 1 - smooth(.25, .295, p);
        const bridgeOpacity = Math.min(bridgeIn, bridgeOut);
        const betweenOpacity = smooth(.29, .37, p);
        const tabsOpacity = smooth(.45, .53, p);
        const compress = smooth(0, .19, p);
        const open = smooth(.22, .42, p);

        heroStage.style.setProperty('--hero-progress', p.toFixed(4));
        heroStage.style.setProperty('--hero-opacity', heroOpacity.toFixed(4));
        heroStage.style.setProperty('--bridge-opacity', bridgeOpacity.toFixed(4));
        heroStage.style.setProperty('--between-opacity', betweenOpacity.toFixed(4));
        heroStage.style.setProperty('--between-clip', ((1 - betweenOpacity) * 50).toFixed(2) + '%');
        heroStage.style.setProperty('--tabs-opacity', tabsOpacity.toFixed(4));
        heroStage.style.setProperty('--hero-compress', compress.toFixed(4));
        heroStage.style.setProperty('--hero-pointer', heroOpacity > .55 ? 'auto' : 'none');
        heroStage.style.setProperty('--between-pointer', betweenOpacity > .55 ? 'auto' : 'none');
        heroStage.style.setProperty('--tabs-pointer', tabsOpacity > .55 ? 'auto' : 'none');
        heroCopyEl?.setAttribute('aria-hidden', heroOpacity > .08 ? 'false' : 'true');
        betweenEl?.setAttribute('aria-hidden', betweenOpacity > .08 ? 'false' : 'true');
        envTabsEl?.setAttribute('aria-hidden', tabsOpacity > .08 ? 'false' : 'true');
        envButtons.forEach(btn => btn.tabIndex = tabsOpacity > .55 ? 0 : -1);

        let shape;
        if (p < .20) {
          shape = interpolateShape(SHAPES.base, SHAPES.compress, smooth(0, .20, p));
          heroStage.dataset.environment = 'base';
        } else if (p < .48) {
          shape = interpolateShape(SHAPES.compress, SHAPES.open, smooth(.20, .48, p));
          heroStage.dataset.environment = 'base';
        } else {
          const ep = clamp((p - .50) / .47);
          const pos = ep * (ENV.length - 1);
          const i = Math.min(ENV.length - 1, Math.floor(pos));
          const j = Math.min(ENV.length - 1, i + 1);
          const t = smooth(0, 1, pos - i);
          shape = interpolateShape(ENV[i].shape, ENV[j].shape, t);
          const nearest = Math.min(ENV.length - 1, Math.round(pos));
          setEnvUI(nearest);
        }
        paintShape(shape);
        ticking = false;
      };
      const request = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateHero);
      };
      updateHero();
      addEventListener('scroll', request, { passive:true });
      addEventListener('resize', request);
    }

    const products = root.querySelector('[data-bts7-products]');
    const panels = [...(products?.querySelectorAll('[data-product-panel]') || [])];
    const markers = [...(products?.querySelectorAll('[data-step-marker]') || [])];
    const thread = products?.querySelector('[data-bts7-thread]');
    const threadNode = products?.querySelector('[data-bts7-thread-node]');
    let threadLength = 0;

    if (!reduce && products && panels.length) {
      products.dataset.motion = 'on';
      if (thread) {
        threadLength = thread.getTotalLength();
        thread.style.strokeDasharray = String(threadLength);
        thread.style.strokeDashoffset = String(threadLength);
      }

      let activeIndex = -1;
      let ticking = false;

      const setActive = (idx) => {
        if (idx === activeIndex) return;
        activeIndex = idx;
        panels.forEach((panel, i) => {
          const active = i === idx;
          panel.classList.toggle('is-active', active);
          panel.setAttribute('aria-hidden', active ? 'false' : 'true');
          if ('inert' in panel) panel.inert = !active;
        });
        markers.forEach((m, i) => m.classList.toggle('is-active', i === idx));
        const sku = getComputedStyle(panels[idx]).getPropertyValue('--sku').trim();
        products.querySelector('.bts7-product-stage')?.style.setProperty('--active-sku', sku || '#59B98A');
      };

      const updateProducts = () => {
        const r = products.getBoundingClientRect();
        const travel = Math.max(products.offsetHeight - innerHeight, 1);
        const p = clamp(-r.top / travel);
        const raw = p * (panels.length - 1);
        const active = Math.min(panels.length - 1, Math.max(0, Math.round(raw)));
        setActive(active);

        panels.forEach((panel, i) => {
          const distance = Math.abs(raw - i);
          const visual = 1 - smooth(.55, .96, distance);
          const copy = 1 - smooth(.28, .50, distance);
          const effect = clamp(1 - distance * 1.25);
          panel.style.opacity = visual > .015 ? '1' : '0';
          panel.style.setProperty('--visual-opacity', visual.toFixed(4));
          panel.style.setProperty('--copy-opacity', copy.toFixed(4));
          panel.style.setProperty('--effect', effect.toFixed(4));
        });

        if (thread && threadLength) {
          const drawn = threadLength * p;
          thread.style.strokeDashoffset = String(threadLength - drawn);
          if (threadNode) {
            const pt = thread.getPointAtLength(clamp(drawn, 0, threadLength));
            threadNode.setAttribute('cx', pt.x.toFixed(2));
            threadNode.setAttribute('cy', pt.y.toFixed(2));
          }
        }
        ticking = false;
      };

      const request = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateProducts);
      };
      setActive(0);
      updateProducts();
      addEventListener('scroll', request, { passive:true });
      addEventListener('resize', request);
    } else if (products) {
      products.dataset.motion = 'off';
      panels.forEach(panel => panel.setAttribute('aria-hidden', 'true'));
    }

    const selected = new Set(['reset','clarity','barrier','defense']);
    const routine = root.querySelector('[data-bts7-routine]');
    const lineup = routine?.querySelector('[data-bts7-lineup]');
    const count = routine?.querySelector('[data-bts7-routine-count]');
    const selectionCopy = routine?.querySelector('[data-bts7-selection-copy]');
    const reviewButton = routine?.querySelector('[data-bts7-review-routine]');
    let time = 'am';

    const availableForTime = () => {
      const baseline = time === 'pm' ? ['reset','clarity','barrier'] : ['reset','clarity','barrier','defense'];
      return baseline.filter(key => selected.has(key));
    };

    const renderSelection = () => {
      const keys = availableForTime();
      root.querySelectorAll('[data-select-product]').forEach(btn => {
        const on = selected.has(btn.dataset.selectProduct);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.innerHTML = on ? 'IN ROUTINE <b>✓</b>' : 'ADD TO ROUTINE <b>+</b>';
      });
      lineup?.querySelectorAll('[data-lineup-step]').forEach(item => {
        const key = item.dataset.lineupStep;
        const timeExcluded = time === 'pm' && key === 'defense';
        item.classList.toggle('is-unselected', !selected.has(key) && !timeExcluded);
      });
      if (count) count.textContent = `${keys.length} STEP${keys.length === 1 ? '' : 'S'} · ${time.toUpperCase()}`;
      if (selectionCopy) selectionCopy.textContent = keys.length === (time === 'pm' ? 3 : 4)
        ? (time === 'pm' ? 'Reset, treat and hydrate selected.' : 'All four essentials selected.')
        : `${keys.length} product${keys.length === 1 ? '' : 's'} selected.`;
      if (reviewButton) reviewButton.innerHTML = `REVIEW ${keys.length}-STEP ROUTINE <span aria-hidden="true">→</span>`;
    };

    root.querySelectorAll('[data-select-product]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.selectProduct;
        if (selected.has(key)) selected.delete(key); else selected.add(key);
        renderSelection();
      });
    });

    routine?.querySelectorAll('[data-routine-time]').forEach(btn => {
      btn.addEventListener('click', () => {
        time = btn.dataset.routineTime;
        routine.dataset.time = time;
        routine.querySelectorAll('[data-routine-time]').forEach(x => x.setAttribute('aria-pressed', x === btn ? 'true' : 'false'));
        renderSelection();
      });
    });

    const sheet = root.querySelector('[data-bts7-sheet]');
    const sheetTitle = sheet?.querySelector('[data-bts7-sheet-title]');
    const sheetItems = sheet?.querySelector('[data-bts7-sheet-items]');
    const closeSheet = () => {
      if (!sheet) return;
      sheet.hidden = true;
      document.documentElement.style.overflow = '';
      reviewButton?.focus();
    };
    const openSheet = () => {
      if (!sheet || !sheetItems) return;
      const keys = availableForTime();
      if (sheetTitle) sheetTitle.textContent = `${time.toUpperCase()} · ${keys.length} STEP${keys.length === 1 ? '' : 'S'}`;
      sheetItems.innerHTML = keys.map((key, i) => {
        const p = PRODUCTS[key];
        return `<div class="bts7-sheet__item"><img src="${p.image}" alt=""><div><strong>${String(i + 1).padStart(2,'0')} · ${p.name}</strong><span>${p.size}</span></div><b>SELECTED</b></div>`;
      }).join('');
      sheet.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      sheet.querySelector('[data-bts7-sheet-close]')?.focus();
    };

    reviewButton?.addEventListener('click', openSheet);
    sheet?.querySelectorAll('[data-bts7-sheet-close]').forEach(btn => btn.addEventListener('click', closeSheet));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sheet && !sheet.hidden) closeSheet();
    });

    renderSelection();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  document.addEventListener('shopify:section:load', () => {
    const root = document.querySelector('[data-bts7]');
    root?.removeAttribute('data-ready');
    init();
  });
})();
