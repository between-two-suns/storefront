(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

  const initMenu = () => {
    document.querySelectorAll('.bts-menu').forEach((details) => {
      details.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => details.removeAttribute('open'));
      });

      const closeLabel = details.querySelector('.bts-menu__close');
      if (closeLabel) {
        closeLabel.addEventListener('click', () => details.removeAttribute('open'));
      }
    });
  };

  const initSignatureHero = (root) => {
    const shell = root.querySelector('[data-bts-hero-shell]');
    const stage = shell?.querySelector('.bts-v4-hero-stage');
    if (!shell || !stage || reduceMotion) return;

    let ticking = false;

    const update = () => {
      const rect = shell.getBoundingClientRect();
      const travel = Math.max(shell.offsetHeight - window.innerHeight, 1);
      const p = clamp(-rect.top / travel);

      const compress = clamp(p / .35);
      const open = clamp((p - .42) / .58);
      const heroOpacity = 1 - clamp((p - .18) / .28);
      const betweenOpacity = clamp((p - .42) / .26);

      stage.style.setProperty('--bts-progress', p.toFixed(4));
      stage.style.setProperty('--bts-compress', compress.toFixed(4));
      stage.style.setProperty('--bts-open', open.toFixed(4));
      stage.style.setProperty('--bts-hero-opacity', heroOpacity.toFixed(4));
      stage.style.setProperty('--bts-between-opacity', betweenOpacity.toFixed(4));
      stage.style.setProperty('--bts-hero-pointer', heroOpacity > .5 ? 'auto' : 'none');
      stage.style.setProperty('--bts-between-pointer', betweenOpacity > .55 ? 'auto' : 'none');

      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  };

  const initEnvironment = (root) => {
    const stage = root.querySelector('.bts-v4-hero-stage');
    if (!stage) return;

    const buttons = [...stage.querySelectorAll('[data-env-button]')];
    const index = stage.querySelector('[data-env-index]');
    const title = stage.querySelector('[data-env-title]');
    const copy = stage.querySelector('[data-env-copy]');

    const setState = (button) => {
      stage.dataset.env = button.dataset.envButton;

      buttons.forEach((item) => {
        item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
      });

      if (index) index.textContent = button.dataset.index;
      if (title) title.textContent = button.dataset.title;
      if (copy) copy.textContent = button.dataset.copy;
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => setState(button));
    });
  };

  const initRoutine = (root) => {
    const routine = root.querySelector('[data-bts-routine]');
    if (!routine) return;

    const timeButtons = [...routine.querySelectorAll('[data-time-button]')];
    const count = routine.querySelector('[data-routine-count]');
    const addButton = routine.querySelector('[data-bts-add-routine]');

    const setTime = (time) => {
      routine.dataset.time = time;

      timeButtons.forEach((button) => {
        button.setAttribute('aria-pressed', button.dataset.timeButton === time ? 'true' : 'false');
      });

      if (count) {
        count.textContent = time === 'pm' ? '3 STEPS · PM' : '4 STEPS · AM';
      }
    };

    timeButtons.forEach((button) => {
      button.addEventListener('click', () => setTime(button.dataset.timeButton));
    });

    if (!addButton) return;

    addButton.addEventListener('click', async () => {
      if (addButton.disabled) return;

      const time = routine.dataset.time || 'am';
      const items = [...routine.querySelectorAll('[data-routine-item]')]
        .filter((item) => time === 'am' || item.dataset.time.includes('pm'))
        .map((item) => Number(item.dataset.variantId))
        .filter(Boolean)
        .map((id) => ({ id, quantity: 1 }));

      const expected = time === 'am' ? 4 : 3;

      if (items.length !== expected) {
        addButton.textContent = 'ROUTINE NOT READY';
        return;
      }

      const originalText = addButton.innerHTML;
      addButton.disabled = true;
      addButton.textContent = 'ADDING ROUTINE…';

      try {
        const rootPath = window.Shopify?.routes?.root || '/';
        const response = await fetch(`${rootPath}cart/add.js`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ items })
        });

        if (!response.ok) throw new Error(`Cart add failed: ${response.status}`);

        addButton.textContent = 'ROUTINE ADDED ✓';
        window.setTimeout(() => window.location.assign(`${rootPath}cart`), 300);
      } catch (error) {
        console.error('[BTS] Could not add routine', error);
        addButton.disabled = false;
        addButton.innerHTML = originalText;
      }
    });
  };

  const initExperience = () => {
    document.querySelectorAll('[data-bts-experience]').forEach((root) => {
      initSignatureHero(root);
      initEnvironment(root);
      initRoutine(root);
    });
  };

  initMenu();
  initExperience();

  document.addEventListener('shopify:section:load', () => {
    initMenu();
    initExperience();
  });
})();
