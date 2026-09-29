/* BETWEEN TWO SUNS — Homepage v11 "SWATCH". Framework-free. Local prototype: checkout disabled. */
(() => {
  const root = document.querySelector('[data-b11]');
  if (!root) return;

  const $ = (s, c = root) => c.querySelector(s);
  const $$ = (s, c = root) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  /* ---------- Pricing: single source. Scenario B is the working prototype; A is ready to switch. ---------- */
  const PRICING = {
    A: { reset: 349, clarity: 449, barrier: 399, defense: 449 },
    B: { reset: 399, clarity: 499, barrier: 449, defense: 499 }
  };
  const ROUTINE_DISCOUNT = 0.10;
  const KEYS = ['reset', 'clarity', 'barrier', 'defense'];
  const PRICE = PRICING[root.dataset.scenario] || PRICING.B;
  const LIST = KEYS.reduce((s, k) => s + PRICE[k], 0);          // B: 1846
  const ROUTINE = Math.floor(LIST * (1 - ROUTINE_DISCOUNT));     // B: 1661
  const SAVE = LIST - ROUTINE;                                   // B: 185

  /* ---------- Product data (FINAL_LABEL_SOURCE_OF_TRUTH) ---------- */
  const P = {
    reset: { name: 'Daily Reset Cleanser', short: 'Reset', size: '200 mL', actives: 'Zinc PCA · Centella · Panthenol',
      inci: 'Aqua, Sodium Lauryl Sulfosuccinate, Cocamidopropyl Betaine, Coco-Glucoside, Glycerin, Lauryl Glucoside, Propylene Glycol, PEG-120 Methyl Glucose Dioleate, Phenoxyethanol, PEG-7 Glyceryl Cocoate, Panthenol, Poloxamer 184, Polyquaternium-10, Aloe Barbadensis Leaf Extract, Centella Asiatica Extract, Sodium PCA, Zinc PCA, Ethylhexylglycerin, EDTA, Allantoin, Glycyrrhiza Glabra Root Extract, Citric Acid.',
      pills: ['Non-stripping', 'Soap-free', 'Non-comedogenic'] },
    clarity: { name: 'Clarity Serum', short: 'Clarity', size: '30 mL', actives: 'Niacinamide · Tranexamic Acid · Hyaluronic Acid',
      inci: 'Aqua, Niacinamide, Glycerin, Tranexamic Acid, Propylene Glycol, Phenoxyethanol, Panthenol, Xylitylglucoside, Anhydroxylitol, Xylitol, Sodium Hyaluronate, Ammonium Acryloyldimethyltaurate/VP Copolymer, Ethylhexylglycerin, EDTA, Allantoin.',
      pills: [] },
    barrier: { name: 'Daily Barrier Moisturizing Cream', short: 'Barrier', size: '50 g', actives: 'Ceramides · Niacinamide · Zinc PCA',
      inci: 'Aqua, Glycerin, Niacinamide, Propylene Glycol, Caprylic/Capric Triglyceride, Glyceryl Stearate, PEG-100 Stearate, Cetearyl Alcohol, Isohexadecane, Squalane, Dimethicone, Panthenol, Phenoxyethanol, Ammonium Acryloyldimethyltaurate/VP Copolymer, Zinc PCA, Sodium Hyaluronate, Sodium PCA, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Sodium Lauroyl Lactylate, Ethylhexylglycerin, Cholesterol, Carbomer, Disodium EDTA, Xanthan Gum.',
      pills: ['Oil-control', 'Non-comedogenic', 'Fragrance-free'] },
    defense: { name: 'Daily Defense Sunscreen SPF 50', short: 'Defense', size: '50 g', actives: 'UVA + UVB filters · Niacinamide · Bisabolol',
      inci: 'Aqua, C12-15 Alkyl Benzoate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Ethylhexyl Methoxycinnamate, Ethylhexyl Salicylate, Bis-PEG/PPG-16/16 PEG/PPG-16/16 Dimethicone, Propylene Glycol, Glycerin, Methyl Methacrylate Crosspolymer, Niacinamide, Cetearyl Alcohol, Ammonium Acryloyldimethyltaurate/VP Copolymer, Caprylic/Capric Triglyceride, Caprylyl Methicone, Dimethicone, Phenoxyethanol, Panthenol, Bisabolol, Aloe Barbadensis Leaf Extract, Tocopheryl Acetate, Triethanolamine, Ethylhexylglycerin, EDTA.',
      pills: ['Hydrating', 'No white cast', 'Non-greasy'] }
  };

  /* ---------- Copy. Arabic is authored Egyptian Arabic, not a literal translation. ---------- */
  const T = {
    en: {
      skip: 'Skip to content', navRoutine: 'Routine', navTexture: 'Textures', navWhy: 'Formulas', bag: 'Bag',
      tapHint: 'Tap the pack to swatch', add: 'Add to bag', added: 'Added', heroRoutine: 'Or the full routine',
      step: 'Step', role_reset: 'Cleanse', role_clarity: 'Treat', role_barrier: 'Moisturise', role_defense: 'Protect',
      line_reset: 'Gel cleanser that removes excess oil without leaving skin tight.',
      line_clarity: 'Light serum for uneven-looking tone and dark spots, with hydration built in.',
      line_barrier: 'Lightweight barrier cream with Ceramides, Niacinamide and Zinc PCA.',
      line_defense: 'Broad-spectrum SPF 50. Lightweight, fast-absorbing, no white cast.',
      tex_reset: 'Clear gel', tex_clarity: 'Fluid serum', tex_barrier: 'Soft cream', tex_defense: 'Light SPF',
      routineEyebrow: 'AM · 4 steps / PM · 3 steps', routineTitle: 'The full routine.',
      am: 'Morning', pm: 'Night', pmSkip: 'Mornings only',
      amNote: 'Morning: all four, in order. Cleanse, treat, moisturise, protect.',
      pmNote: 'Night: three steps. Defense sits this one out.',
      insteadOf: 'instead of', save: 'Save', addRoutine: 'Add the full routine',
      routineFine: 'Four full-size products. The routine price applies automatically when all four are in your bag.',
      texEyebrow: 'Texture', texTitle: 'Swatch it before you buy it.',
      finishEyebrow: 'The finish', finishTitle: 'Skin that looks like skin. Just fresher.',
      finishBody: 'Light layers that sink in, so nothing sits on top. What you see after the full routine is your skin — clean, comfortable, with no white cast from the SPF.',
      finish_reset: 'Fresh, not tight', finish_clarity: 'Hydrated', finish_barrier: 'Light, never heavy', finish_defense: 'No white cast',
      finishLink: 'Meet Defense SPF 50',
      whyEyebrow: 'Why it works', whyTitle: 'Formulated for skin that gets oily fast.',
      whyBody: 'Oil control, hydration and barrier support together, in textures light enough for daily wear.',
      why_reset: 'Clears excess oil and buildup without stripping — soap-free, non-comedogenic.',
      why_clarity: 'Helps even skin tone and reduce the look of dark spots while keeping oil in check.',
      why_barrier: 'Hydrates without heaviness and supports the skin barrier. Fragrance-free.',
      why_defense: 'Broad-spectrum SPF 50 in a lightweight, non-greasy texture with no white cast.',
      revEyebrow: 'Reviews', revTitle: 'In their words.', revNote: 'Reviews open at launch. The cards below are layout samples, not customer reviews.',
      rev1: 'Sample text: how the cleanser feels after the first wash goes here.',
      rev2: 'Sample text: a note on the serum texture and how it layers.',
      rev3: 'Sample text: a note on the cream finish during a long day.',
      sampleName: 'Sample reviewer',
      comEyebrow: 'On the shelf', comTitle: 'Mirror. Bag. Desk. Repeat.',
      spot_mirror: 'Mirror', spot_bag: 'Bag', spot_desk: 'Desk', spot_gym: 'After the gym', spot_vanity: 'Vanity',
      trustTitle: 'Buying from us',
      trust_cod: 'Cash on delivery', trust_cod_d: 'Pay when your order arrives.',
      trust_delivery: 'Delivery across Egypt', trust_delivery_d: 'Timing and fees shown at checkout.',
      trust_returns: 'Returns', trust_returns_d: 'Clear, simple return policy — details before you buy.',
      trust_whatsapp: 'WhatsApp support', trust_whatsapp_d: 'Real people, for orders and routine questions.',
      capTitle: 'First to know when we launch.', capBody: 'Launch date, restocks and new textures. Nothing else.',
      notify: 'Notify me', formOk: 'Prototype — nothing was sent. You’re on the list at launch.', formBad: 'Please check and try again.',
      tagline: 'fresh skin. always.', fShop: 'Shop', fRoutine: 'The full routine', fHelp: 'Help', fShipping: 'Delivery',
      fPayment: 'Payment & cash on delivery', fReturns: 'Returns', fPatch: 'Patch-test guide', fWhatsApp: 'WhatsApp us',
      fBrand: 'Between Two Suns', fAbout: 'About', fIngredients: 'Ingredient glossary', fPrivacy: 'Privacy', fTerms: 'Terms',
      yourBag: 'Your bag', empty: 'Your bag is empty.', emptyCta: 'Start with the full routine',
      remove: 'Remove', subtotal: 'Subtotal', routineSaving: 'Routine saving', total: 'Total',
      checkout: 'Checkout — opens at launch', checkoutNote: 'Prototype: checkout is disabled. Delivery and payment are confirmed at checkout.',
      completeN: n => `Add the missing ${n} and save`, completeHint: 'Complete the routine to unlock the routine price.',
      routineOn: 'Routine price applied', qty: 'Qty', close: 'Close',
      feels: 'Feels like', inside: 'Key ingredients', fullInci: 'Full ingredients (INCI)', addToBag: 'Add to bag',
      langLabel: 'التبديل إلى العربية', addedToast: n => `${n} added to your bag`
    },
    ar: {
      skip: 'روحي للمحتوى', navRoutine: 'الروتين', navTexture: 'القوام', navWhy: 'التركيبات', bag: 'الشنطة',
      tapHint: 'دوسي على العبوة وجرّبي القوام', add: 'ضيفيه للشنطة', added: 'اتضاف', heroRoutine: 'أو الروتين كامل',
      step: 'خطوة', role_reset: 'تنضيف', role_clarity: 'علاج', role_barrier: 'ترطيب', role_defense: 'حماية',
      line_reset: 'جل بينضّف الدهون الزائدة من غير ما يسيب البشرة مشدودة.',
      line_clarity: 'سيروم خفيف لعدم توحّد مظهر اللون والبقع الداكنة، مع ترطيب جوه التركيبة.',
      line_barrier: 'كريم خفيف لدعم حاجز البشرة بسيراميدات ونياسيناميد وZinc PCA.',
      line_defense: 'حماية SPF 50 واسعة الطيف، خفيفة وسريعة الامتصاص ومن غير أثر أبيض.',
      tex_reset: 'جل شفاف', tex_clarity: 'سيروم خفيف', tex_barrier: 'كريم ناعم', tex_defense: 'واقي خفيف',
      routineEyebrow: 'الصبح · 4 خطوات / بالليل · 3 خطوات', routineTitle: 'الروتين كامل.',
      am: 'الصبح', pm: 'بالليل', pmSkip: 'للصبح بس',
      amNote: 'الصبح: الأربعة بالترتيب — تنضيف، علاج، ترطيب، حماية.',
      pmNote: 'بالليل: تلات خطوات بس، ومن غير واقي الشمس.',
      insteadOf: 'بدل', save: 'وفّري', addRoutine: 'ضيفي الروتين كامل',
      routineFine: 'أربع منتجات بالحجم الكامل. سعر الروتين بيتطبق لوحده أول ما الأربعة يبقوا في الشنطة.',
      texEyebrow: 'القوام', texTitle: 'جرّبي القوام\nقبل ما تشتري.',
      finishEyebrow: 'النتيجة على البشرة', finishTitle: 'بشرتك زي ما هي.\nبس أفرش.',
      finishBody: 'طبقات خفيفة بتتشرب، فمفيش حاجة قاعدة على الوش. اللي بتشوفيه بعد الروتين هو بشرتك: نضيفة، مرتاحة، ومن غير أثر أبيض من الواقي.',
      finish_reset: 'فريش من غير شد', finish_clarity: 'مترطبة', finish_barrier: 'خفيف مش تقيل', finish_defense: 'من غير أثر أبيض',
      finishLink: 'اتعرفي على Defense SPF 50',
      whyEyebrow: 'بيشتغل إزاي', whyTitle: 'متركّب لبشرة\nبتلمع بسرعة.',
      whyBody: 'توازن للدهون وترطيب ودعم لحاجز البشرة مع بعض، في قوام خفيف للاستخدام اليومي.',
      why_reset: 'بيشيل الزيوت الزيادة والتراكمات من غير ما ينشّف — من غير صابون ومش بيسد المسام.',
      why_clarity: 'بيساعد يوحّد لون البشرة ويخفف شكل البقع الغامقة، وفي نفس الوقت يظبط الزيوت.',
      why_barrier: 'بيرطّب من غير تقل وبيدعم حاجز البشرة. من غير عطر.',
      why_defense: 'حماية واسعة SPF 50 في قوام خفيف مش دهني، ومن غير أثر أبيض.',
      revEyebrow: 'الريفيوهات', revTitle: 'بكلامهم هم.', revNote: 'الريفيوهات هتفتح مع الإطلاق. الكروت اللي تحت نماذج للتصميم، مش آراء عملاء.',
      rev1: 'نص تجريبي: إحساس الغسول بعد أول غسلة هيبقى هنا.',
      rev2: 'نص تجريبي: رأي عن قوام السيروم وإزاي بيتحط تحت الكريم.',
      rev3: 'نص تجريبي: رأي عن ملمس الكريم في يوم طويل.',
      sampleName: 'اسم تجريبي',
      comEyebrow: 'على الرف', comTitle: 'المراية. الشنطة. المكتب.\nوتاني.',
      spot_mirror: 'المراية', spot_bag: 'الشنطة', spot_desk: 'المكتب', spot_gym: 'بعد الجيم', spot_vanity: 'التسريحة',
      trustTitle: 'الشراء مننا',
      trust_cod: 'الدفع عند الاستلام', trust_cod_d: 'ادفعي لما الأوردر يوصلك.',
      trust_delivery: 'توصيل لكل مصر', trust_delivery_d: 'المواعيد والمصاريف بتظهر وقت الدفع.',
      trust_returns: 'الاسترجاع', trust_returns_d: 'سياسة استرجاع واضحة وسهلة — التفاصيل قبل ما تشتري.',
      trust_whatsapp: 'دعم على واتساب', trust_whatsapp_d: 'ناس حقيقية بترد على أسئلة الأوردر والروتين.',
      capTitle: 'اعرفي أول واحدة\nلما نطلق.', capBody: 'ميعاد الإطلاق، رجوع المنتجات، وقوامات جديدة. بس كده.',
      notify: 'بلّغوني', formOk: 'نسخة تجريبية — مفيش حاجة اتبعتت. هنبلغك مع الإطلاق.', formBad: 'راجعي البيانات وجربي تاني.',
      tagline: 'fresh skin. always.', fShop: 'تسوّقي', fRoutine: 'الروتين الكامل', fHelp: 'مساعدة', fShipping: 'التوصيل',
      fPayment: 'الدفع والدفع عند الاستلام', fReturns: 'الاسترجاع', fPatch: 'إزاي تعملي اختبار حساسية', fWhatsApp: 'كلّمينا واتساب',
      fBrand: 'Between Two Suns', fAbout: 'عن البراند', fIngredients: 'دليل المكونات', fPrivacy: 'الخصوصية', fTerms: 'الشروط',
      yourBag: 'شنطتك', empty: 'شنطتك فاضية.', emptyCta: 'ابدئي بالروتين الكامل',
      remove: 'شيلي', subtotal: 'المجموع', routineSaving: 'توفير الروتين', total: 'الإجمالي',
      checkout: 'الدفع — يفتح مع الإطلاق', checkoutNote: 'نسخة تجريبية: الدفع مقفول. التوصيل وطريقة الدفع بيتأكدوا وقت الدفع.',
      completeN: n => `ضيفي الـ${n} الناقصين ووفّري`, completeHint: 'كمّلي الروتين عشان سعر الروتين يتطبق.',
      routineOn: 'سعر الروتين اتطبق', qty: 'العدد', close: 'قفل',
      feels: 'إحساسه', inside: 'أهم المكونات', fullInci: 'المكونات كاملة (INCI)', addToBag: 'ضيفيه للشنطة',
      langLabel: 'Switch to English', addedToast: n => `${n} اتضاف للشنطة`
    }
  };
  const AR_COUNT = { 1: 'واحد', 2: 'اتنين', 3: 'تلاتة' };

  let lang = store.get('bts11-lang', 'en') === 'ar' ? 'ar' : 'en';
  const t = k => (T[lang][k] ?? T.en[k] ?? '');
  const money = n => {
    const s = n.toLocaleString('en-US');           // Western digits in both languages
    return lang === 'ar' ? `${s} ج.م` : `EGP ${s}`;
  };
  const bdi = n => `<bdi>${money(n)}</bdi>`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Internal markers: ?founder=1 hides them for screenshots ---------- */
  if (/[?&]founder=1\b/.test(location.search)) root.classList.add('is-founder');

  /* ---------- Language ---------- */
  function applyLang() {
    root.dataset.lang = lang;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-t]').forEach(el => {
      const v = t(el.dataset.t);
      if (typeof v !== 'string') return;
      if (v.includes('\n')) { el.innerHTML = v.split('\n').map(esc).join('<br>'); } else { el.textContent = v; }
    });
    $$('[data-b11-lang]').forEach(b => { b.setAttribute('aria-label', t('langLabel')); b.textContent = lang === 'ar' ? 'EN' : 'عربي'; });
    const timeSmalls = $$('[data-b11-time] small');
    if (timeSmalls[0]) timeSmalls[0].textContent = lang === 'ar' ? 'صباحًا · 4' : 'AM · 4';
    if (timeSmalls[1]) timeSmalls[1].textContent = lang === 'ar' ? 'مساءً · 3' : 'PM · 3';
    $$('[data-b11-actives]').forEach(el => { el.textContent = P[el.dataset.b11Actives].actives; });
    renderPrices();
    setActive(active, true);
    renderRoutineNote();
    renderCart();
    setChannel(channel);
  }
  function renderPrices() {
    const map = { routine: ROUTINE, list: LIST, save: SAVE, ...PRICE };
    $$('[data-price]').forEach(el => { el.textContent = money(map[el.dataset.price]); });
  }
  $$('[data-b11-lang]').forEach(b => b.addEventListener('click', () => {
    lang = lang === 'en' ? 'ar' : 'en';
    store.set('bts11-lang', lang);
    closeSwatch();
    applyLang();
    goTo(active, false);   // keep the same SKU in view after direction flips
  }));

  /* ---------- Hero: Swatch Rail ---------- */
  const rail = $('[data-b11-rail]');
  const slides = $$('.b11-slide', rail);
  let active = 0;

  function setActive(i, force) {
    if (i === active && !force) return;
    active = i;
    const k = KEYS[i];
    root.dataset.active = k;
    $('[data-b11-h="role"]').textContent = `${t('step')} 0${i + 1} · ${t('role_' + k)}`;
    $('[data-b11-h="name"]').textContent = P[k].name;
    $('[data-b11-h="line"]').textContent = t('line_' + k);
    $('[data-b11-h="price"]').textContent = money(PRICE[k]);
    $$('[data-b11-goto]').forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
    slides.forEach((s, j) => { const b = s.querySelector('[data-b11-swatch]'); b.tabIndex = j === i ? 0 : -1; s.setAttribute('aria-hidden', String(j !== i)); });
  }
  function goTo(i, smooth = true) {
    const dir = root.dir === 'rtl' ? -1 : 1;
    rail.scrollTo({ left: dir * i * rail.clientWidth, behavior: smooth && !reduced.matches ? 'smooth' : 'auto' });
    setActive(i);
  }
  let rafId = 0;
  rail.addEventListener('scroll', () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const i = Math.round(Math.abs(rail.scrollLeft) / rail.clientWidth);
      if (i !== active && slides[i]) { closeSwatch(); setActive(i); }
    });
  }, { passive: true });
  $$('[data-b11-goto]').forEach(b => b.addEventListener('click', () => { closeSwatch(); goTo(+b.dataset.b11Goto); }));
  rail.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const fwd = (e.key === 'ArrowRight') !== (root.dir === 'rtl');
    goTo(Math.max(0, Math.min(3, active + (fwd ? 1 : -1))));
  });
  addEventListener('resize', () => goTo(active, false), { passive: true });

  /* ---------- Drag-to-Swatch ----------
     Today: tap toggles a static swatch (CSS stand-in surface). When T1 texture media exists, call
     BTS11.swatch.register('reset', { src: '…mp4|webp-sprite', poster: '…T2.jpg' }). Registered slides get
     vertical drag (touch-action: pan-x on the pack only) that scrubs the media 1:1 via --pull; side swipe
     still changes SKU. Media is lazy-loaded after first paint, never on the LCP path. */
  const swatch = {
    media: {},
    register(key, m) { this.media[key] = m; const s = slides[KEYS.indexOf(key)]; if (s) { s.dataset.textureSrc = m.src || ''; s.classList.add('has-drag'); } },
    has(key) { return !!this.media[key]; }
  };
  function openSwatch(i) { slides[i].classList.add('is-swatched'); slides[i].style.setProperty('--pull', 1); root.classList.add('is-swatching'); }
  function closeSwatch() { slides.forEach(s => { s.classList.remove('is-swatched'); s.style.removeProperty('--pull'); }); root.classList.remove('is-swatching'); }
  $$('[data-b11-swatch]').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.dragged) { delete btn.dataset.dragged; return; }
      slides[i].classList.contains('is-swatched') ? closeSwatch() : openSwatch(i);
      root.classList.add('has-swatched');
    });
    // Drag path — active only once texture media is registered for this SKU.
    let y0 = null;
    btn.addEventListener('pointerdown', e => { if (!swatch.has(KEYS[i]) || reduced.matches) return; y0 = e.clientY; btn.setPointerCapture(e.pointerId); });
    btn.addEventListener('pointermove', e => {
      if (y0 === null) return;
      const p = Math.max(0, Math.min(1, (e.clientY - y0) / 180));
      slides[i].style.setProperty('--pull', p.toFixed(3));
      slides[i].classList.toggle('is-dragging', p > 0.02);
    });
    const end = () => {
      if (y0 === null) return;
      y0 = null;
      const p = parseFloat(slides[i].style.getPropertyValue('--pull')) || 0;
      slides[i].classList.remove('is-dragging');
      if (p > 0.02) btn.dataset.dragged = '1';
      p > 0.35 ? openSwatch(i) : closeSwatch();
    };
    btn.addEventListener('pointerup', end);
    btn.addEventListener('pointercancel', end);
  });

  // Desktop pointer: packs lean a few px toward the cursor. Mouse + fine pointer only; off for reduced motion.
  const hero = $('.b11-hero');
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    hero.addEventListener('pointermove', e => {
      if (reduced.matches || e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      hero.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    hero.addEventListener('pointerleave', () => { hero.style.setProperty('--px', 0); hero.style.setProperty('--py', 0); });
  }

  $('[data-b11-add-active]').addEventListener('click', e => { add(KEYS[active]); pulse(e.currentTarget); });

  /* ---------- Routine AM/PM ---------- */
  const routine = $('[data-b11-routine]');
  function renderRoutineNote() { $('[data-b11-routine-note]').textContent = t(routine.dataset.time === 'pm' ? 'pmNote' : 'amNote'); }
  $$('[data-b11-time]').forEach(b => b.addEventListener('click', () => {
    routine.dataset.time = b.dataset.b11Time;
    $$('[data-b11-time]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderRoutineNote();
  }));
  $$('[data-b11-add-routine]').forEach(b => b.addEventListener('click', () => { addRoutine(); openBag(b); }));

  /* ---------- Cart ---------- */
  let cart = store.get('bts11-cart', {});
  KEYS.forEach(k => { cart[k] = Math.max(0, Math.min(9, parseInt(cart[k], 10) || 0)); });
  const count = () => KEYS.reduce((s, k) => s + cart[k], 0);
  function totals() {
    const subtotal = KEYS.reduce((s, k) => s + cart[k] * PRICE[k], 0);
    const sets = Math.min(...KEYS.map(k => cart[k]));   // every complete set of 4 gets routine pricing
    const discount = sets * SAVE;
    return { subtotal, sets, discount, total: subtotal - discount };
  }
  function save() { store.set('bts11-cart', cart); renderCart(); }
  function add(k, silent) { cart[k] = Math.min(9, cart[k] + 1); save(); if (!silent) toast(t('addedToast')(P[k].short)); }
  function addRoutine() { KEYS.forEach(k => { cart[k] = Math.min(9, cart[k] + 1); }); save(); }
  function completeRoutine() { const sets = Math.min(...KEYS.map(k => cart[k])); KEYS.forEach(k => { if (cart[k] === sets) cart[k] = Math.min(9, cart[k] + 1); }); save(); }

  const bagLayer = $('[data-b11-bag]');
  function renderCart() {
    const n = count();
    $$('[data-b11-count]').forEach(el => { el.textContent = n; });
    const lines = $('[data-b11-lines]', bagLayer), up = $('[data-b11-upsell]', bagLayer), foot = $('[data-b11-totals]', bagLayer);
    if (!n) {
      lines.innerHTML = `<div class="b11-empty"><p>${esc(t('empty'))}</p><button type="button" class="b11-btn b11-btn--primary b11-btn--wide" data-b11-add-routine-inline><span>${esc(t('emptyCta'))}</span>${bdi(ROUTINE)}</button></div>`;
      up.hidden = true; foot.innerHTML = ''; return;
    }
    lines.innerHTML = KEYS.filter(k => cart[k]).map(k => `
      <div class="b11-line b11-line--${k}">
        <span class="b11-line__img"><img src="${esc((window.BTS11_ASSETS || {})[k] || '')}" alt="" width="1024" height="1536"></span>
        <div class="b11-line__info"><strong>${esc(P[k].name)}</strong><small>${esc(t('role_' + k))} · <bdi dir="ltr">${esc(P[k].size)}</bdi></small>
          <div class="b11-qty" role="group" aria-label="${esc(t('qty'))}">
            <button type="button" data-b11-dec="${k}" aria-label="−">−</button><output>${cart[k]}</output><button type="button" data-b11-inc="${k}" aria-label="+">+</button>
          </div>
        </div>
        <div class="b11-line__end">${bdi(PRICE[k] * cart[k])}<button type="button" class="b11-line__rm" data-b11-rm="${k}">${esc(t('remove'))}</button></div>
      </div>`).join('');
    const tt = totals();
    const missing = KEYS.filter(k => cart[k] === tt.sets);
    if (missing.length && missing.length < 4 && tt.sets === 0) {
      const addSum = missing.reduce((s, k) => s + PRICE[k], 0);
      const label = lang === 'ar' ? t('completeN')(AR_COUNT[missing.length] || missing.length) : t('completeN')(missing.length);
      up.hidden = false;
      up.innerHTML = `<p>${esc(t('completeHint'))}</p>
        <div class="b11-upsell__chips">${missing.map(k => `<span class="b11-chip b11-chip--${k}">${esc(P[k].short)}</span>`).join('')}</div>
        <button type="button" class="b11-btn b11-btn--outline b11-btn--wide" data-b11-complete><span>${esc(label)} <bdi>${money(SAVE)}</bdi></span><span>+${bdi(addSum)}</span></button>`;
    } else { up.hidden = true; up.innerHTML = ''; }
    foot.innerHTML = `
      <div class="b11-tot"><span>${esc(t('subtotal'))}</span>${bdi(tt.subtotal)}</div>
      ${tt.discount ? `<div class="b11-tot b11-tot--save"><span>${esc(t('routineSaving'))}${tt.sets > 1 ? ' ×' + tt.sets : ''}</span><bdi>−${money(tt.discount)}</bdi></div>` : ''}
      <div class="b11-tot b11-tot--big"><span>${esc(t('total'))}</span>${bdi(tt.total)}</div>
      ${tt.discount ? `<p class="b11-fine b11-fine--ok">${esc(t('routineOn'))}</p>` : ''}
      <button type="button" class="b11-btn b11-btn--primary b11-btn--wide" disabled aria-disabled="true">${esc(t('checkout'))}</button>
      <p class="b11-fine">${esc(t('checkoutNote'))}</p>`;
  }
  bagLayer.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.b11Inc) { cart[b.dataset.b11Inc] = Math.min(9, cart[b.dataset.b11Inc] + 1); save(); }
    else if (b.dataset.b11Dec) { cart[b.dataset.b11Dec] = Math.max(0, cart[b.dataset.b11Dec] - 1); save(); }
    else if (b.dataset.b11Rm) { cart[b.dataset.b11Rm] = 0; save(); $('.b11-drawer').focus(); }
    else if (b.hasAttribute('data-b11-complete')) { completeRoutine(); }
    else if (b.hasAttribute('data-b11-add-routine-inline')) { addRoutine(); }
  });

  /* ---------- Layers (drawer + quick sheet): focus trap, Esc, scroll lock ---------- */
  let lastFocus = null, openLayer = null;
  function showLayer(layer, from) {
    if (openLayer && openLayer !== layer) hideLayer(openLayer, true);
    lastFocus = from || document.activeElement;
    layer.hidden = false;
    document.documentElement.classList.add('b11-lock');
    requestAnimationFrame(() => { layer.classList.add('is-open'); layer.querySelector('[role="dialog"]').focus(); });
    openLayer = layer;
  }
  function hideLayer(layer, silent) {
    layer.classList.remove('is-open');
    layer.hidden = true;
    document.documentElement.classList.remove('b11-lock');
    openLayer = null;
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function openBag(from) { renderCart(); showLayer(bagLayer, from); }
  $$('[data-b11-open-bag]').forEach(b => b.addEventListener('click', () => openBag(b)));
  $$('.b11-layer').forEach(l => l.addEventListener('click', e => { if (e.target.closest('[data-b11-close]')) hideLayer(l); }));
  document.addEventListener('keydown', e => {
    if (!openLayer) return;
    if (e.key === 'Escape') { hideLayer(openLayer); return; }
    if (e.key !== 'Tab') return;
    const f = [...openLayer.querySelectorAll('[role="dialog"] button:not([disabled]), [role="dialog"] a[href], [role="dialog"] summary')].filter(x => x.offsetParent);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  /* ---------- Quick sheet ---------- */
  const quick = $('[data-b11-quick]'), sheet = $('[data-b11-sheet-body]');
  function openSheet(k, from) {
    const p = P[k];
    sheet.className = `b11-sheet b11-sheet--${k}`;
    sheet.innerHTML = `
      <div class="b11-sheet__media b11-tex--${k}" data-media-slot="T2-${k}" data-media-status="pending">
        <span class="b11-internal">T2 · media pending</span>
        <img src="${esc((window.BTS11_ASSETS || {})[k] || '')}" alt="${esc(p.name)}" width="1024" height="1536">
        <button type="button" class="b11-close" data-b11-close aria-label="${esc(t('close'))}">×</button>
      </div>
      <div class="b11-sheet__body">
        <p class="b11-eyebrow">${esc(t('step'))} 0${KEYS.indexOf(k) + 1} · ${esc(t('role_' + k))} · <bdi dir="ltr">${esc(p.size)}</bdi></p>
        <h2 id="b11-sheet-h">${esc(p.name)}</h2>
        <p class="b11-body">${esc(t('line_' + k))}</p>
        <dl class="b11-sheet__facts">
          <div><dt>${esc(t('feels'))}</dt><dd>${esc(t('tex_' + k))}</dd></div>
          <div><dt>${esc(t('inside'))}</dt><dd dir="ltr">${esc(p.actives)}</dd></div>
        </dl>
        ${p.pills.length ? `<ul class="b11-pills" dir="ltr">${p.pills.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
        <details class="b11-inci"><summary>${esc(t('fullInci'))}</summary><p dir="ltr">${esc(p.inci)}</p></details>
        <button type="button" class="b11-btn b11-btn--primary b11-btn--wide" data-b11-sheet-add="${k}"><span>${esc(t('addToBag'))}</span>${bdi(PRICE[k])}</button>
      </div>`;
    showLayer(quick, from);
  }
  quick.addEventListener('click', e => {
    const b = e.target.closest('[data-b11-sheet-add]');
    if (b) { add(b.dataset.b11SheetAdd, true); hideLayer(quick, true); openBag(lastFocus); }
  });
  root.addEventListener('click', e => {
    const s = e.target.closest('[data-b11-sheet]');
    if (s) { e.preventDefault(); openSheet(s.dataset.b11Sheet, s); return; }
    const a = e.target.closest('[data-b11-add]');
    if (a) { add(a.dataset.b11Add); pulse(a); }
  });

  /* ---------- Capture (prototype — nothing is sent) ---------- */
  const form = $('[data-b11-form]'), input = $('[data-b11-input]', form), msg = $('[data-b11-form-msg]', form);
  let channel = 'email';
  function setChannel(c) {
    channel = c;
    $$('[data-b11-channel]', form).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.b11Channel === c)));
    const wa = c === 'whatsapp';
    input.type = wa ? 'tel' : 'email';
    input.inputMode = wa ? 'tel' : 'email';
    input.autocomplete = wa ? 'tel' : 'email';
    input.placeholder = wa ? '+20 1X XXXX XXXX' : 'you@email.com';
    input.dir = 'ltr';
    $('[data-b11-field-label]', form).textContent = wa ? 'WhatsApp' : 'Email';
  }
  $$('[data-b11-channel]', form).forEach(b => b.addEventListener('click', () => { setChannel(b.dataset.b11Channel); input.focus(); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = input.value.trim();
    const ok = channel === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) : /^\+?[0-9\s-]{8,16}$/.test(v);
    msg.textContent = t(ok ? 'formOk' : 'formBad');
    msg.classList.toggle('is-bad', !ok);
    if (ok) input.value = '';
  });

  /* ---------- Feedback ---------- */
  const toastEl = $('[data-b11-toast]'); let toastT;
  function toast(s) { toastEl.textContent = s; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2200); }
  function pulse(el) { if (reduced.matches) return; el.classList.remove('is-pulse'); void el.offsetWidth; el.classList.add('is-pulse'); }

  applyLang();
  window.BTS11 = { swatch, pricing: { PRICE, LIST, ROUTINE, SAVE } };
})();
