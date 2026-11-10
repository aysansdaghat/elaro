
const $ = id => document.getElementById(id);

const fa = value =>
  String(value).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

const money = value =>
  fa(Number(value || 0).toLocaleString("en-US")) + " تومان";

function toast(message) {
  const el = $("toast");
  if (!el) return;

  el.textContent = message;
  el.style.display = "block";

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.style.display = "none", 2800);
}

// مسیر تصویر جایگزین
function imageFallback(img) {
  img.onerror = null;
  const base = document.body.dataset.base || "";
  img.src = base + "assets/images/placeholder.svg";
}

// کارت خدمات
function cardService(service) {
  const base = document.body.dataset.base || "";
  const photo = String(service.image || "").startsWith("data:") || String(service.image || "").startsWith("http") ? service.image : base + "assets/images/" + service.image;

  return `<article class="card service-card">
    <div class="service-image-wrap">
      <img class="card-image" src="${photo}" alt="${service.name}" loading="lazy" onerror="imageFallback(this)">
      <span class="service-category">${service.cat}</span>
    </div>
    <div class="card-body">
      <h3>${service.name}</h3>
      <p>${service.desc}</p>
      <div class="card-meta"><span class="price">${money(service.price)}</span><span class="service-duration">${fa(service.duration)} دقیقه</span></div>
      <div class="service-actions">
        <a class="text-link" href="${base}pages/service-details.html?id=${service.id}">جزئیات خدمت</a>
        <a class="btn btn-small" href="${base}pages/booking.html?service=${service.id}">رزرو</a>
      </div>
    </div>
  </article>`;
}
// کارت پزشکان با مسیر صحیح عکس
function cardDoctor(doctor) {
  const base = document.body.dataset.base || "";
  const photo = String(doctor.image || "").startsWith("data:") || String(doctor.image || "").startsWith("http") ? doctor.image : base + "assets/images/" + doctor.image;

  return `<article class="card">
    <img class="doctor-avatar" src="${photo}" alt="${doctor.name}" onerror="imageFallback(this)">
    <div class="card-body">
      <h3>${doctor.name}</h3>
      <p>${doctor.specialty}</p>
      <div class="doctor-details"><span>✧ ${fa(doctor.experience)} سال تجربه</span><p>${doctor.bio || "ارائه خدمات تخصصی با توجه به نیاز مراجعه‌کننده"}</p><small><b>حوزه فعالیت:</b> ${doctor.focus || ({1:"ارزیابی و مراقبت تخصصی پوست، لیزر",2:"مشاوره زیبایی و مراقبت‌های پوستی",3:"ارزیابی و مراقبت تخصصی مو"}[doctor.id] || doctor.specialty)}</small><small><b>تحصیلات:</b> ${doctor.education || "اطلاعات تکمیلی در حال ثبت"}</small><a class="text-link" href="${base}pages/booking.html">رزرو مشاوره با پزشک</a></div>
    </div>
  </article>`;
}

// ساخت هدر و فوتر
function initLayout() {
  const base = document.body.dataset.base || "";

  const nav = [
    ["index.html", "خانه"],
    ["pages/services.html", "خدمات"],
    ["pages/doctors.html", "پزشکان"],
    ["pages/about.html", "درباره ما"],
    ["pages/contact.html", "تماس با ما"]
  ];

  const path = location.pathname.split("/").pop() || "index.html";

  const header = $("site-header");

  if (header) {
    header.innerHTML = `
      <div class="container nav-wrap">
        <a class="logo" href="${base}index.html">
          <span class="logo-mark">✧</span>ELARO
        </a>

        <button class="menu-toggle" id="menu-toggle"
          aria-label="باز کردن منو" aria-expanded="false">☰</button>

        <nav id="main-nav">
          <ul>
            ${nav.map(([href, label]) =>
              `<li><a class="${path === href.split("/").pop() ? "active" : ""}"
              href="${base + href}">${label}</a></li>`
            ).join("")}

            <li><a href="${base}pages/account.html">پیگیری نوبت</a></li>
          </ul>
        </nav>

        <div class="nav-actions">
          <a class="btn btn-small" href="${base}pages/booking.html">رزرو نوبت</a>
        </div>
      </div>`;

    const toggle = $("menu-toggle");
    const menu = $("main-nav");

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "×" : "☰";
    });
  }

  const footer = $("site-footer");
  const settings = Store.get("settings");

  if (footer) {
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <h3 class="logo">ELARO</h3>
            <p>کلینیک زیبایی، پوست و مو. این وب‌سایت یک نمونه نمایشی برای توسعه و بررسی است.</p>
          </div>

          <div>
            <h4>دسترسی سریع</h4>
            ${nav.map(([h, t]) =>
              `<a href="${base + h}">${t}</a>`
            ).join("")}
            <a href="${base}pages/booking.html">رزرو نوبت</a>
          </div>

          <div>
            <h4>اطلاعات تماس</h4>
            <p>${settings.phone}<br>${settings.address}<br>${settings.hours}</p>
          </div>
        </div>

        <div class="copyright">© ELARO – نسخه آزمایشی و قابل توسعه</div>
      </div>`;
  }
}

// صفحه اصلی
function renderHome() {
  const services = Store.get("services");
  const doctors = Store.get("doctors").filter(d => d.active);

  if ($("home-services")) {
    $("home-services").innerHTML =
      services.slice(0, 3).map(cardService).join("");
  }

  if ($("home-doctors")) {
    $("home-doctors").innerHTML =
      doctors.slice(0, 3).map(cardDoctor).join("");
  }
}

// صفحه خدمات
function renderServices() {
  const root = $("services-list");
  if (!root) return;

  const search = $("service-search");
  const filter = $("service-category");

  function draw() {
    let list = Store.get("services");

    if (filter.value) {
      list = list.filter(s => s.cat === filter.value);
    }

    if (search.value.trim()) {
      list = list.filter(s =>
        (s.name + s.desc + s.cat).toLocaleLowerCase().includes(search.value.trim().toLocaleLowerCase())
      );
    }

    root.innerHTML = list.length
      ? list.map(cardService).join("")
      : '<div class="empty">خدمتی با این مشخصات پیدا نشد.</div>';
  }

  filter.innerHTML =
    '<option value="">همه دسته‌ها</option>' +
    [...new Set(Store.get("services").map(s => s.cat))]
      .map(c => `<option>${c}</option>`).join("");

  search.addEventListener("input", draw);
  filter.addEventListener("change", draw);

  draw();
}

// صفحه پزشکان
function renderDoctors() {
  const root = $("doctors-list");

  if (root) {
    root.innerHTML =
      Store.get("doctors")
        .filter(d => d.active)
        .map(cardDoctor)
        .join("") ||
      '<div class="empty">پزشکی برای نمایش وجود ندارد.</div>';
  }
}

// جزئیات خدمات
function renderDetails() {
  const root = $("service-detail");
  if (!root) return;

  const id = Number(new URLSearchParams(location.search).get("id"));

  const s = Store.get("services").find(x => x.id === id);

  if (!s) {
    root.innerHTML =
      '<div class="empty">خدمت موردنظر پیدا نشد.</div>';
    return;
  }

  const docs = Store.get("doctors")
    .filter(d => d.active && s.doctors.includes(d.id));

  root.innerHTML = `
    <div class="split">
      <img class="rounded-photo" src="${String(s.image||"").startsWith("data:")?s.image:(document.body.dataset.base||"")+"assets/images/"+s.image}" alt="${s.name}" onerror="imageFallback(this)">

      <div>
        <span class="eyebrow">${s.cat}</span>
        <h2>${s.name}</h2>
        <p>${s.desc}</p>
        <p>مدت تقریبی: ${fa(s.duration)} دقیقه</p>
        <p class="price">${money(s.price)}</p>
        <h3>پزشکان ارائه‌دهنده</h3>

        ${docs.map(d =>
          `<p>${d.name} – ${d.specialty}</p>`
        ).join("")}

        <a class="btn" href="booking.html?service=${s.id}">رزرو این خدمت</a>
      </div>
    </div>`;
}

// اجرای توابع پس از بارگذاری صفحه
document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  renderHome();
  renderServices();
  renderDoctors();
  renderDetails();
  initComparisonGallery();
  initRevealAnimations();
  initServiceGallery();
  initReviews();
});

function initComparisonGallery() {
  document.querySelectorAll(".comparison-view").forEach(view => {
    const range = view.querySelector(".comparison-range");
    const before = view.querySelector(".comparison-before-wrap");
    const handle = view.querySelector(".comparison-handle");
    if (!range || !before || !handle) return;
    const update = () => {
      const value = range.value + "%";
      view.style.setProperty("--split", value);
      before.style.clipPath = `inset(0 ${100 - Number(range.value)}% 0 0)`;
      handle.style.right = value;
    };
    range.addEventListener("input", update);
    update();
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll(".section-heading, .service-card, .comparison-card, .gallery-note");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => {
    item.classList.add("reveal");
    observer.observe(item);
  });
}


function initServiceGallery(){
 const root=document.getElementById("service-gallery");if(!root)return;const slides=[...root.querySelectorAll(".gallery-slide")],dots=root.parentElement.querySelector(".gallery-dots");let index=0;
 dots.innerHTML=slides.map((_,i)=>`<button type="button" aria-label="رفتن به تصویر ${i+1}" class="${i===0?"active":""}" data-gallery-dot="${i}"></button>`).join("");
 const show=n=>{index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==index);dots.querySelectorAll("button").forEach((b,i)=>b.classList.toggle("active",i===index));};
 root.querySelector("[data-gallery-prev]").onclick=()=>show(index-1);root.querySelector("[data-gallery-next]").onclick=()=>show(index+1);dots.querySelectorAll("button").forEach(b=>b.onclick=()=>show(Number(b.dataset.galleryDot)));show(0);
}
function initReviews(){
 const root=document.getElementById("reviews-slider");if(!root)return;const reviews=[
 {name:"مراجع الارو",service:"فیشیال پوست",quote:"فضای کلینیک آرام بود و مراحل کار با حوصله برایم توضیح داده شد."},
 {name:"مراجع الارو",service:"مشاوره پوست",quote:"از اینکه قبل از انتخاب خدمات مشاوره گرفتم و پاسخ سؤالاتم را دریافت کردم، راضی بودم."},
 {name:"مراجع الارو",service:"مراقبت مو",quote:"فرایند رزرو ساده بود و برخورد تیم بسیار محترمانه و حرفه‌ای بود."},
 {name:"مراجع الارو",service:"خدمات زیبایی",quote:"تجربه‌ای منظم و دلنشین داشتم؛ از توجه به جزئیات ممنونم."}
 ];let index=0;const card=root.querySelector(".review-card"),dots=root.querySelector(".review-dots");
 const draw=()=>{const r=reviews[index];card.innerHTML=`<div class="review-stars">★★★★★</div><blockquote>«${r.quote}»</blockquote><strong>${r.name}</strong><small>${r.service}</small>`;dots.innerHTML=reviews.map((_,i)=>`<button type="button" class="${i===index?"active":""}" data-review="${i}" aria-label="نظر ${i+1}"></button>`).join("");dots.querySelectorAll("button").forEach(b=>b.onclick=()=>{index=Number(b.dataset.review);draw();});};
 root.querySelector("[data-review-prev]").onclick=()=>{index=(index+reviews.length-1)%reviews.length;draw();};root.querySelector("[data-review-next]").onclick=()=>{index=(index+1)%reviews.length;draw();};draw();
}
