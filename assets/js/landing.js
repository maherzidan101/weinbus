/* ============================================================================
   WeinBus — Marketing / pitch landing (bilingual, JS-rendered)
   ========================================================================== */
(function (WB) {
  const icon = WB.icon, qs = WB.qs, qsa = WB.qsa, pick = WB.pick, brandMark = WB.brandMark;
  const L = (en, ar) => pick({ en, ar });

  function feature(bg, fg, ic, ten, tar, den, dar) {
    return `<div class="feature reveal">
      <div class="feature__ic" style="background:${bg};color:${fg}">${icon(ic, { width: 27, height: 27 })}</div>
      <h3>${L(ten, tar)}</h3><p>${L(den, dar)}</p></div>`;
  }
  function step(n, ic, ten, tar, den, dar) {
    return `<div class="step reveal d${n}"><div class="step__n">${n}</div>
      <div class="feature__ic" style="background:var(--brand-primary-soft);color:var(--brand-primary-deep);margin-top:6px">${icon(ic, { width: 26, height: 26 })}</div>
      <h3 style="font-size:var(--fs-lg);margin-bottom:8px">${L(ten, tar)}</h3><p class="small">${L(den, dar)}</p></div>`;
  }
  function checkItem(ten, tar) {
    return `<div class="row gap2 reveal" style="align-items:flex-start"><span style="color:var(--wb-green-deep);flex:none;margin-top:2px">${icon("checkCircle", { width: 20, height: 20 })}</span><span class="bold small">${L(ten, tar)}</span></div>`;
  }

  function render() {
    const schools = ["manhal", "rawabi", "bayan", "weinbus"];
    qs("#page").innerHTML = `
    <nav class="nav"><div class="nav__in">
      <a class="nav__logo" href="index.html"><span data-brand-logo="38"></span><span data-brand-name>WeinBus</span></a>
      <div class="nav__links">
        <a href="#how">${L("How it works", "كيف يعمل")}</a>
        <a href="#features">${L("Features", "المزايا")}</a>
        <a href="#apps">${L("The apps", "التطبيقات")}</a>
        <a href="#schools">${L("For schools", "للمدارس")}</a>
        <a href="#pricing">${L("Pricing", "الأسعار")}</a>
      </div>
      <div class="nav__cta">
        <div class="seg seg--sm" id="nav-lang"><button data-l="en" class="${WB.lang === "en" ? "active" : ""}">EN</button><button data-l="ar" class="${WB.lang === "ar" ? "active" : ""}">ع</button></div>
        <a class="btn btn--primary btn--sm" href="demo.html">${L("Try live demo", "جرّب العرض")}</a>
      </div>
    </div></nav>

    <header class="hero"><div class="hero__in">
      <div>
        <span class="eyebrow">${icon("pin", { width: 14, height: 14 })} ${L("Live school-bus tracking", "تتبّع باصات المدارس مباشرةً")}</span>
        <h1 style="margin-top:18px">${L("Always know", "اعرف دائماً")} <span class="hl">${L("where the bus is", "وين الباص")}</span> 🚌</h1>
        <p class="hero__sub">${L("WeinBus gives parents the live bus location, arrival alerts and a ping the moment their child boards — and gives your school one calm, branded platform to run it all.", "وين الباص يمنح الأهالي موقع الباص المباشر وتنبيهات الوصول وإشعاراً لحظة صعود طفلهم — ويمنح مدرستك منصة واحدة هادئة بهويتها لإدارة كل ذلك.")}</p>
        <div class="hero__cta">
          <a class="btn btn--primary btn--lg" href="demo.html">${icon("play", { width: 18, height: 18 })} ${L("Try the live demo", "جرّب العرض المباشر")}</a>
          <a class="btn btn--ghost btn--lg" href="#how">${L("See how it works", "شاهد كيف يعمل")}</a>
        </div>
        <div class="row gap5 wrap" style="margin-top:24px;color:var(--ink-3);font-weight:700;font-size:13px">
          <span class="row gap1">${icon("globe", { width: 16, height: 16 })} ${L("Arabic & English", "عربي وإنجليزي")}</span>
          <span class="row gap1">${icon("shield", { width: 16, height: 16 })} ${L("Built for Jordan", "مصمّم للأردن")}</span>
          <span class="row gap1">${icon("sparkles", { width: 16, height: 16 })} ${L("White-label", "بهوية مدرستك")}</span>
        </div>
      </div>
      <div class="hero__art">
        <img class="main" src="assets/img/hero.png" alt="${L("Happy children boarding a WeinBus school bus", "أطفال سعداء يصعدون باص وين الباص")}">
        <div class="hero__float float-1"><div class="notif-ic" style="width:38px;height:38px;font-size:18px;background:var(--wb-green-soft)">✅</div><div><b class="small">${L("Lana boarded", "صعدت لانا")}</b><div class="muted tiny num">7:13 AM · ${L("Bus 7", "الباص 7")}</div></div></div>
        <div class="hero__float float-2"><span class="live-dot"></span><div><b class="small">${L("5 min away", "على بُعد 5 د")}</b><div class="muted tiny">${L("University Street", "شارع الجامعة")}</div></div></div>
        <img class="hero__mascot" src="assets/img/mascot.png" alt="">
      </div>
    </div></header>

    <section class="section section--warm" style="padding-block:54px"><div class="container">
      <div class="statstrip">
        <div class="stat center-text"><div class="stat__num"><span data-count="100" data-suffix="%">0</span></div><div class="stat__label">${L("Trip audit trail", "سجل كامل للرحلات")}</div></div>
        <div class="stat center-text"><div class="stat__num">−<span data-count="25" data-suffix="%">0</span></div><div class="stat__label">${L("Front-gate calls", "اتصالات الباب")}</div></div>
        <div class="stat center-text"><div class="stat__num num">2</div><div class="stat__label">${L("Taps to start a trip", "نقرتان لبدء الرحلة")}</div></div>
        <div class="stat center-text"><div class="stat__num">&lt;<span data-count="30" data-suffix="s">0</span></div><div class="stat__label">${L("Location refresh", "تحديث الموقع")}</div></div>
      </div>
    </div></section>

    <section class="section" id="why"><div class="container center">
      <span class="eyebrow">${L("The morning problem", "مشكلة الصباح")}</span>
      <h2 class="h-sec">${L("Drop-off shouldn’t be a guessing game", "لا يجب أن يكون التوصيل لعبة تخمين")}</h2>
      <p class="sub-sec">${L("Without visibility, parents call the office, the gate gets crowded, and no one truly knows where any bus is right now.", "بدون رؤية واضحة، يتصل الأهالي بالإدارة، ويزدحم الباب، ولا أحد يعرف فعلاً أين الباص الآن.")}</p>
      <div class="grid-3" style="margin-top:42px;text-align:start">
        ${feature("var(--wb-coral-soft)", "var(--wb-coral-deep)", "phone", "Anxious parents", "أهالٍ قلقون", "“Did the bus come yet?” — repeated every single morning, with no easy answer.", "«هل وصل الباص؟» — يتكرّر كل صباح، دون إجابة سهلة.")}
        ${feature("var(--wb-amber-soft)", "#C2410C", "broadcast", "Flooded phone lines", "خطوط هاتف مزدحمة", "One delay turns into 300 WhatsApp messages and a busy front office.", "تأخير واحد يتحوّل إلى 300 رسالة واتساب ومكتب أمامي مشغول.")}
        ${feature("var(--wb-purple-soft)", "#6D5BD0", "shield", "No accountability", "غياب المساءلة", "Paper rosters can’t answer “who was on the bus, and when?”", "كشوف الورق لا تجيب: «من كان على الباص، ومتى؟»")}
      </div>
    </div></section>

    <section class="section section--sky" id="how"><div class="container">
      <div class="center"><span class="eyebrow">${L("How it works", "كيف يعمل")}</span>
        <h2 class="h-sec">${L("Three roles, one connected platform", "ثلاثة أدوار، منصة واحدة متّصلة")}</h2>
        <p class="sub-sec">${L("From the school office to the bus to the parent’s phone — every step stays in sync.", "من إدارة المدرسة إلى الباص إلى هاتف ولي الأمر — كل خطوة تبقى متزامنة.")}</p></div>
      <div class="grid-3" style="margin-top:54px">
        ${step(1, "building", "The school sets it up", "المدرسة تجهّز كل شيء", "Add buses, routes, stops, students and parents in the console — assign a driver and a female chaperone per bus.", "أضِف الباصات والمسارات والمحطات والطلاب والأهالي في اللوحة — وعيّن سائقاً ومرافِقة لكل باص.")}
        ${step(2, "bus", "The chaperone drives", "المرافِقة تدير الرحلة", "One tap to start the trip. Location streams live; tap or scan a QR wristband as each child boards.", "نقرة واحدة لبدء الرحلة. يُبثّ الموقع مباشرةً؛ سجّل صعود كل طفل بنقرة أو بمسح سوار QR.")}
        ${step(3, "heart", "Parents follow along", "الأهالي يتابعون", "A live map, a countdown to their stop, and a friendly ping the moment their child is safely on board.", "خريطة مباشرة، وعدّاد حتى محطتهم، وإشعار لطيف لحظة صعود طفلهم بأمان.")}
      </div>
    </div></section>

    <section class="section" id="features"><div class="container">
      <div class="center"><span class="eyebrow">${L("Features", "المزايا")}</span>
        <h2 class="h-sec">${L("Everything a safe ride needs", "كل ما تحتاجه رحلة آمنة")}</h2></div>
      <div class="grid-4" style="margin-top:46px">
        ${feature("var(--wb-blue-soft)", "var(--wb-blue-deep)", "map", "Live GPS map", "خريطة مباشرة", "Watch the bus move along its route in real time.", "تابع الباص يتحرّك على مساره لحظة بلحظة.")}
        ${feature("var(--wb-amber-soft)", "#C2410C", "pin", "Smart arrival alerts", "تنبيهات وصول ذكية", "“Bus is 5 minutes away” geofenced to each stop.", "«الباص على بُعد 5 دقائق» محدّدة لكل محطة.")}
        ${feature("var(--wb-green-soft)", "var(--wb-green-deep)", "qr", "Boarding check-in", "تسجيل الصعود", "Tap or scan a QR wristband — parents get the exact time.", "نقرة أو مسح سوار QR — يصل الأهالي الوقت بدقّة.")}
        ${feature("var(--wb-purple-soft)", "#6D5BD0", "users", "Multi-child", "أكثر من طفل", "One account follows every child across buses and shifts.", "حساب واحد يتابع كل طفل عبر الباصات والفترات.")}
        ${feature("var(--brand-primary-soft)", "var(--brand-primary-deep)", "sparkles", "White-label", "بهوية مدرستك", "Your logo, colors and private subdomain.", "شعارك وألوانك ونطاقك الفرعي الخاص.")}
        ${feature("var(--wb-blue-soft)", "var(--wb-blue-deep)", "globe", "Arabic & English", "عربي وإنجليزي", "Full right-to-left support, numbers stay Latin.", "دعم كامل للكتابة من اليمين، والأرقام تبقى لاتينية.")}
        ${feature("var(--wb-green-soft)", "var(--wb-green-deep)", "shield", "Trip audit trail", "سجل تدقيق كامل", "Every boarding and drop-off, timestamped and stored.", "كل صعود ونزول، موثّق بالوقت ومحفوظ.")}
        ${feature("var(--wb-coral-soft)", "var(--wb-coral-deep)", "broadcast", "Broadcasts & SOS", "تعميمات وطوارئ", "Send one notice to all parents; drivers get an SOS button.", "أرسل إشعاراً واحداً لكل الأهالي؛ وللسائقين زر طوارئ.")}
      </div>
    </div></section>

    <section class="section section--warm" id="apps"><div class="container">
      <div class="center"><span class="eyebrow">${L("The apps", "التطبيقات")}</span>
        <h2 class="h-sec">${L("One platform, three experiences", "منصة واحدة، ثلاث تجارب")}</h2>
        <p class="sub-sec">${L("Open any of them — they’re fully interactive demos.", "افتح أيّاً منها — جميعها نماذج تفاعلية بالكامل.")}</p></div>
      <div class="appshow" style="margin-top:46px">
        <a class="appshow__card reveal" href="parent.html" style="background:linear-gradient(150deg,#34B6F6,#1E88E5)">
          <span class="em">👨‍👩‍👧</span><h3 style="color:#fff;font-size:var(--fs-xl)">${L("Parent app", "تطبيق ولي الأمر")}</h3>
          <p style="color:rgba(255,255,255,.92);font-size:var(--fs-sm)">${L("Live map, ETA, boarding alerts and trip history.", "خريطة مباشرة، وقت الوصول، تنبيهات الصعود وسجل الرحلات.")}</p>
          <span class="btn btn--ghost btn--sm" style="margin-top:14px;width:fit-content">${L("Open", "افتح")} ${icon("chevronR", { width: 15, height: 15 })}</span></a>
        <a class="appshow__card reveal d2" href="chaperone.html" style="background:linear-gradient(150deg,#3DDC91,#10B981)">
          <span class="em">🚌</span><h3 style="color:#fff;font-size:var(--fs-xl)">${L("Chaperone app", "تطبيق المرافِقة")}</h3>
          <p style="color:rgba(255,255,255,.92);font-size:var(--fs-sm)">${L("Start the trip, check students in, stream location.", "ابدأ الرحلة، سجّل صعود الطلاب، وابثّ الموقع.")}</p>
          <span class="btn btn--ghost btn--sm" style="margin-top:14px;width:fit-content">${L("Open", "افتح")} ${icon("chevronR", { width: 15, height: 15 })}</span></a>
        <a class="appshow__card reveal d3" href="admin.html" style="background:linear-gradient(150deg,#8B7CF6,#5849C4)">
          <span class="em">🏫</span><h3 style="color:#fff;font-size:var(--fs-xl)">${L("School Console", "لوحة المدرسة")}</h3>
          <p style="color:rgba(255,255,255,.92);font-size:var(--fs-sm)">${L("Fleet, routes, students, live monitor & branding.", "الأسطول، المسارات، الطلاب، المراقبة المباشرة والهوية.")}</p>
          <span class="btn btn--ghost btn--sm" style="margin-top:14px;width:fit-content">${L("Open", "افتح")} ${icon("chevronR", { width: 15, height: 15 })}</span></a>
      </div>
      <div class="center" style="margin-top:34px"><a class="btn btn--primary btn--lg pulse-btn" href="demo.html">${icon("play", { width: 18, height: 18 })} ${L("See them sync in the live demo", "شاهدها تتزامن في العرض المباشر")}</a></div>
    </div></section>

    <section class="section" id="schools"><div class="container">
      <div class="grid-2" style="align-items:center;gap:44px">
        <div class="reveal">
          <span class="eyebrow">${L("White-label SaaS", "منصة بهويتك")}</span>
          <h2 class="h-sec">${L("Your school. Your app.", "مدرستك. تطبيقك.")}</h2>
          <p class="sub-sec" style="margin-bottom:20px">${L("WeinBus runs quietly underneath. Parents download an app that looks and feels entirely like your school — your logo, your colors, your subdomain.", "يعمل وين الباص بهدوء في الخلفية. يحمّل الأهالي تطبيقاً يبدو ويشعر وكأنه مدرستك بالكامل — شعارك، ألوانك، نطاقك الفرعي.")}</p>
          <div class="stack gap3">
            ${checkItem("Your logo, colors & app icon", "شعارك وألوانك وأيقونة تطبيقك")}
            ${checkItem("A private subdomain, e.g. al-manhal.weinbus.app", "نطاق فرعي خاص، مثل al-manhal.weinbus.app")}
            ${checkItem("Each school is a fully isolated workspace", "كل مدرسة مساحة عمل معزولة بالكامل")}
          </div>
          <a class="btn btn--soft btn--lg" style="margin-top:24px" href="admin.html#branding">${L("See branding live", "شاهد الهوية مباشرةً")} ${icon("chevronR", { width: 16, height: 16 })}</a>
        </div>
        <div class="reveal d2 stack gap3">
          ${schools.map((id) => { const t = WB.themes[id]; const sl = t.short.en.toLowerCase().replace(/[^a-z]+/g, "-"); return `<div class="card row gap3" style="padding:16px;align-items:center">${brandMark(id, 44)}
            <div class="grow"><b>${pick(t.name)}</b><div class="muted small num">${sl}.weinbus.app</div></div>
            <div class="row gap1"><span class="swatch" style="background:${t.vars["--brand-primary"]}"></span><span class="swatch" style="background:${t.vars["--brand-secondary"]}"></span></div></div>`; }).join("")}
        </div>
      </div>
    </div></section>

    <section class="section section--sky"><div class="container">
      <div class="center"><span class="eyebrow">🇯🇴 ${L("Made for Jordan", "مصمّم للأردن")}</span>
        <h2 class="h-sec">${L("Local by design, not translated later", "محلّي بالتصميم، لا مترجَم لاحقاً")}</h2></div>
      <div class="grid-3" style="margin-top:38px;gap:16px 40px">
        ${checkItem("Arabic & English with full right-to-left layout", "عربي وإنجليزي مع تخطيط كامل من اليمين لليسار")}
        ${checkItem("Numbers always in Latin digits (0–9)", "الأرقام دائماً لاتينية (0–9)")}
        ${checkItem("Jordanian phone format (+962 7X)", "صيغة الهاتف الأردني (+962 7X)")}
        ${checkItem("Separate driver & female chaperone roles", "أدوار منفصلة للسائق والمرافِقة")}
        ${checkItem("Data stored in-region (Amman)", "البيانات مخزّنة داخل المنطقة (عمّان)")}
        ${checkItem("AM/PM split shifts & Ramadan schedules", "فترات صباحية/مسائية ومواعيد رمضان")}
      </div>
    </div></section>

    <section class="section" id="pricing"><div class="container">
      <div class="center"><span class="eyebrow">${L("Pricing", "الأسعار")}</span>
        <h2 class="h-sec">${L("Simple, per student", "بسيطة، لكل طالب")}</h2>
        <p class="sub-sec">${L("Illustrative demo pricing in Jordanian Dinar, per student, per year.", "أسعار توضيحية بالدينار الأردني، لكل طالب، سنوياً.")}</p></div>
      <div class="grid-3" style="margin-top:44px;align-items:stretch">
        ${priceCard(false, "Starter", "المبتدئة", "9", "Small schools getting started", "للمدارس الصغيرة في بدايتها", ["Live tracking & parent app", "Boarding check-in", "1 brand workspace"], ["التتبّع المباشر وتطبيق الأهل", "تسجيل الصعود", "مساحة هوية واحدة"])}
        ${priceCard(true, "School", "المدرسة", "14", "Most popular for private schools", "الأكثر شيوعاً للمدارس الخاصة", ["Everything in Starter", "White-label subdomain", "Attendance & reports", "WhatsApp broadcasts"], ["كل ما في المبتدئة", "نطاق فرعي بهويتك", "الحضور والتقارير", "تعميمات واتساب"])}
        ${priceCard(false, "District", "الإقليمية", "—", "Multi-campus groups", "لمجموعات متعدّدة الفروع", ["Everything in School", "Multi-campus & SSO", "Data residency options", "Priority support"], ["كل ما في المدرسة", "فروع متعددة ودخول موحّد", "خيارات إقامة البيانات", "دعم ذو أولوية"])}
      </div>
    </div></section>

    <section class="section"><div class="container"><div class="cta-band reveal">
      <img src="assets/img/mascot.png" alt="" style="width:84px;margin:0 auto 14px;filter:drop-shadow(0 10px 16px rgba(32,48,74,.2))">
      <h2>${L("Bring WeinBus to your school", "أحضِر وين الباص إلى مدرستك")}</h2>
      <p style="color:var(--brand-on-primary);opacity:.92;font-size:var(--fs-lg);max-width:50ch;margin:12px auto 0">${L("Give every parent peace of mind — and your office a quieter morning.", "امنح كل أب وأم راحة البال — ومكتبك صباحاً أهدأ.")}</p>
      <div class="row gap3 center" style="margin-top:26px;flex-wrap:wrap">
        <a class="btn btn--dark btn--lg" href="mailto:hello@weinbus.app?subject=WeinBus%20demo">${icon("message", { width: 18, height: 18 })} ${L("Book a live demo", "احجز عرضاً مباشراً")}</a>
        <a class="btn btn--ghost btn--lg" href="demo.html">${L("Open the demo", "افتح العرض")}</a>
      </div>
    </div></div></section>

    <footer class="footer"><div class="container">
      <div class="footer__grid">
        <div><div class="row gap2" style="margin-bottom:12px">${brandMark("weinbus", 38)}<b style="color:#fff;font-size:var(--fs-lg)">WeinBus</b></div>
          <p style="color:#9fb0cc;font-size:var(--fs-sm);max-width:30ch">${L("Always know where the bus is.", "اعرف دائماً وين الباص.")}</p>
          <div class="row gap1" style="margin-top:14px;color:#9fb0cc;font-weight:700;font-size:13px">${L("Made with care in Amman", "صُنع بعناية في عمّان")} 🇯🇴</div></div>
        <div><b style="color:#fff;display:block;margin-bottom:12px">${L("Product", "المنتج")}</b>
          <div class="stack gap2 small"><a href="#features">${L("Features", "المزايا")}</a><a href="#how">${L("How it works", "كيف يعمل")}</a><a href="#pricing">${L("Pricing", "الأسعار")}</a><a href="demo.html">${L("Live demo", "العرض المباشر")}</a></div></div>
        <div><b style="color:#fff;display:block;margin-bottom:12px">${L("Apps", "التطبيقات")}</b>
          <div class="stack gap2 small"><a href="parent.html">${L("Parent app", "تطبيق ولي الأمر")}</a><a href="chaperone.html">${L("Chaperone app", "تطبيق المرافِقة")}</a><a href="admin.html">${L("School Console", "لوحة المدرسة")}</a></div></div>
        <div><b style="color:#fff;display:block;margin-bottom:12px">${L("Language", "اللغة")}</b>
          <div class="seg seg--sm" id="foot-lang" style="background:#26324c"><button data-l="en" class="${WB.lang === "en" ? "active" : ""}" style="color:#cbd5e8">English</button><button data-l="ar" class="${WB.lang === "ar" ? "active" : ""}" style="color:#cbd5e8">العربية</button></div></div>
      </div>
      <div class="row between wrap" style="margin-top:34px;padding-top:20px;border-top:1px solid #2a3650;color:#7d8db0;font-size:13px">
        <span>© 2026 WeinBus · ${L("Concept demo", "عرض تجريبي")}</span>
        <span class="num">weinbus.euro52.com</span>
      </div>
    </div></footer>`;

    WB.applyBrandDom(qs("#page"));
    qsa("#nav-lang button, #foot-lang button").forEach((b) => b.addEventListener("click", () => WB.setLang(b.getAttribute("data-l"))));
    WB.initReveal(); WB.initCount();
  }

  function priceCard(hot, ten, tar, amt, sen, sar, fen, far) {
    const feats = fen.map((f, i) => `<li>${icon("check", { width: 16, height: 16, class: "" })}<span>${pick({ en: f, ar: far[i] })}</span></li>`).join("");
    return `<div class="price ${hot ? "price--hot" : ""} reveal">
      ${hot ? `<span class="badge badge--brand" style="align-self:flex-start;margin-bottom:8px">${L("Most popular", "الأكثر شيوعاً")}</span>` : ""}
      <b style="font-size:var(--fs-lg)">${L(ten, tar)}</b><p class="small" style="margin:4px 0 14px">${L(sen, sar)}</p>
      <div class="row" style="align-items:baseline;gap:6px"><span class="muted small">${amt === "—" ? "" : "JOD"}</span><span class="price__amt">${amt === "—" ? L("Custom", "حسب الطلب") : `<span class="num">${amt}</span>`}</span>${amt === "—" ? "" : `<span class="muted small">/${L("student / yr", "طالب / سنة")}</span>`}</div>
      <ul style="margin:16px 0 20px">${feats}</ul>
      <a class="btn ${hot ? "btn--primary" : "btn--ghost"} btn--block" style="margin-top:auto" href="demo.html">${L("Start free demo", "ابدأ العرض المجاني")}</a></div>`;
  }

  WB.onLang(render);
  function init() { WB.setBrand("weinbus"); render(); }
  if (document.readyState !== "loading") init(); else document.addEventListener("DOMContentLoaded", init);
})(window.WB);
