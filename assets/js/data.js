/* ============================================================================
   WeinBus — Demo data (all dummy). One coherent tenant; white-label switching
   re-skins chrome only. Phones = Jordan (+962 7X). Numbers always Latin.
   ========================================================================== */
window.WB = window.WB || {};
(function (WB) {
  const D = {};

  /* ---- Tenants (white-label demo) ------------------------------------- */
  D.schools = [
    { id: "manhal", brand: "manhal",
      name: { en: "Al-Manhal International School", ar: "مدارس المنهل الدولية" },
      short:{ en: "Al-Manhal", ar: "المنهل" },
      city: { en: "Amman, Jordan", ar: "عمّان، الأردن" } },
    { id: "rawabi", brand: "rawabi",
      name: { en: "Rawabi Modern School", ar: "مدارس روابي الحديثة" },
      short:{ en: "Rawabi", ar: "روابي" },
      city: { en: "Amman, Jordan", ar: "عمّان، الأردن" } },
    { id: "bayan", brand: "bayan",
      name: { en: "Al-Bayan Academy", ar: "أكاديمية البيان" },
      short:{ en: "Al-Bayan", ar: "البيان" },
      city: { en: "Amman, Jordan", ar: "عمّان، الأردن" } }
  ];

  /* ---- Staff ---------------------------------------------------------- */
  D.staff = {
    driver:   { id: "drv1", role: "driver",
      name: { en: "Ahmad Al-Khattab", ar: "أحمد الخطّاب" },
      nick: { en: "Abu Mohammad", ar: "أبو محمد" },
      phone: "+962 79 612 8840", color: "#1E88E5", initials: "AK" },
    chaperone:{ id: "chp1", role: "chaperone", female: true,
      name: { en: "Huda Al-Rashid", ar: "هدى الرشيد" },
      nick: { en: "Miss Huda", ar: "الآنسة هدى" },
      phone: "+962 78 433 2071", color: "#8B7CF6", initials: "HR",
      photo: "assets/img/chaperone.png" }
  };

  /* ---- Students (Route A roster; parent's kids = Lana + Yousef) -------- */
  D.students = [
    { id: "st1", name: { en: "Omar Zaid",     ar: "عمر زيد" },     grade: 4, stop: 1, parent: "p2", color: "#29B6F6", initials: "OZ" },
    { id: "st2", name: { en: "Kareem Odeh",   ar: "كريم عودة" },   grade: 2, stop: 1, parent: "p3", color: "#FB923C", initials: "KO" },
    { id: "st3", name: { en: "Salma Nasser",  ar: "سلمى ناصر" },   grade: 4, stop: 2, parent: "p4", color: "#FF6B6B", initials: "SN" },
    { id: "st4", name: { en: "Lana Haddad",   ar: "لانا الحدّاد" }, grade: 3, stop: 2, parent: "p1", color: "#8B7CF6", initials: "LH", star: true },
    { id: "st5", name: { en: "Yousef Haddad", ar: "يوسف الحدّاد" },grade: 5, stop: 2, parent: "p1", color: "#34D399", initials: "YH", star: true },
    { id: "st6", name: { en: "Tia Mansour",   ar: "تيا منصور" },   grade: 1, stop: 3, parent: "p5", color: "#F472B6", initials: "TM" },
    { id: "st7", name: { en: "Adam Khalil",   ar: "آدم خليل" },    grade: 3, stop: 3, parent: "p6", color: "#10B981", initials: "AK" },
    { id: "st8", name: { en: "Jana Saleh",    ar: "جنى صالح" },    grade: 2, stop: 3, parent: "p7", color: "#FBBF24", initials: "JS" }
  ];

  /* ---- Parents -------------------------------------------------------- */
  D.parents = [
    { id: "p1", name: { en: "Rana Haddad", ar: "رنا الحدّاد" }, phone: "+962 79 555 1234", kids: ["st4", "st5"], initials: "RH", color: "#8B7CF6" },
    { id: "p2", name: { en: "Khaled Zaid", ar: "خالد زيد" },   phone: "+962 79 220 4471", kids: ["st1"], initials: "KZ", color: "#29B6F6" },
    { id: "p3", name: { en: "Mona Odeh",   ar: "منى عودة" },   phone: "+962 78 901 6655", kids: ["st2"], initials: "MO", color: "#FB923C" },
    { id: "p4", name: { en: "Sami Nasser", ar: "سامي ناصر" }, phone: "+962 77 614 2093", kids: ["st3"], initials: "SN", color: "#FF6B6B" },
    { id: "p5", name: { en: "Dina Mansour",ar: "دينا منصور" },phone: "+962 79 845 7120", kids: ["st6"], initials: "DM", color: "#F472B6" },
    { id: "p6", name: { en: "Yazan Khalil",ar: "يزن خليل" },  phone: "+962 78 332 0098", kids: ["st7"], initials: "YK", color: "#10B981" },
    { id: "p7", name: { en: "Lara Saleh",  ar: "لارا صالح" }, phone: "+962 79 770 5512", kids: ["st8"], initials: "LS", color: "#FBBF24" }
  ];

  /* ---- The demo parent / child ---------------------------------------- */
  D.me = { parentId: "p1" };

  /* ---- Routes & stops (Amman). Stop 0 = depot, last = school ----------- */
  D.routeA = {
    id: "routeA",
    name: { en: "Route A · Khalda → Al-Manhal", ar: "المسار A · خلدا ← المنهل" },
    shift: { en: "Morning", ar: "صباحي" },
    bus: 7,
    stops: [
      { i: 0, name: { en: "Khalda Depot",        ar: "مرآب خلدا" },            time: "6:55", kids: [] },
      { i: 1, name: { en: "Tla' Al-Ali",         ar: "تلاع العلي" },          time: "7:06", kids: ["st1", "st2"] },
      { i: 2, name: { en: "University Street",    ar: "شارع الجامعة" },        time: "7:13", kids: ["st3", "st4", "st5"] },
      { i: 3, name: { en: "Gardens · Wasfi Al-Tal", ar: "الجاردنز · وصفي التل" }, time: "7:22", kids: ["st6", "st7", "st8"] },
      { i: 4, name: { en: "Al-Manhal School",     ar: "مدرسة المنهل" },        time: "7:35", kids: [], school: true }
    ]
  };

  /* ---- Today's demo trip ---------------------------------------------- */
  D.trip = {
    id: "am-routeA",
    routeId: "routeA",
    shift: { en: "Morning Trip", ar: "الرحلة الصباحية" },
    date:  { en: "Today", ar: "اليوم" },
    bus: 7,
    plate: "29-44817",
    model: { en: "Mercedes Sprinter", ar: "مرسيدس سبرنتر" },
    driver: D.staff.driver,
    chaperone: D.staff.chaperone,
    capacity: 24,
    /* Accelerated timeline (ms). ~82s = a ~40-min real trip. trip-sim reads this. */
    durationMs: 82000,
    legs: [   /* arriveAt (fraction of duration) per stop index */
      { stop: 0, at: 0.00 },
      { stop: 1, at: 0.16 },
      { stop: 2, at: 0.40 },
      { stop: 3, at: 0.68 },
      { stop: 4, at: 1.00 }
    ]
  };

  /* ---- Fleet (admin) -------------------------------------------------- */
  D.fleet = [
    { no: 7,  model: { en: "Mercedes Sprinter", ar: "مرسيدس سبرنتر" }, plate: "29-44817", cap: 24, route: "A", status: "live",      driver: "Ahmad Al-Khattab", chap: "Huda Al-Rashid" },
    { no: 3,  model: { en: "Toyota Coaster",    ar: "تويوتا كوستر" },  plate: "16-30255", cap: 30, route: "B", status: "live",      driver: "Sameh Owais",      chap: "Rania Daoud" },
    { no: 5,  model: { en: "Hyundai County",    ar: "هيونداي كاونتي" },plate: "22-71190", cap: 27, route: "C", status: "live",      driver: "Fadi Barakat",     chap: "Aseel Hamdan" },
    { no: 12, model: { en: "Toyota Coaster",    ar: "تويوتا كوستر" },  plate: "35-88204", cap: 30, route: "D", status: "completed", driver: "Nidal Suleiman",   chap: "Maya Issa" },
    { no: 9,  model: { en: "Mercedes Sprinter", ar: "مرسيدس سبرنتر" }, plate: "29-50122", cap: 24, route: "E", status: "scheduled", driver: "Tariq Mansour",    chap: "Lina Saadeh" },
    { no: 2,  model: { en: "Hyundai County",    ar: "هيونداي كاونتي" },plate: "22-66031", cap: 27, route: "F", status: "live",      driver: "Bashar Najjar",    chap: "Dana Qasem" },
    { no: 8,  model: { en: "Toyota Coaster",    ar: "تويوتا كوستر" },  plate: "16-41288", cap: 30, route: "G", status: "scheduled", driver: "Omar Haddadin",    chap: "Reem Aql" },
    { no: 4,  model: { en: "Mercedes Sprinter", ar: "مرسيدس سبرنتر" }, plate: "29-33910", cap: 24, route: "—", status: "maintenance",driver: "—",                chap: "—" }
  ];

  /* ---- Admin KPIs (Latin digits) -------------------------------------- */
  D.kpis = {
    buses: 8, activeNow: 5, routes: 12, tripsToday: 24,
    students: 312, parents: 280, onTime: 96, milesToday: 184
  };

  /* ---- Admin: today's trips for live monitor -------------------------- */
  D.todayTrips = [
    { route: "A", bus: 7,  shift:{en:"Morning",ar:"صباحي"}, status: "live",      onboard: 5, total: 8,  progress: 0.0 },
    { route: "B", bus: 3,  shift:{en:"Morning",ar:"صباحي"}, status: "live",      onboard: 18,total: 22, progress: 0.62 },
    { route: "C", bus: 5,  shift:{en:"Morning",ar:"صباحي"}, status: "live",      onboard: 11,total: 19, progress: 0.34 },
    { route: "F", bus: 2,  shift:{en:"Morning",ar:"صباحي"}, status: "live",      onboard: 14,total: 17, progress: 0.78 },
    { route: "D", bus: 12, shift:{en:"Morning",ar:"صباحي"}, status: "completed", onboard: 26,total: 26, progress: 1.0 },
    { route: "E", bus: 9,  shift:{en:"Morning",ar:"صباحي"}, status: "scheduled", onboard: 0, total: 21, progress: 0.0 },
    { route: "G", bus: 8,  shift:{en:"Morning",ar:"صباحي"}, status: "scheduled", onboard: 0, total: 23, progress: 0.0 }
  ];

  /* ---- Notification taxonomy (bilingual templates) -------------------- */
  /* placeholders: {name} {bus} {time} {stop} {eta} {min} */
  D.notif = {
    tripStarted: { icon: "🚌", tone: "info",
      title: { en: "Morning trip started", ar: "بدأت الرحلة الصباحية" },
      msg:   { en: "Bus {bus} has started the morning route — on its way to your stop.",
               ar: "انطلق الباص {bus} في رحلته الصباحية — وهو في طريقه إلى محطتكم." } },
    approaching: { icon: "📍", tone: "warn",
      title: { en: "Bus is approaching", ar: "الباص يقترب" },
      msg:   { en: "Bus {bus} is about {min} minutes from {stop}. Please head out.",
               ar: "الباص {bus} على بُعد {min} دقائق من {stop}. الرجاء التوجّه للمحطة." } },
    boarded: { icon: "✅", tone: "ok",
      title: { en: "{name} boarded the bus", ar: "{name} صعد إلى الباص" },
      msg:   { en: "{name} boarded Bus {bus} at {time}. Have a great day! 👋",
               ar: "صعد {name} إلى الباص {bus} الساعة {time}. نهارك سعيد! 👋" } },
    arrivedSchool: { icon: "🏫", tone: "ok",
      title: { en: "Arrived at school safely", ar: "وصل المدرسة بأمان" },
      msg:   { en: "Bus {bus} has arrived at school. {name} is safely inside. 🎒",
               ar: "وصل الباص {bus} إلى المدرسة. {name} في الداخل بأمان. 🎒" } },
    runningLate: { icon: "⏱️", tone: "warn",
      title: { en: "Running a little late", ar: "تأخّر بسيط" },
      msg:   { en: "Bus {bus} is about {min} min late due to traffic. New ETA: {eta}.",
               ar: "الباص {bus} متأخّر حوالي {min} دقيقة بسبب الازدحام. الوصول المتوقّع: {eta}." } },
    droppedOff: { icon: "🏡", tone: "info",
      title: { en: "{name} dropped off", ar: "تم إنزال {name}" },
      msg:   { en: "{name} was dropped off at {stop} at {time}.",
               ar: "تم إنزال {name} في {stop} الساعة {time}." } },
    noShow: { icon: "⚠️", tone: "danger",
      title: { en: "Child not at the stop", ar: "الطفل غير موجود في المحطة" },
      msg:   { en: "{name} was not at {stop} this morning. Please confirm attendance.",
               ar: "{name} لم يكن في {stop} هذا الصباح. الرجاء تأكيد الحضور." } },
    substitute: { icon: "🔁", tone: "info",
      title: { en: "Substitute bus today", ar: "باص بديل اليوم" },
      msg:   { en: "Today's route is served by Bus {bus} (substitute). Timing unchanged.",
               ar: "سيخدم المسار اليوم الباص {bus} (بديل). المواعيد كما هي." } },
    tripCompleted: { icon: "🎉", tone: "ok",
      title: { en: "Morning route complete", ar: "اكتملت الرحلة الصباحية" },
      msg:   { en: "All students delivered safely. See you this afternoon! 🌟",
               ar: "تم توصيل جميع الطلاب بأمان. نراكم بعد الظهر! 🌟" } }
  };

  /* ---- Accessors ------------------------------------------------------ */
  D.student = (id) => D.students.find((s) => s.id === id);
  D.parent  = (id) => D.parents.find((p) => p.id === id);
  D.kidsOf  = (pid) => (D.parent(pid)?.kids || []).map(D.student);
  D.stopOf  = (sid) => D.routeA.stops.find((s) => s.i === D.student(sid)?.stop);
  D.roster  = () => D.routeA.stops.flatMap((s) => s.kids.map((id) => ({ ...D.student(id), stopName: s.name, stopTime: s.time, stopIndex: s.i })));

  WB.data = D;
})(window.WB);
