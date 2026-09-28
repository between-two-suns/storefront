(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

  function init() {
    const root = document.querySelector('[data-bts6]');
    if (!root || root.dataset.ready === 'true') return;
    root.dataset.ready = 'true';

    /* Page / header ------------------------------------------------------- */
    const header = document.querySelector('[data-bts-header]');
    const progress = root.querySelector('[data-bts6-page-progress]');

    const updatePage = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = clamp(window.scrollY / max);
      if (progress) progress.style.transform = `scaleX(${p})`;
      header?.classList.toggle('is-scrolled', window.scrollY > 20);
    };

    updatePage();
    window.addEventListener('scroll', updatePage, { passive: true });
    window.addEventListener('resize', updatePage);

    /* Signature aperture / environment ---------------------------------- */
    const hero = root.querySelector('[data-bts6-hero]');
    const heroStage = hero?.querySelector('.bts6-hero-stage');
    const heroLayer = hero?.querySelector('[data-bts6-hero-layer]');
    const betweenLayer = hero?.querySelector('[data-bts6-between-layer]');
    const envButtons = [...(hero?.querySelectorAll('[data-env]') || [])];
    const envIndex = hero?.querySelector('[data-bts6-env-index]');
    const envTitle = hero?.querySelector('[data-bts6-env-title]');
    const envCopy = hero?.querySelector('[data-bts6-env-copy]');

    const setEnv = (button) => {
      if (!heroStage || !button) return;
      heroStage.dataset.environment = button.dataset.env;

      envButtons.forEach((item) => {
        item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
      });

      if (envIndex) envIndex.textContent = button.dataset.index;
      if (envTitle) envTitle.textContent = button.dataset.title;
      if (envCopy) envCopy.textContent = button.dataset.copy;
    };

    envButtons.forEach((button, buttonIndex) => {
      button.addEventListener('click', () => {
        setEnv(button);
        if (reduceMotion || !hero) return;

        const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
        const top = window.scrollY + hero.getBoundingClientRect().top;
        const target = 0.48 + ((buttonIndex + 0.45) / envButtons.length) * 0.50;

        window.scrollTo({
          top: top + travel * target,
          behavior: 'smooth'
        });
      });
    });

    if (hero && heroStage && !reduceMotion) {
      let ticking = false;

      const updateHero = () => {
        const rect = hero.getBoundingClientRect();
        const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
        const p = clamp(-rect.top / travel);

        const compress = clamp(p / 0.18);
        const open = clamp((p - 0.22) / 0.20);
        const heroOpacity = 1 - clamp((p - 0.09) / 0.10);
        const bridgeIn = clamp((p - 0.17) / 0.055);
        const bridgeOut = 1 - clamp((p - 0.26) / 0.055);
        const bridgeOpacity = Math.min(bridgeIn, bridgeOut);
        const betweenOpacity = clamp((p - 0.30) / 0.075);
        const tabsOpacity = clamp((p - 0.42) / 0.09);

        heroStage.style.setProperty('--hero-progress', p.toFixed(4));
        heroStage.style.setProperty('--hero-compress', compress.toFixed(4));
        heroStage.style.setProperty('--hero-open', open.toFixed(4));
        heroStage.style.setProperty('--hero-opacity', heroOpacity.toFixed(4));
        heroStage.style.setProperty('--bridge-opacity', bridgeOpacity.toFixed(4));
        heroStage.style.setProperty('--between-opacity', betweenOpacity.toFixed(4));
        heroStage.style.setProperty('--between-clip', ((1 - betweenOpacity) * 50).toFixed(2) + '%');
        heroStage.style.setProperty('--env-tabs-opacity', tabsOpacity.toFixed(4));
        heroStage.style.setProperty('--hero-pointer', heroOpacity > 0.55 ? 'auto' : 'none');
        heroStage.style.setProperty('--between-pointer', betweenOpacity > 0.55 ? 'auto' : 'none');
        heroStage.style.setProperty('--env-tabs-pointer', tabsOpacity > 0.55 ? 'auto' : 'none');

        const leftX = compress * 13 - open * 24;
        const rightX = -compress * 13 + open * 24;
        heroStage.style.setProperty('--aperture-left-x', leftX.toFixed(2) + 'px');
        heroStage.style.setProperty('--aperture-right-x', rightX.toFixed(2) + 'px');

        if (heroOpacity < 0.15) heroLayer?.setAttribute('aria-hidden', 'true');
        else heroLayer?.removeAttribute('aria-hidden');

        if (betweenOpacity > 0.2) betweenLayer?.removeAttribute('aria-hidden');
        else betweenLayer?.setAttribute('aria-hidden', 'true');

        if (p < 0.48) {
          heroStage.dataset.environment = 'base';
        } else if (envButtons.length) {
          const envProgress = clamp((p - 0.48) / 0.52);
          const idx = Math.min(envButtons.length - 1, Math.floor(envProgress * envButtons.length));
          setEnv(envButtons[idx]);
        }

        ticking = false;
      };

      const requestUpdate = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateHero);
      };

      updateHero();
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate);

      if (window.location.hash === '#environment') {
        window.setTimeout(() => {
          const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
          const top = window.scrollY + hero.getBoundingClientRect().top;
          window.scrollTo({ top: top + travel * 0.34, behavior: 'auto' });
        }, 80);
      }
    } else {
      heroLayer?.removeAttribute('aria-hidden');
      betweenLayer?.removeAttribute('aria-hidden');
    }

    /* Product theatre ---------------------------------------------------- */
    const productJourney = root.querySelector('[data-bts6-products]');
    const panels = [...(productJourney?.querySelectorAll('[data-product-panel]') || [])];
    const markers = [...(productJourney?.querySelectorAll('[data-step-marker]') || [])];

    if (productJourney && panels.length) {
      const stage = productJourney.querySelector('.bts6-product-stage');
      const threadPath = productJourney.querySelector('[data-bts6-thread-path]');
      const threadNode = productJourney.querySelector('[data-bts6-thread-node]');
      let activeIndex = -1;
      let ticking = false;
      let threadLength = 0;

      if (threadPath) {
        threadLength = threadPath.getTotalLength();
        threadPath.style.strokeDasharray = String(threadLength);
        threadPath.style.strokeDashoffset = String(threadLength);
      }

      const activate = (idx) => {
        if (idx === activeIndex) return;
        activeIndex = idx;

        panels.forEach((panel, i) => {
          const active = i === idx;
          panel.classList.toggle('is-active', active);
          panel.style.pointerEvents = active ? 'auto' : 'none';
          panel.style.setProperty('--presence', active ? '1' : '0');

          if ('inert' in panel) panel.inert = !active;
          panel.setAttribute('aria-hidden', active ? 'false' : 'true');
        });

        markers.forEach((marker, i) => marker.classList.toggle('is-active', i === idx));

        const sku = getComputedStyle(panels[idx]).getPropertyValue('--sku').trim();
        stage?.style.setProperty('--active-sku', sku || '#4CB383');
      };

      const updateProducts = () => {
        const rect = productJourney.getBoundingClientRect();
        const travel = Math.max(productJourney.offsetHeight - window.innerHeight, 1);
        const p = clamp(-rect.top / travel);
        const raw = p * (panels.length - 1);
        const idx = Math.min(panels.length - 1, Math.max(0, Math.round(raw)));

        activate(idx);

        if (threadPath && threadLength) {
          const drawn = threadLength * p;
          threadPath.style.strokeDashoffset = String(threadLength - drawn);

          if (threadNode) {
            const point = threadPath.getPointAtLength(Math.max(0, Math.min(threadLength, drawn)));
            threadNode.setAttribute('cx', point.x.toFixed(2));
            threadNode.setAttribute('cy', point.y.toFixed(2));
            const colors = ['#59B98A', '#69B6DF', '#B392CB', '#EE8B68'];
            threadNode.style.fill = colors[idx] || colors[0];
          }
        }

        ticking = false;
      };

      const requestUpdate = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateProducts);
      };

      if (reduceMotion) {
        panels.forEach((panel) => {
          panel.classList.add('is-active');
          panel.style.pointerEvents = 'auto';
          panel.removeAttribute('aria-hidden');
          if ('inert' in panel) panel.inert = false;
        });
      } else {
        activate(0);
        updateProducts();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
      }
    }

    /* Routine selection / AM-PM ----------------------------------------- */
    const routine = root.querySelector('[data-bts6-routine]');
    const selection = {
      reset: true,
      clarity: true,
      barrier: true,
      defense: true
    };

    if (routine) {
      const timeButtons = [...routine.querySelectorAll('[data-routine-time]')];
      const toggleButtons = [...root.querySelectorAll('[data-routine-toggle]')];
      const lineupItems = [...routine.querySelectorAll('[data-lineup-step]')];
      const pathDots = [...routine.querySelectorAll('.bts6-routine-path span')];
      const count = routine.querySelector('[data-routine-count]');
      const reviewButton = routine.querySelector('[data-routine-review]');
      const drawer = root.querySelector('[data-routine-drawer]');
      const drawerTitle = drawer?.querySelector('[data-routine-drawer-title]');
      const drawerItems = [...(drawer?.querySelectorAll('[data-drawer-item]') || [])];
      const closeButtons = [...(drawer?.querySelectorAll('[data-routine-close]') || [])];
      let lastDrawerTrigger = null;

      const keys = ['reset', 'clarity', 'barrier', 'defense'];

      const activeKeys = () => {
        const time = routine.dataset.time || 'am';
        return keys.filter((key) => selection[key] && !(time === 'pm' && key === 'defense'));
      };

      const updateRoutine = () => {
        const time = routine.dataset.time || 'am';
        const active = activeKeys();
        const total = active.length;

        toggleButtons.forEach((button) => {
          const key = button.dataset.routineToggle;
          const selected = Boolean(selection[key]);
          button.setAttribute('aria-pressed', selected ? 'true' : 'false');
          button.innerHTML = selected ? 'IN ROUTINE <b>✓</b>' : 'ADD TO ROUTINE <b>+</b>';
        });

        lineupItems.forEach((item) => {
          const key = item.dataset.lineupStep;
          const visibleForTime = !(time === 'pm' && key === 'defense');
          item.classList.toggle('is-excluded', !selection[key] && visibleForTime);
        });

        pathDots.forEach((dot, index) => {
          const key = keys[index];
          dot.classList.toggle('is-excluded', !selection[key]);
        });

        if (count) count.textContent = `${total} ${total === 1 ? 'STEP' : 'STEPS'} · ${time.toUpperCase()}`;

        if (reviewButton) {
          reviewButton.disabled = total === 0;
          reviewButton.innerHTML = total
            ? `REVIEW ${total}-PRODUCT ROUTINE <span aria-hidden="true">→</span>`
            : 'CHOOSE PRODUCTS';
        }

        drawerItems.forEach((item) => {
          const key = item.dataset.drawerItem;
          const show = selection[key] && !(time === 'pm' && key === 'defense');
          item.hidden = !show;
        });

        if (drawerTitle) drawerTitle.textContent = `${total} ${total === 1 ? 'PRODUCT' : 'PRODUCTS'} · ${time.toUpperCase()}`;
      };

      timeButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const time = button.dataset.routineTime;
          routine.dataset.time = time;
          timeButtons.forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
          updateRoutine();
        });
      });

      toggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const key = button.dataset.routineToggle;
          selection[key] = !selection[key];
          updateRoutine();
        });
      });

      const openDrawer = (trigger) => {
        if (!drawer || !activeKeys().length) return;
        lastDrawerTrigger = trigger;
        drawer.hidden = false;
        document.documentElement.style.overflow = 'hidden';
        drawer.querySelector('[data-routine-close]')?.focus();
      };

      const closeDrawer = () => {
        if (!drawer || drawer.hidden) return;
        drawer.hidden = true;
        document.documentElement.style.overflow = '';
        lastDrawerTrigger?.focus();
      };

      reviewButton?.addEventListener('click', () => openDrawer(reviewButton));
      closeButtons.forEach((button) => button.addEventListener('click', closeDrawer));

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && drawer && !drawer.hidden) closeDrawer();
      });

      updateRoutine();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', () => {
    document.querySelector('[data-bts6]')?.removeAttribute('data-ready');
    init();
  });
})();