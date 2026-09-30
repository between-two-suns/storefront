(() => {
  const root = document.querySelector('[data-bts9]');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';

  const IMG = {
    reset:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-reset-transparent.webp?v=1790629352',
    clarity:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-clarity-transparent.webp?v=1790629358',
    barrier:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-barrier-transparent.webp?v=1790629363',
    defense:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-defense-transparent.webp?v=1790629368'
  };
  const PRICE = {reset:399, clarity:499, barrier:449, defense:499};
  const ORDER = ['reset','clarity','barrier','defense'];
  const BUNDLE = {list:1846, price:1661, save:185, pct:10};

  const PRODUCTS = {
    reset:{
      word:'RESET',
      name:'Daily Reset Cleanser',
      role:{en:'Cleanse',ar:'تنظيف'},
      step:{en:'01 · CLEANSE',ar:'01 · تنظيف'},
      size:'200 mL',
      benefit:{
        en:'Removes excess oil and daily buildup while helping skin maintain hydration.',
        ar:'ينظف الدهون الزائدة وتراكمات اليوم مع الحفاظ على ترطيب البشرة وراحتها.'
      },
      hero:{
        en:'Removes excess oil while helping skin keep its comfort.',
        ar:'ينظف الدهون الزائدة من غير ما يجرّد البشرة من راحتها.'
      },
      claims:{
        en:['NON-STRIPPING','SOAP-FREE','NON-COMEDOGENIC'],
        ar:['غير مُجرّد للترطيب','خالٍ من الصابون','غير مسبب لانسداد المسام']
      },
      formula:{
        en:[
          ['Zinc PCA','Selected for oily-to-combination skin to support oil balance.'],
          ['Centella','A soothing botanical that helps keep the cleansing step comfortable.'],
          ['Glycerin + Panthenol','Hydration and comfort support so clean skin does not have to feel tight.']
        ],
        ar:[
          ['Zinc PCA','مختار للبشرة الدهنية والمختلطة للمساعدة في توازن الدهون.'],
          ['Centella','مكوّن نباتي مهدئ يساعد على الحفاظ على راحة البشرة أثناء التنظيف.'],
          ['Glycerin + Panthenol','دعم للترطيب والراحة عشان التنظيف ما يسيبش إحساس بالشد.']
        ]
      },
      detail:{
        en:'A daily gel cleanser with Zinc PCA, Panthenol and Centella. Removes excess oil and environmental buildup without stripping, while hydrating and leaving skin fresh and comfortable.',
        ar:'غسول جل يومي يحتوي على Zinc PCA والبانثينول والسنتيلا. ينظف الدهون الزائدة وتراكمات اليوم من غير ما يجرّد البشرة من ترطيبها، ويتركها منتعشة ومريحة.'
      },
      inci:'Aqua, Sodium Lauryl Sulfosuccinate, Cocamidopropyl Betaine, Coco-Glucoside, Glycerin, Lauryl Glucoside, Propylene Glycol, PEG-120 Methyl Glucose Dioleate, Phenoxyethanol, PEG-7 Glyceryl Cocoate, Panthenol, Poloxamer 184, Polyquaternium-10, Aloe Barbadensis Leaf Extract, Centella Asiatica Extract, Sodium PCA, Zinc PCA, Ethylhexylglycerin, EDTA, Allantoin, Glycyrrhiza Glabra Root Extract, Citric Acid.'
    },
    clarity:{
      word:'CLARITY',
      name:'Clarity Serum',
      role:{en:'Treat',ar:'عناية'},
      step:{en:'02 · TREAT',ar:'02 · عناية'},
      size:'30 mL',
      benefit:{
        en:'Helps even skin tone, reduce the appearance of dark spots and control excess oil while hydrating.',
        ar:'يساعد على توحيد مظهر لون البشرة وتقليل مظهر البقع الداكنة والتحكم في الدهون الزائدة مع الحفاظ على الترطيب.'
      },
      hero:{
        en:'Targets uneven-looking tone while keeping hydration in the formula.',
        ar:'يستهدف عدم توحّد مظهر اللون مع الحفاظ على الترطيب جوه التركيبة.'
      },
      claims:{
        en:['NIACINAMIDE','TRANEXAMIC ACID','HYALURONIC ACID'],
        ar:['NIACINAMIDE','TRANEXAMIC ACID','HYALURONIC ACID']
      },
      formula:{
        en:[
          ['Niacinamide','Supports more even-looking tone, oil balance and skin-barrier function.'],
          ['Tranexamic Acid','Selected to target the appearance of stubborn uneven tone and dark spots.'],
          ['Glycerin + Sodium Hyaluronate','Keeps hydration built into the treatment rather than added as an afterthought.']
        ],
        ar:[
          ['Niacinamide','يساعد على توحيد مظهر البشرة وتوازن الدهون ودعم حاجز البشرة.'],
          ['Tranexamic Acid','موجود لاستهداف مظهر البقع الداكنة وعدم توحّد اللون.'],
          ['Glycerin + Sodium Hyaluronate','الترطيب جزء أساسي من التركيبة، مش خطوة ثانوية.']
        ]
      },
      detail:{
        en:'A daily serum with Niacinamide, Tranexamic Acid and Hyaluronic Acid. Helps even skin tone and reduce the appearance of dark spots while controlling excess oil and hydrating skin.',
        ar:'سيروم يومي بنياسيناميد وترانيكساميك أسيد وهيالورونيك أسيد. يساعد على توحيد مظهر لون البشرة وتقليل مظهر البقع الداكنة مع التحكم في الدهون الزائدة والحفاظ على الترطيب.'
      },
      inci:'Aqua, Niacinamide, Glycerin, Tranexamic Acid, Propylene Glycol, Phenoxyethanol, Panthenol, Xylitylglucoside, Anhydroxylitol, Xylitol, Sodium Hyaluronate, Ammonium Acryloyldimethyltaurate/VP Copolymer, Ethylhexylglycerin, EDTA, Allantoin.'
    },
    barrier:{
      word:'BARRIER',
      name:'Daily Barrier Moisturizing Cream',
      role:{en:'Hydrate',ar:'ترطيب'},
      step:{en:'03 · HYDRATE',ar:'03 · ترطيب'},
      size:'50 g',
      benefit:{
        en:'Hydrates without heaviness, helps control oil and supports the skin barrier.',
        ar:'يرطب من غير إحساس تقيل، يساعد في التحكم في الدهون ويدعم حاجز البشرة.'
      },
      hero:{
        en:'Barrier support and hydration without a heavy finish.',
        ar:'دعم للحاجز وترطيب من غير إحساس تقيل.'
      },
      claims:{
        en:['OIL-CONTROL','NON-COMEDOGENIC','FRAGRANCE-FREE'],
        ar:['تحكم في الدهون','غير مسبب لانسداد المسام','خالٍ من العطر']
      },
      formula:{
        en:[
          ['Ceramides','Barrier lipids chosen to support the skin’s protective structure.'],
          ['Niacinamide + Zinc PCA','A pairing that fits oily-to-combination skin while supporting barrier care.'],
          ['Squalane + Glycerin + Panthenol','Hydration and comfort without turning the formula into a heavy cream.']
        ],
        ar:[
          ['Ceramides','دهون أساسية تدعم البنية الواقية لحاجز البشرة.'],
          ['Niacinamide + Zinc PCA','تركيبة مناسبة للبشرة الدهنية والمختلطة مع دعم حاجز البشرة.'],
          ['Squalane + Glycerin + Panthenol','ترطيب وراحة من غير ما الكريم يحسّس البشرة بثقل.']
        ]
      },
      detail:{
        en:'A daily moisturizer with Ceramides, Niacinamide and Zinc PCA. Hydrates without heaviness, controls oil and strengthens the skin barrier.',
        ar:'مرطب يومي بالسيراميدات والنياسيناميد وZinc PCA. يرطب من غير ثقل، يساعد في التحكم في الدهون ويدعم حاجز البشرة.'
      },
      inci:'Aqua, Glycerin, Niacinamide, Propylene Glycol, Caprylic/Capric Triglyceride, Glyceryl Stearate, PEG-100 Stearate, Cetearyl Alcohol, Isohexadecane, Squalane, Dimethicone, Panthenol, Phenoxyethanol, Ammonium Acryloyldimethyltaurate/VP Copolymer, Zinc PCA, Sodium Hyaluronate, Sodium PCA, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Sodium Lauroyl Lactylate, Ethylhexylglycerin, Cholesterol, Carbomer, Disodium EDTA, Xanthan Gum.'
    },
    defense:{
      word:'DEFENSE',
      name:'Daily Defense Sunscreen SPF 50',
      role:{en:'Protect',ar:'حماية'},
      step:{en:'04 · PROTECT',ar:'04 · حماية'},
      size:'50 g',
      benefit:{
        en:'Broad-spectrum SPF 50 protection in a lightweight, fast-absorbing formula with no white cast.',
        ar:'حماية واسعة الطيف SPF 50 بتركيبة خفيفة وسريعة الامتصاص من غير أثر أبيض.'
      },
      hero:{
        en:'Broad-spectrum SPF 50 with a lightweight, no-white-cast finish.',
        ar:'حماية SPF 50 واسعة الطيف بلمسة خفيفة ومن غير أثر أبيض.'
      },
      claims:{
        en:['HYDRATING','NO WHITE CAST','NON-GREASY'],
        ar:['مرطب','من غير أثر أبيض','غير دهني']
      },
      formula:{
        en:[
          ['UVA + UVB Filters','A multi-filter system provides broad-spectrum daily protection.'],
          ['Niacinamide + Panthenol','Support hydration and skin comfort alongside UV protection.'],
          ['Bisabolol','Included for its soothing role in a formula designed for daily wear.']
        ],
        ar:[
          ['UVA + UVB Filters','نظام فلاتر متعدد يوفر حماية يومية واسعة الطيف.'],
          ['Niacinamide + Panthenol','يدعمان الترطيب وراحة البشرة بجانب الحماية من الأشعة.'],
          ['Bisabolol','موجود لدعم راحة البشرة في تركيبة معمولة للاستخدام اليومي.']
        ]
      },
      detail:{
        en:'A daily SPF 50 sunscreen with Niacinamide, Panthenol and Bisabolol. Provides broad-spectrum UVA/UVB protection in a lightweight, fast-absorbing formula with no white cast.',
        ar:'واقي شمس يومي SPF 50 بالنياسيناميد والبانثينول والبيسابولول. يوفر حماية واسعة الطيف من UVA وUVB بتركيبة خفيفة وسريعة الامتصاص ومن غير أثر أبيض.'
      },
      inci:'Aqua, C12-15 Alkyl Benzoate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Ethylhexyl Methoxycinnamate, Ethylhexyl Salicylate, Bis-PEG/PPG-16/16 PEG/PPG-16/16 Dimethicone, Propylene Glycol, Glycerin, Methyl Methacrylate Crosspolymer, Niacinamide, Cetearyl Alcohol, Ammonium Acryloyldimethyltaurate/VP Copolymer, Caprylic/Capric Triglyceride, Caprylyl Methicone, Dimethicone, Phenoxyethanol, Panthenol, Bisabolol, Aloe Barbadensis Leaf Extract, Tocopheryl Acetate, Triethanolamine, Ethylhexylglycerin, EDTA.'
    }
  };

  const COPY = {
    en:{
      products:'Products',routine:'Routine',why:'Why BTS',bag:'Bag',
      positioning:'Climate-adapted skincare',
      fresh:'fresh skin. always.',
      heroBody:'Four essentials designed to work together — without turning skincare into a project.',
      fullRoutine:'FULL ROUTINE · 4 PRODUCTS',save:'SAVE',
      formulaTitle:'WHY THIS FORMULA',formulaSub:'Useful science. No textbook.',
      add:'Add to bag',details:'Full details',
      routineKicker:'YOUR ROUTINE',routineTitle:'FOUR IN THE MORNING.<br>THREE AT NIGHT.',
      am:'AM',pm:'PM',cleanse:'Cleanse',treat:'Treat',hydrate:'Hydrate',protect:'Protect',morningOnly:'Morning only',
      whyKicker:'CLIMATE-ADAPTED, BY DESIGN',
      whyTitle:'LESS ABOUT WEATHER.<br>MORE ABOUT HOW SKIN ACTUALLY LIVES.',
      whyOneTitle:'Clean without over-cleansing.',
      whyOneBody:'The cleanser balances effective surfactants with Glycerin, Panthenol, Sodium PCA and Centella for a comfortable after-feel.',
      whyTwoTitle:'Treat without forgetting hydration.',
      whyTwoBody:'Niacinamide and Tranexamic Acid target uneven-looking tone while humectants keep hydration built into the serum.',
      whyThreeTitle:'Support the barrier without heaviness.',
      whyThreeBody:'Ceramides, Niacinamide, Squalane and Zinc PCA work inside a moisturizer designed for oily-to-combination skin.',
      whyFourTitle:'Wear SPF without fighting the finish.',
      whyFourBody:'SPF 50 broad-spectrum protection in a lightweight, fast-absorbing, non-greasy formula with no white cast.',
      shopRoutine:'Shop the routine',checkout:'Checkout opens at launch',
      prototype:'Prototype preview. Working launch prices shown; checkout is not active yet.',
      fullInci:'Full ingredient list',
      remove:'Remove',subtotal:'Subtotal',routinePrice:'Routine price',youSave:'You save',
      complete:'Complete the routine',empty:'Your bag is empty.'
    },
    ar:{
      products:'المنتجات',routine:'الروتين',why:'ليه BTS',bag:'الشنطة',
      positioning:'عناية بالبشرة متكيفة مع المناخ',
      fresh:'بشرة منتعشة. دايمًا.',
      heroBody:'4 أساسيات معمولين يشتغلوا مع بعض — من غير ما العناية بالبشرة تبقى مشروع.',
      fullRoutine:'الروتين كامل · 4 منتجات',save:'وفّري',
      formulaTitle:'ليه التركيبة دي؟',formulaSub:'معلومة مفيدة. من غير تعقيد.',
      add:'ضيفيه للشنطة',details:'كل التفاصيل',
      routineKicker:'روتينك',routineTitle:'4 خطوات الصبح.<br>3 بالليل.',
      am:'الصبح',pm:'بالليل',cleanse:'تنظيف',treat:'عناية',hydrate:'ترطيب',protect:'حماية',morningOnly:'الصبح بس',
      whyKicker:'متكيفة مع المناخ في صميم التركيبة',
      whyTitle:'الموضوع مش الطقس.<br>الموضوع إزاي بشرتك بتعيش يومها.',
      whyOneTitle:'تنظيف من غير إفراط.',
      whyOneBody:'تركيبة التنظيف توازن بين مواد تنظيف فعالة وبين الجلسرين والبانثينول وSodium PCA والسنتيلا عشان الإحساس بعد الغسيل يفضل مريح.',
      whyTwoTitle:'عناية من غير ما ننسى الترطيب.',
      whyTwoBody:'النياسيناميد والترانيكساميك أسيد يستهدفوا عدم توحّد مظهر اللون، مع مرطبات تخلي الترطيب جزء من السيروم نفسه.',
      whyThreeTitle:'دعم للحاجز من غير ثقل.',
      whyThreeBody:'السيراميدات والنياسيناميد والسكوالين وZinc PCA جوه مرطب مناسب للبشرة الدهنية والمختلطة.',
      whyFourTitle:'SPF من غير ما تحاربي الملمس.',
      whyFourBody:'حماية SPF 50 واسعة الطيف في تركيبة خفيفة وسريعة الامتصاص وغير دهنية ومن غير أثر أبيض.',
      shopRoutine:'اشتري الروتين',checkout:'الدفع هيفتح مع الإطلاق',
      prototype:'نسخة تجريبية. الأسعار المعروضة مبدئية والدفع مش متفعّل لسه.',
      fullInci:'قائمة المكونات كاملة',
      remove:'إزالة',subtotal:'الإجمالي',routinePrice:'سعر الروتين',youSave:'هتوفّري',
      complete:'كمّلي الروتين',empty:'الشنطة فاضية.'
    }
  };

  let language='en';
  let active='reset';
  let routineTime='am';
  const selected=new Set();

  const $=(s,scope=root)=>scope.querySelector(s);
  const $$=(s,scope=root)=>[...scope.querySelectorAll(s)];
  const egp=n=>'EGP '+n.toLocaleString('en-US');
  const t=k=>COPY[language][k];
  const tok=n=>'<bdi dir="ltr">'+egp(n)+'</bdi>';

  function i18n(){
    $$('[data-i18n]').forEach(el=>{
      const val=t(el.dataset.i18n);
      if(typeof val==='string') {
        if(val.includes('<br>')) el.innerHTML=val;
        else el.textContent=val;
      }
    });
    $$('.bts9-arrow').forEach(a=>a.textContent=language==='ar'?'←':'→');
  }

  function renderLanes(){
    $('[data-bts9-lanes]').dataset.selected=active;
    $$('[data-bts9-lane]').forEach(btn=>{
      const key=btn.dataset.bts9Lane;
      const on=key===active;
      btn.classList.toggle('is-selected',on);
      btn.setAttribute('aria-pressed',on?'true':'false');
      const p=PRODUCTS[key];
      btn.querySelector('[data-role]').textContent=p.role[language];
      btn.querySelector('[data-benefit]').textContent=p.hero[language];
    });
  }

  function renderProduct(){
    const p=PRODUCTS[active];
    const shop=$('[data-bts9-shop]');
    shop.dataset.product=active;
    $$('[data-bts9-product]').forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.bts9Product===active?'true':'false'));
    $('[data-bts9-number]').textContent='0'+(ORDER.indexOf(active)+1);
    $('[data-bts9-word]').textContent=p.word;
    const img=$('[data-bts9-image]');
    img.style.opacity='0';
    img.style.transform='translateX(-50%) scale(.96)';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      img.src=IMG[active];
      img.alt=p.name;
      img.style.opacity='1';
      img.style.transform='translateX(-50%) scale(1)';
    }));
    $('[data-bts9-step]').textContent=p.step[language];
    $('[data-bts9-name]').textContent=p.name;
    $('[data-bts9-price]').textContent=egp(PRICE[active]);
    $('[data-bts9-size]').textContent=p.size;
    $('[data-bts9-benefit]').textContent=p.benefit[language];
    $('[data-bts9-claims]').innerHTML=p.claims[language].map(x=>'<span>'+x+'</span>').join('');
    $('[data-bts9-formula]').innerHTML=p.formula[language].map(([n,d])=>'<div class="bts9-formulaitem"><strong dir="ltr">'+n+'</strong><p>'+d+'</p></div>').join('');
    const add=$('[data-bts9-add]');
    add.dataset.bts9Add=active;
    add.innerHTML=selected.has(active)
      ? '<span>'+(language==='ar'?'في الشنطة':'In bag')+' ✓</span>'
      : '<span>'+t('add')+'</span><span>·</span>'+tok(PRICE[active]);
  }

  function renderRoutine(){
    const sec=$('[data-bts9-routine]');
    sec.dataset.time=routineTime;
    $$('[data-bts9-time]').forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.bts9Time===routineTime?'true':'false'));
    $('[data-bts9-routine-copy]').textContent=routineTime==='am'
      ? (language==='ar'?'تنظيف. عناية. ترطيب. حماية.':'Cleanse. Treat. Hydrate. Protect.')
      : (language==='ar'?'تنظيف. عناية. ترطيب. واقي الشمس للصبح.':'Cleanse. Treat. Hydrate. SPF stays for the morning.');
  }

  function renderCount(){
    $('[data-bts9-count]').textContent=String(selected.size);
  }

  function setLanguage(next){
    language=next;
    root.dataset.lang=language;
    root.lang=language;
    root.dir=language==='ar'?'rtl':'ltr';
    $('[data-bts9-lang]').textContent=language==='ar'?'EN':'AR';
    i18n();renderLanes();renderProduct();renderRoutine();renderCount();
    if(!drawer.hidden) buildDrawer();
  }

  function selectProduct(key,scroll=false){
    active=key;
    renderLanes();renderProduct();
    if(scroll) $('#shop').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  }

  $$('[data-bts9-lane]').forEach(btn=>btn.addEventListener('click',()=>selectProduct(btn.dataset.bts9Lane,false)));
  $$('[data-bts9-product]').forEach(btn=>btn.addEventListener('click',()=>selectProduct(btn.dataset.bts9Product,false)));
  $('[data-bts9-lang]').addEventListener('click',()=>setLanguage(language==='en'?'ar':'en'));
  $$('[data-bts9-time]').forEach(btn=>btn.addEventListener('click',()=>{routineTime=btn.dataset.bts9Time;renderRoutine();}));

  $('[data-bts9-add]').addEventListener('click',e=>{
    const key=e.currentTarget.dataset.bts9Add;
    if(selected.has(key)) selected.delete(key); else selected.add(key);
    renderProduct();renderCount();openDrawer(e.currentTarget);
  });

  const drawer=$('[data-bts9-drawer]');
  const sheet=$('[data-bts9-sheet]');
  let previousFocus=null;

  function buildDrawer(){
    const keys=ORDER.filter(k=>selected.has(k));
    $('[data-bts9-drawer-title]').textContent=language==='ar'?(keys.length+' منتجات'):(keys.length+(keys.length===1?' product':' products'));
    const items=$('[data-bts9-drawer-items]');
    items.innerHTML=keys.length?keys.map(key=>{
      const p=PRODUCTS[key];
      return '<div class="bts9-draweritem"><img src="'+IMG[key]+'" alt=""><div><strong dir="ltr">'+p.name+'</strong><span dir="ltr">'+p.size+'</span></div><div class="bts9-draweritem__end"><b>'+tok(PRICE[key])+'</b><button type="button" data-bts9-remove="'+key+'">'+t('remove')+'</button></div></div>';
    }).join(''):'<p class="bts9-drawer__empty">'+t('empty')+'</p>';

    const total=keys.reduce((s,k)=>s+PRICE[k],0);
    const totals=$('[data-bts9-drawer-totals]');
    if(keys.length===4){
      totals.innerHTML='<div class="bts9-total"><span>'+t('subtotal')+'</span><s>'+tok(BUNDLE.list)+'</s></div>'+
        '<div class="bts9-total bts9-total--save"><span>'+t('youSave')+'</span><b>'+tok(BUNDLE.save)+' · '+BUNDLE.pct+'%</b></div>'+
        '<div class="bts9-total bts9-total--big"><span>'+t('routinePrice')+'</span><b>'+tok(BUNDLE.price)+'</b></div>';
    }else{
      totals.innerHTML=(keys.length?'<div class="bts9-total bts9-total--big"><span>'+t('subtotal')+'</span><b>'+tok(total)+'</b></div>':'')+
        '<button type="button" class="bts9-drawer__complete" data-bts9-complete>'+t('complete')+' · '+tok(BUNDLE.price)+' · '+t('save')+' '+tok(BUNDLE.save)+'</button>';
    }
  }

  function openDrawer(trigger){
    previousFocus=trigger||document.activeElement;
    buildDrawer();
    drawer.hidden=false;
    document.documentElement.style.overflow='hidden';
    updateSticky();
    $('[data-bts9-close]',drawer)?.focus();
  }
  function closeDrawer(){
    drawer.hidden=true;
    document.documentElement.style.overflow='';
    previousFocus?.focus?.({preventScroll:true});
    previousFocus=null;
    updateSticky();
  }
  function buyRoutine(trigger){
    ORDER.forEach(k=>selected.add(k));
    renderCount();renderProduct();openDrawer(trigger);
  }

  $$('[data-bts9-buy-routine]').forEach(btn=>btn.addEventListener('click',()=>buyRoutine(btn)));
  $$('[data-bts9-open-bag]').forEach(btn=>btn.addEventListener('click',()=>openDrawer(btn)));
  $$('[data-bts9-close]').forEach(btn=>btn.addEventListener('click',closeDrawer));
  drawer.addEventListener('click',e=>{
    const rem=e.target.closest('[data-bts9-remove]');
    if(rem){selected.delete(rem.dataset.bts9Remove);renderCount();renderProduct();buildDrawer();}
    const comp=e.target.closest('[data-bts9-complete]');
    if(comp){ORDER.forEach(k=>selected.add(k));renderCount();renderProduct();buildDrawer();}
  });

  function openSheet(trigger){
    const p=PRODUCTS[active];
    previousFocus=trigger||document.activeElement;
    $('[data-bts9-sheet-step]').textContent=p.step[language];
    $('[data-bts9-sheet-title]').textContent=p.name;
    const img=$('[data-bts9-sheet-image]');img.src=IMG[active];img.alt=p.name;
    $('[data-bts9-sheet-copy]').textContent=p.detail[language];
    $('[data-bts9-inci]').textContent=p.inci;
    $('[data-bts9-inci]').hidden=true;
    $('[data-bts9-inci-toggle]').setAttribute('aria-expanded','false');
    sheet.hidden=false;
    document.documentElement.style.overflow='hidden';
    $('[data-bts9-sheet-close]',sheet)?.focus();
  }
  function closeSheet(){
    sheet.hidden=true;
    document.documentElement.style.overflow='';
    previousFocus?.focus?.({preventScroll:true});
    previousFocus=null;
  }
  $('[data-bts9-details]').addEventListener('click',e=>openSheet(e.currentTarget));
  $$('[data-bts9-sheet-close]').forEach(btn=>btn.addEventListener('click',closeSheet));
  $('[data-bts9-inci-toggle]').addEventListener('click',e=>{
    const p=$('[data-bts9-inci]');
    p.hidden=!p.hidden;
    e.currentTarget.setAttribute('aria-expanded',p.hidden?'false':'true');
    e.currentTarget.lastElementChild.textContent=p.hidden?'+':'−';
  });

  function trap(container,e,closeFn){
    if(e.key==='Escape'){closeFn();return;}
    if(e.key!=='Tab')return;
    const els=$$('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])',container).filter(x=>x.offsetParent!==null);
    if(!els.length)return;
    const first=els[0],last=els[els.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
  document.addEventListener('keydown',e=>{
    if(!drawer.hidden){trap(drawer,e,closeDrawer);return;}
    if(!sheet.hidden){trap(sheet,e,closeSheet);}
  });

  const sticky=$('[data-bts9-sticky]');
  const hero=$('[data-bts9-hero]');
  const nav=$('[data-bts9-nav]');
  function updateSticky(){
    const rect=hero.getBoundingClientRect();
    const visible=rect.bottom<120 && drawer.hidden && sheet.hidden;
    sticky.classList.toggle('is-visible',visible);
    root.classList.toggle('has-sticky',visible);
    nav.classList.toggle('is-scrolled',scrollY>12);
  }
  addEventListener('scroll',updateSticky,{passive:true});
  addEventListener('resize',updateSticky);

  // Desktop-only tactile lane movement, intentionally tiny.
  if(matchMedia('(pointer:fine)').matches){
    $$('[data-bts9-lane]').forEach(btn=>{
      btn.addEventListener('pointermove',e=>{
        if(!btn.classList.contains('is-selected'))return;
        const r=btn.getBoundingClientRect();
        const x=((e.clientX-r.left)/r.width-.5)*8;
        const y=((e.clientY-r.top)/r.height-.5)*5;
        const img=btn.querySelector('img');
        img.style.translate=x+'px '+y+'px';
      });
      btn.addEventListener('pointerleave',()=>{btn.querySelector('img').style.translate='';});
    });
  }

  setLanguage('en');
  updateSticky();
})();