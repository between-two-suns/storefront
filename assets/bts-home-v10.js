(() => {
  const root=document.querySelector('[data-bts10]');
  if(!root||root.dataset.ready==='true')return;
  root.dataset.ready='true';

  const IMG={
    reset:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-reset-transparent.webp?v=1790629352',
    clarity:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-clarity-transparent.webp?v=1790629358',
    barrier:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-barrier-transparent.webp?v=1790629363',
    defense:'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-defense-transparent.webp?v=1790629368'
  };
  const PRICE={reset:399,clarity:499,barrier:449,defense:499};
  const ORDER=['reset','clarity','barrier','defense'];
  const BUNDLE={list:1846,price:1661,save:185,pct:10};

  const PRODUCTS={
    reset:{
      name:'Daily Reset Cleanser',size:'200 mL',
      role:{en:'Cleanse',ar:'تنظيف'},
      benefit:{
        en:'Removes excess oil and daily buildup while helping skin maintain hydration.',
        ar:'ينظف الدهون الزائدة وتراكمات اليوم مع الحفاظ على ترطيب البشرة وراحتها.'
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
      inci:'Aqua, Sodium Lauryl Sulfosuccinate, Cocamidopropyl Betaine, Coco-Glucoside, Glycerin, Lauryl Glucoside, Propylene Glycol, PEG-120 Methyl Glucose Dioleate, Phenoxyethanol, PEG-7 Glyceryl Cocoate, Panthenol, Poloxamer 184, Polyquaternium-10, Aloe Barbadensis Leaf Extract, Centella Asiatica Extract, Sodium PCA, Zinc PCA, Ethylhexylglycerin, EDTA, Allantoin, Glycyrrhiza Glabra Root Extract, Citric Acid.'
    },
    clarity:{
      name:'Clarity Serum',size:'30 mL',
      role:{en:'Treat',ar:'عناية'},
      benefit:{
        en:'Helps even skin tone, reduce the appearance of dark spots and control excess oil while hydrating.',
        ar:'يساعد على توحيد مظهر لون البشرة وتقليل مظهر البقع الداكنة والتحكم في الدهون الزائدة مع الحفاظ على الترطيب.'
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
      inci:'Aqua, Niacinamide, Glycerin, Tranexamic Acid, Propylene Glycol, Phenoxyethanol, Panthenol, Xylitylglucoside, Anhydroxylitol, Xylitol, Sodium Hyaluronate, Ammonium Acryloyldimethyltaurate/VP Copolymer, Ethylhexylglycerin, EDTA, Allantoin.'
    },
    barrier:{
      name:'Daily Barrier Moisturizing Cream',size:'50 g',
      role:{en:'Hydrate',ar:'ترطيب'},
      benefit:{
        en:'Hydrates without heaviness, helps control oil and supports the skin barrier.',
        ar:'يرطب من غير إحساس تقيل، يساعد في التحكم في الدهون ويدعم حاجز البشرة.'
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
      inci:'Aqua, Glycerin, Niacinamide, Propylene Glycol, Caprylic/Capric Triglyceride, Glyceryl Stearate, PEG-100 Stearate, Cetearyl Alcohol, Isohexadecane, Squalane, Dimethicone, Panthenol, Phenoxyethanol, Ammonium Acryloyldimethyltaurate/VP Copolymer, Zinc PCA, Sodium Hyaluronate, Sodium PCA, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Sodium Lauroyl Lactylate, Ethylhexylglycerin, Cholesterol, Carbomer, Disodium EDTA, Xanthan Gum.'
    },
    defense:{
      name:'Daily Defense Sunscreen SPF 50',size:'50 g',
      role:{en:'Protect',ar:'حماية'},
      benefit:{
        en:'Broad-spectrum SPF 50 protection in a lightweight, fast-absorbing formula with no white cast.',
        ar:'حماية واسعة الطيف SPF 50 بتركيبة خفيفة وسريعة الامتصاص من غير أثر أبيض.'
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
      inci:'Aqua, C12-15 Alkyl Benzoate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Ethylhexyl Methoxycinnamate, Ethylhexyl Salicylate, Bis-PEG/PPG-16/16 PEG/PPG-16/16 Dimethicone, Propylene Glycol, Glycerin, Methyl Methacrylate Crosspolymer, Niacinamide, Cetearyl Alcohol, Ammonium Acryloyldimethyltaurate/VP Copolymer, Caprylic/Capric Triglyceride, Caprylyl Methicone, Dimethicone, Phenoxyethanol, Panthenol, Bisabolol, Aloe Barbadensis Leaf Extract, Tocopheryl Acetate, Triethanolamine, Ethylhexylglycerin, EDTA.'
    }
  };

  const COPY={
    en:{
      products:'Products',routine:'Routine',why:'Why BTS',bag:'Bag',
      positioning:'Climate-adapted skincare',fresh:'fresh skin. always.',
      heroBody:'Four essentials. One clear routine. Designed to feel good enough to use every day.',
      fullRoutine:'FULL ROUTINE · 4 PRODUCTS',save:'SAVE',shopSingles:'Shop individual products',
      shop:'SHOP',productsTitle:'Four products. No filler.',add:'Add',insideFormula:'Inside the formula',
      completeRoutine:'THE COMPLETE ROUTINE',addRoutine:'Add all four',
      routineKicker:'YOUR ROUTINE',am:'AM',pm:'PM',cleanse:'Cleanse',treat:'Treat',hydrate:'Hydrate',protect:'Protect',morningOnly:'Morning only',
      whyKicker:'CLIMATE-ADAPTED, BY DESIGN',whyTitle:'Thoughtful formulas, explained simply.',
      why1:'Clean without over-cleansing.',why1b:'A balanced cleansing system with Zinc PCA, Centella, Glycerin and Panthenol.',
      why2:'Treat without forgetting hydration.',why2b:'Niacinamide and Tranexamic Acid work alongside a hydrating base.',
      why3:'Support the barrier without heaviness.',why3b:'Ceramides, Niacinamide, Squalane and Zinc PCA in a lightweight cream.',
      why4:'Wear SPF without fighting the finish.',why4b:'SPF 50 broad-spectrum protection with a lightweight, fast-absorbing finish and no white cast.',
      shopRoutine:'Shop the routine',checkout:'Checkout opens at launch',prototype:'Prototype preview. Working launch prices shown; checkout is not active yet.',
      fullInci:'Full ingredient list',remove:'Remove',subtotal:'Subtotal',routinePrice:'Routine price',youSave:'You save',complete:'Complete the routine',empty:'Your bag is empty.'
    },
    ar:{
      products:'المنتجات',routine:'الروتين',why:'ليه BTS',bag:'الشنطة',
      positioning:'عناية بالبشرة متكيفة مع المناخ',fresh:'بشرة منتعشة. دايمًا.',
      heroBody:'4 أساسيات. روتين واضح. معمولين عشان يبقوا سهلين كفاية للاستخدام كل يوم.',
      fullRoutine:'الروتين كامل · 4 منتجات',save:'وفّري',shopSingles:'اشتري كل منتج لوحده',
      shop:'تسوّقي',productsTitle:'4 منتجات. من غير حشو.',add:'ضيفي',insideFormula:'جوه التركيبة',
      completeRoutine:'الروتين الكامل',addRoutine:'ضيفي الأربعة',
      routineKicker:'روتينك',am:'الصبح',pm:'بالليل',cleanse:'تنظيف',treat:'عناية',hydrate:'ترطيب',protect:'حماية',morningOnly:'الصبح بس',
      whyKicker:'متكيفة مع المناخ في صميم التركيبة',whyTitle:'تركيبات مدروسة، متشرحة ببساطة.',
      why1:'تنظيف من غير إفراط.',why1b:'نظام تنظيف متوازن مع Zinc PCA والسنتيلا والجلسرين والبانثينول.',
      why2:'عناية من غير ما ننسى الترطيب.',why2b:'النياسيناميد والترانيكساميك أسيد بيشتغلوا مع قاعدة مرطبة.',
      why3:'دعم للحاجز من غير ثقل.',why3b:'سيراميدات ونياسيناميد وسكوالين وZinc PCA في كريم خفيف.',
      why4:'SPF من غير ما تحاربي الملمس.',why4b:'حماية SPF 50 واسعة الطيف بلمسة خفيفة وسريعة الامتصاص ومن غير أثر أبيض.',
      shopRoutine:'اشتري الروتين',checkout:'الدفع هيفتح مع الإطلاق',prototype:'نسخة تجريبية. الأسعار المعروضة مبدئية والدفع مش متفعّل لسه.',
      fullInci:'قائمة المكونات كاملة',remove:'إزالة',subtotal:'الإجمالي',routinePrice:'سعر الروتين',youSave:'هتوفّري',complete:'كمّلي الروتين',empty:'الشنطة فاضية.'
    }
  };

  let language='en';
  let routineTime='am';
  const selected=new Set();
  const $=(s,scope=root)=>scope.querySelector(s);
  const $$=(s,scope=root)=>[...scope.querySelectorAll(s)];
  const t=k=>COPY[language][k];
  const egp=n=>'EGP '+n.toLocaleString('en-US');
  const tok=n=>'<bdi dir="ltr">'+egp(n)+'</bdi>';

  function renderI18n(){
    $$('[data-i18n]').forEach(el=>{
      const v=t(el.dataset.i18n);
      if(typeof v==='string') el.textContent=v;
    });
    $$('.bts10-arrow').forEach(el=>el.textContent=language==='ar'?'←':'→');

    ORDER.forEach(key=>{
      const p=PRODUCTS[key];
      const role=$('[data-role-'+key+']');
      const benefit=$('[data-benefit-'+key+']');
      if(role) role.textContent=p.role[language];
      if(benefit) benefit.textContent=p.benefit[language];
    });
  }

  function renderCount(){
    $('[data-bts10-count]').textContent=String(selected.size);
    $$('[data-bts10-add]').forEach(btn=>{
      const key=btn.dataset.bts10Add;
      const on=selected.has(key);
      btn.classList.toggle('is-added',on);
      btn.setAttribute('aria-pressed',on?'true':'false');
      btn.innerHTML=on
        ? '<span>'+(language==='ar'?'تمت الإضافة':'Added')+' ✓</span>'
        : '<span>'+t('add')+'</span><span>·</span><bdi dir="ltr">'+egp(PRICE[key])+'</bdi>';
    });
  }

  function renderRoutine(){
    const sec=$('[data-bts10-routine]');
    sec.dataset.time=routineTime;
    $$('[data-bts10-time]').forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.bts10Time===routineTime?'true':'false'));
    $('[data-bts10-routine-title]').textContent=routineTime==='am'
      ? (language==='ar'?'الصبح: 4 خطوات.':'Morning: 4 steps.')
      : (language==='ar'?'بالليل: 3 خطوات.':'Night: 3 steps.');
    $('[data-bts10-routine-body]').textContent=routineTime==='am'
      ? (language==='ar'?'تنظيف. عناية. ترطيب. حماية.':'Cleanse. Treat. Hydrate. Protect.')
      : (language==='ar'?'تنظيف. عناية. ترطيب. واقي الشمس للصبح بس.':'Cleanse. Treat. Hydrate. SPF stays for the morning.');
  }

  function setLanguage(next){
    language=next;
    root.dataset.lang=language;
    root.lang=language;
    root.dir=language==='ar'?'rtl':'ltr';
    $('[data-bts10-lang]').textContent=language==='ar'?'EN':'AR';
    renderI18n();renderRoutine();renderCount();
    if(!drawer.hidden) buildDrawer();
  }

  $('[data-bts10-lang]').addEventListener('click',()=>setLanguage(language==='en'?'ar':'en'));

  $$('[data-bts10-time]').forEach(btn=>btn.addEventListener('click',()=>{
    routineTime=btn.dataset.bts10Time;
    renderRoutine();
  }));

  const rail=$('[data-bts10-rail]');
  const dots=$$('.bts10-dots span');
  let railTick=false;
  rail.addEventListener('scroll',()=>{
    if(railTick)return;
    railTick=true;
    requestAnimationFrame(()=>{
      const cards=$$('.bts10-card',rail);
      let best=0,bestDist=Infinity;
      cards.forEach((c,i)=>{
        const d=Math.abs(c.getBoundingClientRect().left-rail.getBoundingClientRect().left-16);
        if(d<bestDist){bestDist=d;best=i;}
      });
      dots.forEach((d,i)=>d.classList.toggle('is-active',i===best));
      railTick=false;
    });
  },{passive:true});

  $$('[data-bts10-add]').forEach(btn=>btn.addEventListener('click',()=>{
    const key=btn.dataset.bts10Add;
    if(selected.has(key))selected.delete(key);else selected.add(key);
    navigator.vibrate?.(12);
    renderCount();
  }));

  const drawer=$('[data-bts10-drawer]');
  const sheet=$('[data-bts10-sheet]');
  let previousFocus=null;

  function buildDrawer(){
    const keys=ORDER.filter(k=>selected.has(k));
    $('[data-bts10-title]').textContent=language==='ar'?(keys.length+' منتجات'):(keys.length+(keys.length===1?' product':' products'));
    const items=$('[data-bts10-items]');
    items.innerHTML=keys.length?keys.map(key=>{
      const p=PRODUCTS[key];
      return '<div class="bts10-item"><img src="'+IMG[key]+'" alt=""><div><strong dir="ltr">'+p.name+'</strong><small dir="ltr">'+p.size+'</small></div><div><b>'+tok(PRICE[key])+'</b><button type="button" data-bts10-remove="'+key+'">'+t('remove')+'</button></div></div>';
    }).join(''):'<p class="bts10-drawer__note">'+t('empty')+'</p>';

    const total=keys.reduce((s,k)=>s+PRICE[k],0);
    const totals=$('[data-bts10-totals]');
    totals.className='bts10-totals';
    if(keys.length===4){
      totals.innerHTML='<div class="bts10-total"><span>'+t('subtotal')+'</span><s>'+tok(BUNDLE.list)+'</s></div>'+
        '<div class="bts10-total"><span>'+t('youSave')+'</span><b>'+tok(BUNDLE.save)+' · '+BUNDLE.pct+'%</b></div>'+
        '<div class="bts10-total bts10-total--big"><span>'+t('routinePrice')+'</span><b>'+tok(BUNDLE.price)+'</b></div>';
    }else{
      totals.innerHTML=(keys.length?'<div class="bts10-total bts10-total--big"><span>'+t('subtotal')+'</span><b>'+tok(total)+'</b></div>':'')+
        '<button type="button" class="bts10-complete" data-bts10-complete>'+t('complete')+' · '+tok(BUNDLE.price)+' · '+t('save')+' '+tok(BUNDLE.save)+'</button>';
    }
  }
  function openDrawer(trigger){
    previousFocus=trigger||document.activeElement;
    buildDrawer();
    drawer.hidden=false;
    document.documentElement.style.overflow='hidden';
    $('[data-bts10-close]',drawer)?.focus();
  }
  function closeDrawer(){
    drawer.hidden=true;
    document.documentElement.style.overflow='';
    previousFocus?.focus?.({preventScroll:true});
    previousFocus=null;
  }
  function buyRoutine(trigger){
    ORDER.forEach(k=>selected.add(k));
    renderCount();
    openDrawer(trigger);
  }

  $('[data-bts10-bag]').addEventListener('click',e=>openDrawer(e.currentTarget));
  $$('[data-bts10-buy-routine]').forEach(btn=>btn.addEventListener('click',()=>buyRoutine(btn)));
  $$('[data-bts10-close]').forEach(btn=>btn.addEventListener('click',closeDrawer));
  drawer.addEventListener('click',e=>{
    const rem=e.target.closest('[data-bts10-remove]');
    if(rem){selected.delete(rem.dataset.bts10Remove);renderCount();buildDrawer();}
    if(e.target.closest('[data-bts10-complete]')){ORDER.forEach(k=>selected.add(k));renderCount();buildDrawer();}
  });

  function openSheet(key,trigger){
    const p=PRODUCTS[key];
    previousFocus=trigger||document.activeElement;
    $('[data-bts10-sheet-role]').textContent=p.role[language];
    $('[data-bts10-sheet-title]').textContent=p.name;
    const img=$('[data-bts10-sheet-image]');img.src=IMG[key];img.alt=p.name;
    $('[data-bts10-sheet-benefit]').textContent=p.benefit[language];
    $('[data-bts10-sheet-formula]').innerHTML=p.formula[language].map(([n,d])=>'<div><strong dir="ltr">'+n+'</strong><p>'+d+'</p></div>').join('');
    const add=$('[data-bts10-sheet-add]');
    add.dataset.bts10SheetAdd=key;
    add.innerHTML=(selected.has(key)?(language==='ar'?'في الشنطة ✓':'In bag ✓'):(language==='ar'?'ضيفيه للشنطة · ':'Add to bag · ')+egp(PRICE[key]));
    $('[data-bts10-inci]').textContent=p.inci;
    $('[data-bts10-inci]').hidden=true;
    $('[data-bts10-inci-toggle]').setAttribute('aria-expanded','false');
    $('[data-bts10-inci-toggle]').lastElementChild.textContent='+';
    sheet.hidden=false;
    document.documentElement.style.overflow='hidden';
    $('[data-bts10-sheet-close]',sheet)?.focus();
  }
  function closeSheet(){
    sheet.hidden=true;
    document.documentElement.style.overflow='';
    previousFocus?.focus?.({preventScroll:true});
    previousFocus=null;
  }

  $$('[data-bts10-detail]').forEach(btn=>btn.addEventListener('click',()=>openSheet(btn.dataset.bts10Detail,btn)));
  $$('[data-bts10-sheet-close]').forEach(btn=>btn.addEventListener('click',closeSheet));
  $('[data-bts10-sheet-add]').addEventListener('click',e=>{
    const key=e.currentTarget.dataset.bts10SheetAdd;
    if(selected.has(key))selected.delete(key);else selected.add(key);
    renderCount();
    e.currentTarget.innerHTML=selected.has(key)?(language==='ar'?'في الشنطة ✓':'In bag ✓'):(language==='ar'?'ضيفيه للشنطة · ':'Add to bag · ')+egp(PRICE[key]);
  });
  $('[data-bts10-inci-toggle]').addEventListener('click',e=>{
    const el=$('[data-bts10-inci]');
    el.hidden=!el.hidden;
    e.currentTarget.setAttribute('aria-expanded',el.hidden?'false':'true');
    e.currentTarget.lastElementChild.textContent=el.hidden?'+':'−';
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

  setLanguage('en');
})();