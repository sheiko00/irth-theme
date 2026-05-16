
/* ——— Loader ——— */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('gone'), 1500);
});

/* ——— Cursor (legacy — replaced by magnetic cursor system) ——— */
// cursorDot / cursorRing handled by initCursor() IIFE below

/* ——— Nav scrolled ——— */
const nav = document.getElementById('topnav');
window.addEventListener('scroll', ()=> nav.classList.toggle('scrolled', window.scrollY > 60));

/* ——— Reveal on scroll ——— */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
}, {threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ——— Hero parallax dunes + sun ——— */
const dunes = document.querySelectorAll('.hero [data-parallax]');
const sun = document.querySelector('.hero .sun');
const heroLogo = document.querySelector('.hero .logo-wrap');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > window.innerHeight * 1.2) return;
  dunes.forEach(d => {
    const s = parseFloat(d.dataset.parallax);
    d.style.transform = `translateY(${y*s}px)`;
  });
  if (sun) sun.style.transform = `translate(-50%, calc(50% + ${y*0.4}px)) scale(${1 + y*0.0006})`;
  if (heroLogo) heroLogo.style.transform = `translateY(${y*0.18}px)`;
});

/* ——— Sand particles ——— */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W,H,particles=[];
function resize(){
  W = canvas.width = canvas.offsetWidth * devicePixelRatio;
  H = canvas.height = canvas.offsetHeight * devicePixelRatio;
}
function makeParticles(){
  particles = [];
  const count = Math.min(140, Math.floor((canvas.offsetWidth*canvas.offsetHeight)/9000));
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: (Math.random()*1.6 + 0.3) * devicePixelRatio,
      vx: (Math.random()*0.4 + 0.15) * devicePixelRatio,
      vy: (Math.random()*0.2 - 0.1) * devicePixelRatio,
      a: Math.random()*0.5 + 0.15,
      tw: Math.random()*0.02 + 0.005
    });
  }
}
function draw(t){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{
    p.x += p.vx; p.y += p.vy + Math.sin((t+p.x)*0.001)*0.2;
    p.a += (Math.random()-.5)*p.tw;
    p.a = Math.max(0.05, Math.min(0.65, p.a));
    if (p.x > W+10) p.x = -10;
    if (p.y > H+10) p.y = -10;
    if (p.y < -10) p.y = H+10;
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*4);
    grd.addColorStop(0, `rgba(231,201,138,${p.a})`);
    grd.addColorStop(1, 'rgba(231,201,138,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r*4, 0, Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
resize(); makeParticles();
window.addEventListener('resize', ()=>{resize();makeParticles();});
requestAnimationFrame(draw);

/* ——— Slow-play the caravan video for cinematic feel ——— */
const caravanVideo = document.getElementById('caravanVideo');
if (caravanVideo){
  caravanVideo.playbackRate = 0.45; // ~45% speed
  caravanVideo.addEventListener('loadedmetadata', () => { caravanVideo.playbackRate = 0.45; });
}


/* ——— Collections switcher (click → filter shop + scroll) ——— */
const items = document.querySelectorAll('.col-item');
const panels = document.querySelectorAll('.col-panel');
const colName = document.getElementById('colName');
const colPrice = document.getElementById('colPrice');
const enColData = [
  {name:'DATES & CONFECTIONS', price:'from 280 EGP'},
  {name:'HONEY & SIDR',        price:'from 350 EGP'},
  {name:'INCENSE & FRAGRANCE', price:'from 280 EGP'},
  {name:'SPIRITUAL HEIRLOOMS', price:'from 280 EGP'},
];
const arColData = [
  {name:'التمور والحلوى',           price:'من ٢٨٠ ج.م'},
  {name:'العسل والسدر',             price:'من ٣٥٠ ج.م'},
  {name:'البخور والعطور',           price:'من ٢٨٠ ج.م'},
  {name:'الأكسسوارات الروحية',      price:'من ٢٨٠ ج.م'},
];
function setActiveCollection(i){
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const data = lang === 'ar' ? arColData : enColData;
  items.forEach(x=>x.classList.remove('active'));
  panels.forEach(x=>x.classList.remove('active'));
  if (items[i]) items[i].classList.add('active');
  if (panels[i]) panels[i].classList.add('active');
  if (colName) colName.textContent = data[i].name;
  if (colPrice) colPrice.textContent = data[i].price;
}
items.forEach(it=>{
  it.addEventListener('mouseenter', ()=> setActiveCollection(+it.dataset.idx));
  it.addEventListener('click', ()=>{
    const target = it.dataset.target;
    if (!target) return;
    // activate matching filter
    document.querySelectorAll('.shop-filters .filter').forEach(b => b.classList.toggle('active', b.dataset.filter === target));
    renderShop(target);
    document.getElementById('shop').scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* ——— Ritual parallax background ——— */
const ritualBg = document.getElementById('ritualBg');
const ritualSec = document.getElementById('ritual');
window.addEventListener('scroll', ()=>{
  const r = ritualSec.getBoundingClientRect();
  if (r.bottom < 0 || r.top > window.innerHeight) return;
  const p = 1 - (r.top + r.height/2) / window.innerHeight; // 0 → 1 across viewport
  ritualBg.style.transform = `scale(${1.15 + p*0.08}) translateY(${p*-30}px)`;
});

/* ——— Gift box mouse parallax ——— */
const giftStage = document.getElementById('giftStage');
const giftObj = document.getElementById('giftObject');
giftStage.addEventListener('mousemove', e=>{
  const r = giftStage.getBoundingClientRect();
  const x = (e.clientX - r.left)/r.width - .5;
  const y = (e.clientY - r.top)/r.height - .5;
  giftObj.style.animationPlayState='paused';
  giftObj.style.transform = `rotateX(${-18 + y*-30}deg) rotateY(${x*60}deg)`;
});
giftStage.addEventListener('mouseleave', ()=>{
  giftObj.style.animationPlayState='running';
  giftObj.style.transform = '';
});

/* ——— Audio toggle ——— */
const audio = document.getElementById('audio');
const audioLabel = document.getElementById('audioLabel');
const ambientAudio = document.getElementById('ambientAudio');
audio.addEventListener('click', () => {
  audio.classList.toggle('muted');
  const muted = audio.classList.contains('muted');
  const lang = document.documentElement.getAttribute('lang') || 'en';
  audioLabel.setAttribute('data-i18n', muted ? 'audio.off' : 'audio.on');
  audioLabel.textContent = translations[lang] ? translations[lang][muted ? 'audio.off' : 'audio.on'] : (muted ? 'AMBIENT · OFF' : 'AMBIENT · ON');
  if (ambientAudio) {
    if (muted) { ambientAudio.pause(); }
    else { ambientAudio.volume = 0.18; ambientAudio.play().catch(()=>{}); }
  }
});

/* ——— Shop / Cart / Products ——— */

/* ——— SVG packaging illustration generator ———
   Each non-photo product renders as a luxury matte-black package label
   with the IRTH arch emblem, Arabic + Latin name, weight tag, and origin tag.
   Silhouettes vary subtly by 'shape' to differentiate vessel types. */
const CATEGORY_TONE = {
  dates:     { bg1:'#221608', bg2:'#0a0604', accent:'#C9A86A', warm:'#8a6238' },
  honey:     { bg1:'#2c1d0a', bg2:'#0c0704', accent:'#E2B26A', warm:'#a87a3a' },
  spices:    { bg1:'#1f1608', bg2:'#0a0604', accent:'#C9A86A', warm:'#8a6238' },
  fragrance: { bg1:'#161412', bg2:'#080608', accent:'#C9A86A', warm:'#6a5a3a' },
  spiritual: { bg1:'#0e2b22', bg2:'#0a1410', accent:'#C9A86A', warm:'#7ea092' },
  gifts:     { bg1:'#1a1208', bg2:'#08060c', accent:'#E7C98A', warm:'#C9A86A' },
};

function shapeSilhouette(shape){
  const a = '#C9A86A';
  switch(shape){
    case 'box': // rectangular gift box with thin lid line
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <rect x="135" y="205" width="130" height="170"/>
        <line x1="135" y1="235" x2="265" y2="235"/>
        <line x1="190" y1="205" x2="190" y2="235"/>
        <line x1="210" y1="205" x2="210" y2="235"/>
        <rect x="195" y="217" width="10" height="6"/>
      </g>`;
    case 'box-wood': // wooden box with grain lines + clasp
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <rect x="130" y="210" width="140" height="160"/>
        <line x1="130" y1="240" x2="270" y2="240"/>
        <line x1="195" y1="210" x2="195" y2="240"/>
        <line x1="205" y1="210" x2="205" y2="240"/>
        <rect x="197" y="222" width="6" height="8"/>
        <line x1="142" y1="252" x2="142" y2="365" opacity="0.4"/>
        <line x1="258" y1="252" x2="258" y2="365" opacity="0.4"/>
      </g>`;
    case 'jar': // apothecary jar
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <path d="M173 200 L173 188 Q173 180 181 180 L219 180 Q227 180 227 188 L227 200 Q244 218 244 254 L244 350 Q244 370 224 370 L176 370 Q156 370 156 350 L156 254 Q156 218 173 200 Z"/>
        <line x1="165" y1="218" x2="235" y2="218"/>
        <rect x="170" y="250" width="60" height="80" opacity="0.55"/>
      </g>`;
    case 'bottle': // tall slim fragrance bottle
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <rect x="187" y="180" width="26" height="22"/>
        <path d="M190 202 L190 218 Q170 226 170 250 L170 358 Q170 374 186 374 L214 374 Q230 374 230 358 L230 250 Q230 226 210 218 L210 202 Z"/>
        <rect x="175" y="260" width="50" height="80" opacity="0.55"/>
      </g>`;
    case 'tin': // round metal tin (cylinder)
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <ellipse cx="200" cy="220" rx="72" ry="14"/>
        <line x1="128" y1="220" x2="128" y2="350"/>
        <line x1="272" y1="220" x2="272" y2="350"/>
        <ellipse cx="200" cy="350" rx="72" ry="14"/>
        <rect x="140" y="248" width="120" height="80" opacity="0.55"/>
      </g>`;
    case 'pouch': // soft kraft pouch with folded top
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <path d="M155 200 L245 200 L235 215 L240 230 L242 360 L158 360 L160 230 L165 215 Z"/>
        <line x1="155" y1="218" x2="245" y2="218"/>
        <rect x="172" y="248" width="56" height="80" opacity="0.55"/>
      </g>`;
    case 'vial': // small precious vial (saffron, musk)
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <rect x="190" y="200" width="20" height="14"/>
        <path d="M188 214 L188 360 Q188 372 200 372 Q212 372 212 360 L212 214 Z"/>
        <rect x="186" y="270" width="28" height="60" opacity="0.55"/>
      </g>`;
    case 'beads': // misbaha arc of 11 dots
      return `<g opacity="0.5" fill="${a}">
        ${Array.from({length:11},(_,i)=>{
          const t = i/10;
          const x = 130 + 140 * t;
          const y = 290 + Math.sin(Math.PI * t) * -60;
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i===0||i===10?6:7}"/>`;
        }).join('')}
        <path d="M130 290 Q200 195 270 290" fill="none" stroke="${a}" stroke-width="0.4" opacity="0.5"/>
        <line x1="200" y1="226" x2="200" y2="262" stroke="${a}" stroke-width="0.6" opacity="0.6"/>
        <path d="M193 262 L207 262 L200 280 Z" fill="none" stroke="${a}" stroke-width="0.6" opacity="0.6"/>
      </g>`;
    case 'rug': // rolled rug silhouette with binding ribbon
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <rect x="120" y="260" width="160" height="50" rx="25"/>
        <line x1="200" y1="260" x2="200" y2="310"/>
        <rect x="192" y="255" width="16" height="60" opacity="0.6"/>
        <circle cx="140" cy="285" r="4"/>
        <circle cx="260" cy="285" r="4"/>
      </g>`;
    case 'plate': // wooden box with siwak sticks
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <rect x="125" y="240" width="150" height="110"/>
        <line x1="140" y1="270" x2="260" y2="270" opacity="0.6"/>
        <line x1="155" y1="290" x2="245" y2="290" opacity="0.6"/>
        <line x1="170" y1="310" x2="230" y2="310" opacity="0.6"/>
      </g>`;
    case 'stand': // X-shaped folding quran stand
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1.2">
        <line x1="150" y1="220" x2="250" y2="370"/>
        <line x1="250" y1="220" x2="150" y2="370"/>
        <line x1="150" y1="220" x2="250" y2="220"/>
        <line x1="150" y1="370" x2="250" y2="370"/>
        <rect x="172" y="250" width="56" height="40" opacity="0.5"/>
      </g>`;
    case 'vessel': // engraved vessel for zamzam
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <path d="M165 220 Q165 200 200 200 Q235 200 235 220 L235 350 Q235 372 215 372 L185 372 Q165 372 165 350 Z"/>
        <line x1="165" y1="232" x2="235" y2="232"/>
        <line x1="165" y1="350" x2="235" y2="350"/>
        <path d="M188 260 Q200 248 212 260 Q200 280 188 260 Z" opacity="0.6"/>
      </g>`;
    case 'object': // brass burner — bulbous incense burner
      return `<g opacity="0.42" fill="none" stroke="${a}" stroke-width="1">
        <ellipse cx="200" cy="340" rx="60" ry="15"/>
        <path d="M140 340 Q140 280 200 280 Q260 280 260 340"/>
        <ellipse cx="200" cy="280" rx="40" ry="10"/>
        <path d="M165 280 Q165 240 200 235 Q235 240 235 280"/>
        <circle cx="200" cy="220" r="6"/>
        <path d="M194 200 Q194 192 200 192 Q206 192 206 200 L206 215 Q200 220 194 215 Z"/>
      </g>`;
    default: return '';
  }
}

function archEmblem(){
  // Stylised abstraction of the IRTH arch+diamond mark for the top of every label.
  return `<g transform="translate(200,82)">
    <path d="M -22 18 L -22 -8 Q -22 -28 0 -28 Q 22 -28 22 -8 L 22 18 Z" fill="none" stroke="#C9A86A" stroke-width="1.4"/>
    <g fill="#C9A86A">
      <rect x="-7" y="-15" width="6" height="6" transform="rotate(20 -4 -12)"/>
      <rect x="1" y="-15" width="6" height="6" transform="rotate(-20 4 -12)"/>
      <rect x="-3" y="-7" width="6" height="6" transform="rotate(20 0 -4)"/>
    </g>
    <line x1="-46" y1="22" x2="-26" y2="22" stroke="#C9A86A" stroke-width="0.6"/>
    <line x1="26"  y1="22" x2="46"  y2="22" stroke="#C9A86A" stroke-width="0.6"/>
  </g>`;
}

function escSvg(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function productSVG(p){
  const tone = CATEGORY_TONE[p.cat] || CATEGORY_TONE.gifts;
  const arName = escSvg(p.nameAr || '');
  const enName = escSvg((p.nameShort || p.name || '').toUpperCase());
  const origin = escSvg((p.origin || '').toUpperCase());
  const weight = escSvg((p.weight || '').toUpperCase());
  // Truncate long EN names for the label
  const enDisplay = enName.length > 28 ? enName.slice(0,26) + '…' : enName;
  const ar = '‏'; // RTL mark
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="bg-${p.id}" cx="50%" cy="55%" r="70%">
        <stop offset="0%" stop-color="${tone.bg1}"/>
        <stop offset="100%" stop-color="${tone.bg2}"/>
      </radialGradient>
      <linearGradient id="vig-${p.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
      </linearGradient>
      <pattern id="grain-${p.id}" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
        <rect width="3" height="3" fill="rgba(255,255,255,0)"/>
        <rect width="1" height="1" fill="rgba(255,240,200,0.025)"/>
      </pattern>
    </defs>
    <rect width="400" height="500" fill="url(#bg-${p.id})"/>
    <rect width="400" height="500" fill="url(#grain-${p.id})"/>
    <rect width="400" height="500" fill="url(#vig-${p.id})"/>
    <!-- inset frame -->
    <rect x="24" y="24" width="352" height="452" fill="none" stroke="#C9A86A" stroke-width="0.6" opacity="0.45"/>
    <rect x="28" y="28" width="344" height="444" fill="none" stroke="#C9A86A" stroke-width="0.3" opacity="0.3"/>
    <!-- corner ornaments -->
    <g stroke="#C9A86A" stroke-width="0.7" fill="none" opacity="0.55">
      <path d="M40 40 L52 40 M40 40 L40 52"/>
      <path d="M360 40 L348 40 M360 40 L360 52"/>
      <path d="M40 460 L52 460 M40 460 L40 448"/>
      <path d="M360 460 L348 460 M360 460 L360 448"/>
    </g>
    <!-- arch emblem -->
    ${archEmblem()}
    <!-- house line -->
    <text x="200" y="132" text-anchor="middle" fill="#C9A86A" font-family="Cinzel,serif" font-size="9" letter-spacing="4" opacity="0.85">IRTH · MADINAH</text>
    <!-- silhouette -->
    ${shapeSilhouette(p.shape)}
    <!-- Arabic name -->
    <text x="200" y="412" text-anchor="middle" direction="rtl" fill="#E7C98A" font-family="'Cairo','Amiri',sans-serif" font-size="22" font-weight="400">${ar}${arName}</text>
    <!-- English short name -->
    <text x="200" y="434" text-anchor="middle" fill="#f4ece0" font-family="Cinzel,serif" font-size="9.5" letter-spacing="3.6" opacity="0.85">${enDisplay}</text>
    <!-- bottom tags -->
    <line x1="80" y1="450" x2="320" y2="450" stroke="#C9A86A" stroke-width="0.4" opacity="0.45"/>
    <text x="60" y="466" fill="#C9A86A" font-family="Cinzel,serif" font-size="7.5" letter-spacing="2.4" opacity="0.85">${origin}</text>
    <text x="340" y="466" text-anchor="end" fill="#C9A86A" font-family="Cinzel,serif" font-size="7.5" letter-spacing="2.4" opacity="0.85">${weight}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* ——— Catalogue (40+ SKUs from the IRTH dossier) ——— */
const PRODUCTS = [
  /* ——————————— Category 1 — Dates & Derivatives ——————————— */
  { id:'ajwa-400', cat:'dates', shape:'box', name:'Ajwa Al-Madinah', nameAr:'عجوة المدينة', nameShort:'AJWA AL-MADINAH',
    meta:'DATES · 01', metaAr:'تمور · ٠١', origin:'MADINAH · KSA', weight:'400 G', grade:'CERTIFIED ORIGIN',
    desc:'Selected from documented Madinah farms. Glossy, almost dark — the Prophetic date. Each tin sealed with a Certificate of Origin and a folded card carrying the Hadith.',
    descAr:'منتقاةٌ من نخيلِ المدينةِ الموثَّقة. لمّاعةٌ تكادُ تكونُ سوداء — تمرُ المصطفى ﷺ. كلُّ علبةٍ تُختمُ بشهادةِ منشأٍ وبطاقةٍ تحملُ الحديثَ الشريف.',
    hadith:'مَنْ تَصَبَّحَ بِسَبْعِ تَمَرَاتٍ عَجْوَةً — رواه البخاري', price:550, ribbon:'PROPHETIC' },

  { id:'medjool-500', cat:'dates', shape:'box-wood', name:'Medjool Premium · Wooden Box', nameAr:'مجدول فاخر · صندوق خشبي', nameShort:'MEDJOOL · A+',
    meta:'DATES · 02', metaAr:'تمور · ٠٢', origin:'KSA', weight:'500 G', grade:'GRADE A+',
    desc:'King of dates. Grade A+ Medjool laid in a laser-engraved wooden box that survives the gift it carries — meant to be reused, kept, remembered.',
    descAr:'ملِكُ التمور. مجدولٌ من الدرجةِ الممتازةِ في صندوقٍ خشبيٍّ منقوشٍ بالليزر، يبقى بعد الهدية — صُنع ليُحفظ ويُذكَر.',
    price:850, ribbon:'' },

  { id:'seven-dates-700', cat:'dates', shape:'box', name:'The Seven Dates Gift Box', nameAr:'صندوق التمور السبعة', nameShort:'THE SEVEN DATES',
    meta:'DATES · 03', metaAr:'تمور · ٠٣', origin:'HIJAZ', weight:'700 G', grade:'7 VARIETIES',
    desc:'Seven Hijazi varieties in a single matte-black presentation. A composition that quietly references the Prophetic Hadith of the seven dates of the morning.',
    descAr:'سبعةُ أصنافٍ حجازيةٍ في صندوقٍ أسودَ مطفيٍّ واحد. تأليفٌ يستحضرُ حديثَ السبعِ تمراتٍ صبيحةً بهدوء.',
    hadith:'حديث سبع تمرات', price:1200, ribbon:'SIGNATURE' },

  { id:'sukkari-500', cat:'dates', shape:'tin', name:'Sukkari Al-Qassim', nameAr:'سكّري القصيم', nameShort:'SUKKARI AL-QASSIM',
    meta:'DATES · 04', metaAr:'تمور · ٠٤', origin:'AL-QASSIM · KSA', weight:'500 G',
    desc:'Best Sukkari harvest of the season, sealed in a premium metal tin. Sweetness of the Peninsula, in a vessel meant for refilling.',
    descAr:'أفضلُ حصادٍ سكّريٍّ في الموسم، يُغلَّفُ في علبةٍ معدنيةٍ فاخرة. حلاوةُ الجزيرة، في وعاءٍ يستحقُّ الملءَ من جديد.',
    price:450, ribbon:'' },

  { id:'safawi-400', cat:'dates', shape:'box', name:'Safawi Al-Madinah', nameAr:'صفاوي المدينة', nameShort:'SAFAWI AL-MADINAH',
    meta:'DATES · 05', metaAr:'تمور · ٠٥', origin:'MADINAH · KSA', weight:'400 G',
    desc:'Dark as Ajwa, soft as a held memory. Geographically tied to Madinah — sister of the Prophetic date, distinct in flavour.',
    descAr:'داكنٌ كالعجوة، طريٌّ كذاكرةٍ في الكفِّ. مرتبطٌ جغرافياً بالمدينة — أختُ تمرِ النبيِّ ﷺ، مختلفٌ في المذاق.',
    price:450, ribbon:'' },

  { id:'stuffed-medjool', cat:'dates', shape:'box', name:'Stuffed Medjool · Nuts', nameAr:'مجدول محشوّ بالمكسرات', nameShort:'STUFFED MEDJOOL',
    meta:'DATES · 06', metaAr:'تمور · ٠٦', origin:'KSA · EGYPT', weight:'300 G',
    desc:'Medjool dates filled with almond, walnut, or pistachio — assembled by hand the day they ship. Hospitality at its peak.',
    descAr:'مجدولٌ محشوٌّ باللوزِ والجوزِ والفستق — يُجمَّعُ يدوياً يومَ الشحن. ضيافةٌ على أعلاها.',
    price:750, ribbon:'' },

  { id:'date-molasses', cat:'dates', shape:'bottle', name:'Premium Date Molasses', nameAr:'دبس التمرِ الفاخر', nameShort:'DATE MOLASSES',
    meta:'DATES · 07', metaAr:'تمور · ٠٧', origin:'EGYPT', weight:'250 ML',
    desc:'Cold-pressed date molasses in a slim gold-capped bottle. One spoon at sunset; the breakfast of the Prophets.',
    descAr:'دبسُ تمرٍ معصورٌ على البارد، في زجاجةٍ نحيلةٍ بسدّادةٍ ذهبية. ملعقةٌ عند الغروب؛ فطورُ الأنبياء.',
    price:350, ribbon:'' },

  { id:'date-powder', cat:'dates', shape:'pouch', name:'Date Powder · Sugar Substitute', nameAr:'مسحوقُ التمر · بديل السكر', nameShort:'DATE POWDER',
    meta:'DATES · 08', metaAr:'تمور · ٠٨', origin:'EGYPT', weight:'150 G',
    desc:'A natural sweetener for those who prefer to leave refined sugar behind. Stone-ground from premium Sukkari.',
    descAr:'محلٍّ طبيعيٌّ لمن يَودُّ تركَ السكرِ المكرَّر. مطحونٌ بالحجرِ من سكّريٍّ فاخر.',
    price:280, ribbon:'' },

  /* ——————————— Category 2 — Honey & Sidr ——————————— */
  { id:'doani-sidr-250', cat:'honey', shape:'jar', name:"Yemeni Doa'ni Sidr Honey", nameAr:'عسلُ سدرٍ دوعنيٍّ يمني', nameShort:"DOA'NI SIDR · LAB-CERTIFIED",
    meta:'HONEY · 01', metaAr:'عسل · ٠١', origin:'WADI DOA’N · YEMEN', weight:'250 G', grade:'ISO + COA',
    desc:'World’s finest sidr honey — gold-award provenance from Wadi Doa’n. Each batch ships with its own ISO 17025 lab certificate, sealed at the jar.',
    descAr:'أرقى عسلِ سدرٍ في العالم — من واديِ دوعن، بشهادةِ مختبرٍ مرفقةٍ مع كلِّ دفعة.',
    hadith:'الشفاء في ثلاث: شربة عسل…', price:2200, ribbon:'GOLD AWARD' },

  { id:'hadrami-sidr-250', cat:'honey', shape:'jar', name:'Hadrami Sidr · Grade 1', nameAr:'سدرٌ حضرميٌّ · درجة أولى', nameShort:'HADRAMI SIDR · G1',
    meta:'HONEY · 02', metaAr:'عسل · ٠٢', origin:'HADRAMAUT · YEMEN', weight:'250 G',
    desc:'First-grade Hadrami sidr with full source documentation. Therapeutic — the honey referenced in classical Prophetic medicine.',
    descAr:'سدرٌ حضرميٌّ من الدرجةِ الأولى بكاملِ التوثيق. شفائيٌّ — العسلُ المذكورُ في كتبِ الطبِّ النبوي.',
    price:1600, ribbon:'' },

  { id:'samr-300', cat:'honey', shape:'jar', name:'Hijazi Samr Honey', nameAr:'عسلُ السمرِ الحجازي', nameShort:'HIJAZI SAMR · ACACIA',
    meta:'HONEY · 03', metaAr:'عسل · ٠٣', origin:'HIJAZ · KSA', weight:'300 G',
    desc:'Acacia honey from the samr trees of the Hijaz — light gold, mild, perfumed. The everyday luxury honey.',
    descAr:'عسلُ سنطٍ من شجرِ السمرِ الحجازي — ذهبيٌّ فاتح، خفيف، عَطِر. عسلُ كلِّ يومٍ بمذاقِ الفخامة.',
    price:850, ribbon:'' },

  { id:'talh-300', cat:'honey', shape:'jar', name:'Al-Madani Talh Honey', nameAr:'عسلُ الطلحِ المدني', nameShort:'AL-MADANI TALH',
    meta:'HONEY · 04', metaAr:'عسل · ٠٤', origin:'MADINAH · KSA', weight:'300 G',
    desc:'From the orchards surrounding Madinah Al-Munawwarah. Referenced in Prophetic medicine; warm, deep, slightly resinous.',
    descAr:'من بساتينِ المدينةِ المنورة. مذكورٌ في الطبِّ النبوي؛ دافئٌ، عميقٌ، براتنجيةٍ خفيفة.',
    price:750, ribbon:'' },

  { id:'sidr-powder-200', cat:'honey', shape:'pouch', name:'Premium Sidr Powder · 7× Ground', nameAr:'مسحوقُ السدرِ الفاخر · مطحون ٧ مرات', nameShort:'SIDR POWDER · 7×',
    meta:'HONEY · 05', metaAr:'عسل · ٠٥', origin:'KSA', weight:'200 G', grade:'CLASS A',
    desc:'Dark-green Class-A sidr ground seven times — fine as flour. The traditional cleanser the Quran itself names.',
    descAr:'سدرٌ أخضرُ داكنٌ من الدرجةِ الأولى، مطحونٌ سبعَ مرّاتٍ حتى يصيرَ كالطحين. المنظِّفُ الذي سمّاه القرآن.',
    price:380, ribbon:'' },

  { id:'yemeni-sidr-powder-200', cat:'honey', shape:'pouch', name:'Yemeni Sidr Powder', nameAr:'مسحوقُ السدرِ اليمني', nameShort:'YEMENI SIDR POWDER',
    meta:'HONEY · 06', metaAr:'عسل · ٠٦', origin:'YEMEN', weight:'200 G',
    desc:'Richer in natural alkaloids — from the valleys of Yemen. A natural shampoo and skin balm in one quiet pouch.',
    descAr:'أغنى بالقلويداتِ الطبيعية — من أوديةِ اليمن. شامبو طبيعيٌّ ومرهمُ بشرةٍ في كيسٍ هادئٍ واحد.',
    price:350, ribbon:'' },

  /* ——————————— Category 3 — Spices & Herbs ——————————— */
  { id:'saffron-1', cat:'spices', shape:'vial', name:'Full-Petal Saffron · 1g', nameAr:'زعفرانٌ كاملُ التويجِ · ١غ', nameShort:'FULL-PETAL SAFFRON',
    meta:'SPICES · 01', metaAr:'توابل · ٠١', origin:'IRAN / KASHMIR', weight:'1 G', grade:'GRADE A',
    desc:'A single gram, full red petals only — no broken stigmas, no chemical reds. The most expensive spice in the world, treated like one.',
    descAr:'غرامٌ واحد، تويجاتٌ كاملةُ الحمرةِ فقط — لا قصاصات، ولا أصباغ. أغلى توابلِ الأرض، تُعامَلُ بما تستحقّ.',
    price:580, ribbon:'GRADE A' },

  { id:'daqqa-80', cat:'spices', shape:'tin', name:"Daqqat Al-Madinah Blend", nameAr:'دقّةُ المدينة', nameShort:"DAQQAT AL-MADINAH",
    meta:'SPICES · 02', metaAr:'توابل · ٠٢', origin:'MADINAH', weight:'80 G',
    desc:'The authentic Hijazi mix the Madinah kitchen rests on. Cumin, coriander, cardamom, dried mint — blended in our atelier each morning.',
    descAr:'الخلطةُ الحجازيةُ الأصيلةُ التي يقومُ عليها مطبخُ المدينة. كمّون، كزبرة، هيل، نعناعٌ مجفّف — تُخلَطُ في الأتيليه كلَّ صباح.',
    price:280, ribbon:'' },

  { id:'madinah-mint-50', cat:'spices', shape:'pouch', name:'Madinah Mint · Dried', nameAr:'النعناعُ المدني المجفّف', nameShort:'MADINAH MINT',
    meta:'SPICES · 03', metaAr:'توابل · ٠٣', origin:'MADINAH · KSA', weight:'50 G', grade:'PROTECTED ORIGIN',
    desc:'Dried Madinah mint — protected trademark, distinct from any other. Steep one pinch in boiling water and the whole room remembers a city it never saw.',
    descAr:'نعناعٌ مدنيٌّ مجفّف — اسمٌ محميٌّ، يختلفُ عن سواه. رشّةٌ في ماءٍ مغلي، فيتذكَّرُ البيتُ مدينةً لم يَرَها.',
    price:250, ribbon:'' },

  { id:'taif-rose-20', cat:'spices', shape:'tin', name:'Dried Taif Rose', nameAr:'وردُ الطائفِ المجفّف', nameShort:'TAIF ROSE · DRIED',
    meta:'SPICES · 04', metaAr:'توابل · ٠٤', origin:'TAIF · KSA', weight:'20 G',
    desc:'The Imperial Rose of Mecca and Taif. We harvest only the first opening of the morning — twenty grams is a quiet, generous amount.',
    descAr:'وردةُ الإمبراطورِ من مكةَ والطائف. لا نقطفُ إلا أوّلَ فتحةِ الصباح — عشرونَ غراماً كميةٌ هادئةٌ كريمة.',
    price:450, ribbon:'' },

  { id:'black-seed-100', cat:'spices', shape:'tin', name:'Black Seed · Whole & Ground', nameAr:'الحبّةُ السوداء · حبٌّ ومطحون', nameShort:'BLACK SEED',
    meta:'SPICES · 05', metaAr:'توابل · ٠٥', origin:'CERTIFIED ORGANIC', weight:'100 G',
    desc:"The Prophetic seed — “heal for every illness save death.” Sourced from certified-organic fields, packed in a small dark tin to keep the oil alive.",
    descAr:'الحبّةُ النبويّة — «شفاءٌ من كلِّ داءٍ إلا السام». من حقولٍ عضويةٍ معتمدة، تُعبَّأُ في علبةٍ داكنةٍ تحفظُ الزيتَ حيّاً.',
    hadith:'إنَّ في الحبّةِ السوداء شفاءً من كلِّ داءٍ — رواه البخاري', price:220, ribbon:'PROPHETIC' },

  { id:'cardamom-50', cat:'spices', shape:'tin', name:'Whole Green Cardamom', nameAr:'هيلٌ أخضرُ كامل', nameShort:'GREEN CARDAMOM',
    meta:'SPICES · 06', metaAr:'توابل · ٠٦', origin:'ARABIAN PENINSULA', weight:'50 G',
    desc:'Arabic coffee is incomplete without it. Whole pods, freshly opened — never powdered, never stale.',
    descAr:'القهوةُ العربيّةُ ناقصةٌ من دونه. حبّاتٌ كاملة، تُفتَحُ طازجة — لا تُطحَنُ ولا تبيت.',
    price:380, ribbon:'' },

  { id:'ceylon-cinnamon-80', cat:'spices', shape:'tin', name:'True Ceylon Cinnamon', nameAr:'القرفةُ السيلانيةُ الأصلية', nameShort:'CEYLON CINNAMON',
    meta:'SPICES · 07', metaAr:'توابل · ٠٧', origin:'SRI LANKA', weight:'80 G',
    desc:'Real Ceylon — not the harsher Cassia sold in most markets. Gentler, deeper, more complex. The way cinnamon was meant to taste.',
    descAr:'سيلانيةٌ حقيقية — لا الكاسيا الشائعة. ألطفُ، أعمقُ، أكثرُ تركيباً. هكذا أُريدَ للقرفةِ أن تكون.',
    price:240, ribbon:'' },

  { id:'herbal-set', cat:'spices', shape:'box', name:'Madinah Herbal Gift Set · 8', nameAr:'طقمُ أعشابِ المدينة · ٨', nameShort:'HERBAL SET · 8 JARS',
    meta:'SPICES · 08', metaAr:'توابل · ٠٨', origin:'COMPOSED IN CAIRO', weight:'8 JARS',
    desc:'Mint, basil, rose, saffron, cardamom, black seed, cinnamon, habaq — the complete Madinah herbal kitchen in a single black box.',
    descAr:'نعناع، ريحان، ورد، زعفران، هيل، حبّةُ بركة، قرفة، حبق — مطبخُ المدينةِ العشبيُّ كاملاً في صندوقٍ واحد.',
    price:750, ribbon:'GIFT' },

  /* ——————————— Category 4 — Incense & Fragrances ——————————— */
  { id:'cambodian-oud-3', cat:'fragrance', shape:'bottle', name:'Premium Cambodian Oud Oil', nameAr:'زيتُ العودِ الكمبوديِّ الفاخر', nameShort:'CAMBODIAN OUD · DEEP',
    meta:'FRAGRANCE · 01', metaAr:'عطر · ٠١', origin:'CAMBODIA', weight:'3 ML',
    desc:'A single distillation of selected Cambodian oud — deep, resonant, slightly sweet on the dry-down. One drop carries an evening.',
    descAr:'تقطيرٌ منفردٌ من عودٍ كمبوديٍّ منتقى — عميقٌ، رنّان، حلوٌ على الجفاف. قطرةٌ واحدةٌ تَحملُ ليلةً كاملة.',
    price:950, ribbon:'SIGNATURE' },

  { id:'taif-rose-water-100', cat:'fragrance', shape:'bottle', name:'Original Taif Rose Water', nameAr:'ماءُ ورد الطائفِ الأصلي', nameShort:'TAIF ROSE WATER',
    meta:'FRAGRANCE · 02', metaAr:'عطر · ٠٢', origin:'TAIF · KSA', weight:'100 ML',
    desc:'Steam-distilled in Taif from first-opening roses. Splash before fajr, after wudu, or onto the corners of a folded letter.',
    descAr:'مقطَّرٌ بالبخارِ في الطائفِ من أوّلِ فتحِ الورد. رشّةٌ قبل الفجر، بعد الوضوء، أو على أركانِ رسالةٍ مطويّة.',
    price:380, ribbon:'' },

  { id:'bakhoor-madinah-30', cat:'fragrance', shape:'box', name:"Madinah Perfumed Bakhoor", nameAr:'بخورُ المدينةِ المعطّر', nameShort:'MADINAH BAKHOOR',
    meta:'FRAGRANCE · 03', metaAr:'عطر · ٠٣', origin:'COMPOSED IN CAIRO', weight:'30 G',
    desc:'A bakhoor blend inspired by the Prophet’s Mosque — rose, frankincense, aged oud chip. Three pieces fill a room for an hour.',
    descAr:'مزيجُ بخورٍ مستوحًى من المسجدِ النبوي — وردٌ، لُبان، رقائقُ عودٍ معتّق. ثلاثُ قطعٍ تملأُ الغرفةَ ساعة.',
    price:320, ribbon:'' },

  { id:'frankincense-30', cat:'fragrance', shape:'jar', name:'Somali Frankincense · Grade 1', nameAr:'لُبانٌ صوماليٌّ · درجة أولى', nameShort:'SOMALI FRANKINCENSE · G1',
    meta:'FRAGRANCE · 04', metaAr:'عطر · ٠٤', origin:'SOMALIA', weight:'30 G',
    desc:'The most therapeutic frankincense in the world — sharp, lemony, then resinous. Chew one pearl in the morning. Burn one at night.',
    descAr:'أقوى لُبانٍ شفائيٍّ في العالم — حادٌّ ليمونيٌّ ثم راتنجي. امضغ حبّةً صباحاً. أحرق أخرى مساءً.',
    price:280, ribbon:'' },

  { id:'white-musk-5', cat:'fragrance', shape:'vial', name:'Natural White Musk', nameAr:'مسكٌ أبيضُ طبيعي', nameShort:'WHITE MUSK · 5G',
    meta:'FRAGRANCE · 05', metaAr:'عطر · ٠٥', origin:'CERTIFIED HALAL', weight:'5 G',
    desc:'Halal-certified, high-purity, drawn from natural fixatives. Warm rather than sharp; lifts every oil it is worn beside.',
    descAr:'مسكٌ حلالٌ معتمد، نقاوةٌ عالية، من مثبّتاتٍ طبيعية. دافئٌ لا حادّ؛ يرفعُ كلَّ زيتٍ يُلبَسُ بقربه.',
    price:420, ribbon:'' },

  { id:'brass-burner', cat:'fragrance', shape:'object', name:'Premium Brass Bakhoor Burner', nameAr:'مبخرةٌ نحاسيةٌ فاخرة', nameShort:'BRASS BAKHOOR BURNER',
    meta:'FRAGRANCE · 06', metaAr:'عطر · ٠٦', origin:'HAND-FORMED · EGYPT', weight:'HANDMADE',
    desc:'Hand-formed brass burner — the gesture of Madinah hospitality. Pairs with any bakhoor; outlives every guest list.',
    descAr:'مبخرةٌ نحاسيةٌ مشكَّلةٌ باليد — لفتةُ ضيافةِ المدينة. تُناسبُ أيَّ بخور؛ وتبقى بعد كلِّ ضيف.',
    price:650, ribbon:'GIFT' },

  /* ——————————— Category 5 — Spiritual Accessories ——————————— */
  { id:'aqeeq-misbaha', cat:'spiritual', shape:'beads', name:'Yemeni Aqeeq Misbaha · 33', nameAr:'مسبحةُ العقيقِ اليماني · ٣٣', nameShort:'AQEEQ MISBAHA · 33',
    meta:'SPIRITUAL · 01', metaAr:'روحاني · ٠١', origin:'YEMEN', weight:'33 BEADS',
    desc:'Thirty-three beads of natural Yemeni carnelian, hand-strung in our atelier. Comes nested in a velvet box with a hand-numbered card.',
    descAr:'ثلاثٌ وثلاثونَ حبّةً من العقيقِ اليمانيِّ الطبيعي، تُنظَّمُ باليدِ في الأتيليه. تصلُ في علبةِ مخملٍ ببطاقةٍ مرقَّمة.',
    price:2200, ribbon:'SIGNATURE' },

  { id:'amber-misbaha', cat:'spiritual', shape:'beads', name:'Baltic Amber Misbaha · 33', nameAr:'مسبحةُ الكهرمانِ البلطيقي · ٣٣', nameShort:'BALTIC AMBER MISBAHA',
    meta:'SPIRITUAL · 02', metaAr:'روحاني · ٠٢', origin:'BALTIC', weight:'33 BEADS', grade:'100% AUTHENTIC',
    desc:'100% authentic Baltic amber — each bead a fossil. Comes with a certificate of authenticity and a numbered card.',
    descAr:'كهرمانٌ بلطيقيٌّ أصليٌّ ١٠٠٪ — كلُّ حبّةٍ أحفور. تأتي بشهادةِ أصالةٍ وبطاقةٍ مرقَّمة.',
    price:3500, ribbon:'LIMITED' },

  { id:'crystal-misbaha', cat:'spiritual', shape:'beads', name:'Natural Crystal Misbaha', nameAr:'مسبحةُ كريستالٍ طبيعي', nameShort:'CRYSTAL MISBAHA · 33',
    meta:'SPIRITUAL · 03', metaAr:'روحاني · ٠٣', origin:'NATURAL', weight:'33 BEADS',
    desc:'Transparent crystal beads on a silk thread. Light in the hand, weighted in the spirit.',
    descAr:'حبّاتُ كريستالٍ شفّافٍ على خيطِ حرير. خفيفةٌ في اليد، ثقيلةٌ في الروح.',
    price:750, ribbon:'' },

  { id:'rawdah-rug', cat:'spiritual', shape:'photo', name:"Al-Rawdah Prayer Rug · Turkish Velvet", nameAr:'سجادةُ الروضةِ · مخمل تركي', nameShort:"AL-RAWDAH PRAYER RUG",
    meta:'SPIRITUAL · 04', metaAr:'روحاني · ٠٤', origin:'TURKEY · BOUND IN CAIRO', weight:'TURKISH VELVET',
    desc:'A signature prayer rug. Heavyweight Turkish velvet, Al-Rawdah Al-Sharifah motif, finished with a leather travel sleeve and a numbered Certificate of Authenticity.',
    descAr:'سجادةُ الإمضاء. مخملٌ تركيٌّ ثقيل، نقشُ الروضةِ الشريفة، تُغلَّفُ بحقيبةِ جلدٍ وشهادةِ أصالةٍ مرقَّمة.',
    price:950, img:'assets/product-prayer-rug.png', ribbon:'SIGNATURE' },

  { id:'travel-mat', cat:'spiritual', shape:'rug', name:'Premium Travel Prayer Mat', nameAr:'سجادةُ سفرٍ فاخرة', nameShort:'TRAVEL PRAYER MAT',
    meta:'SPIRITUAL · 05', metaAr:'روحاني · ٠٥', origin:'COMPOSED IN CAIRO', weight:'LIGHTWEIGHT',
    desc:'Foldable, light, and carried in a slim leather bag. The rug for the boardroom, the airport, the desert.',
    descAr:'قابلةٌ للطيّ، خفيفة، تُحمَلُ في حقيبةِ جلدٍ نحيلة. سجادةُ القاعة، والمطار، والصحراء.',
    price:480, ribbon:'' },

  { id:'siwak-set', cat:'spiritual', shape:'plate', name:"Al-Arak Siwak Set · 7", nameAr:'طقمُ سواكِ الأراك · ٧', nameShort:"AL-ARAK SIWAK · 7",
    meta:'SPIRITUAL · 06', metaAr:'روحاني · ٠٦', origin:'ARABIAN PENINSULA', weight:'7 PIECES',
    desc:'Seven fresh-cut arak siwaks in a small wooden box, with a printed booklet on proper use. The Sunnah toothbrush, intact.',
    descAr:'سبعةُ أعوادِ أراكٍ طازجة في صندوقٍ خشبيٍّ صغير، مع كتيِّبٍ مطبوعٍ في الاستعمالِ الصحيح. سواكُ السنّة، كاملاً.',
    hadith:'السواك مطهرة للفم — رواه أحمد', price:280, ribbon:'' },

  { id:'quran-stand', cat:'spiritual', shape:'stand', name:'Laser-engraved Quran Stand', nameAr:'حاملُ المصحفِ المنقوش', nameShort:'QURAN STAND',
    meta:'SPIRITUAL · 07', metaAr:'روحاني · ٠٧', origin:'CAIRO', weight:'NATURAL WOOD',
    desc:'Natural wood, gold-engraved with the IRTH arch, folding flat. Presented in a matching gift box.',
    descAr:'خشبٌ طبيعيٌّ منقوشٌ بقوسِ إرثٍ ذهبي، يُطوى مسطّحاً. يُقدَّمُ في صندوقِ هديةٍ مطابق.',
    price:1500, ribbon:'' },

  { id:'zamzam-vessel', cat:'spiritual', shape:'vessel', name:'Zamzam Luxury Vessel Box', nameAr:'صندوقُ ماءِ زمزم الفاخر', nameShort:'ZAMZAM VESSEL · BOX',
    meta:'SPIRITUAL · 08', metaAr:'روحاني · ٠٨', origin:'COMPOSED IN CAIRO', weight:'WOOD + LEATHER',
    desc:'A laser-engraved wooden vessel meant to hold the Zamzam bottle you brought back from Umrah or Hajj. The vessel only — never the water.',
    descAr:'صندوقٌ خشبيٌّ منقوشٌ ليحملَ زجاجةَ ماءِ زمزمَ التي عُدتَ بها من العمرةِ أو الحج. الصندوقُ فقط — لا الماء.',
    price:850, ribbon:'' },

  /* ——————————— Category 6 — Luxury Gift Boxes ——————————— */
  { id:'reeh-small', cat:'gifts', shape:'box', name:"Reeh Al-Madinah · Small", nameAr:'ريحُ المدينة · صغير', nameShort:'REEH AL-MADINAH',
    meta:'GIFT BOX · 01', metaAr:'هدية · ٠١', origin:'COMPOSED IN CAIRO', weight:'SMALL',
    desc:'Ajwa, small honey, Madinah bakhoor, and a gold Hadith card. The Umrah-return gift, in a single matte-black drawer.',
    descAr:'عجوة، عسلٌ صغير، بخورُ المدينة، وبطاقةُ حديثٍ بالذهب. هديةُ العائدِ من العمرة، في درجٍ أسودَ واحد.',
    price:1850, ribbon:'BESTSELLER' },

  { id:'karamah-medium', cat:'gifts', shape:'box', name:'Al-Karamah · Medium', nameAr:'الكرامة · متوسّط', nameShort:'AL-KARAMAH',
    meta:'GIFT BOX · 02', metaAr:'هدية · ٠٢', origin:'COMPOSED IN CAIRO', weight:'MEDIUM',
    desc:'Four selected products, a misbaha, dried Taif rose, and an oud oil. The wedding or engagement gift; arrives with a calligraphed dedication.',
    descAr:'أربعةُ منتجاتٍ منتقاة، مسبحة، وردُ طائفٍ مجفّف، وزيتُ عود. هديةُ الزواجِ أو الخطوبة؛ تصلُ بإهداءٍ مخطوط.',
    price:3200, ribbon:'WEDDING' },

  { id:'grand-box', cat:'gifts', shape:'box-wood', name:"IRTH Al-Madinah · Grand", nameAr:'إرثُ المدينة · الكبير', nameShort:'IRTH AL-MADINAH GRAND',
    meta:'GIFT BOX · 03', metaAr:'هدية · ٠٣', origin:'COMPOSED IN CAIRO', weight:'GRAND · 12 PIECES',
    desc:'Twelve products. Prayer rug. Misbaha. Oud oil. The flagship — for the occasion that doesn’t happen twice.',
    descAr:'اثنا عشرَ منتجاً. سجادةُ صلاة. مسبحة. زيتُ عود. الإصدارُ الكبيرُ — للمناسبةِ التي لا تتكرّر.',
    price:7500, ribbon:'FLAGSHIP' },

  { id:'diyafah', cat:'gifts', shape:'box', name:"Al-Diyafah Hospitality Box", nameAr:'صندوقُ الديافة', nameShort:'AL-DIYAFAH',
    meta:'GIFT BOX · 04', metaAr:'هدية · ٠٤', origin:'COMPOSED IN CAIRO', weight:'HOSPITALITY',
    desc:'Arabic coffee, green cardamom, saffron, brass coffee cups. The Diwan, in one box, ready to receive a guest tonight.',
    descAr:'قهوةٌ عربية، هيلٌ أخضر، زعفران، فناجينُ نحاس. الديوانُ كلُّه في صندوقٍ واحد، جاهزٌ لاستقبالِ ضيفِ الليلة.',
    price:1200, ribbon:'' },

  { id:'royal-seven-dates', cat:'gifts', shape:'box-wood', name:'Royal Seven Dates · Wooden', nameAr:'التمورُ السبعةُ الملكية · خشبي', nameShort:'ROYAL SEVEN DATES',
    meta:'GIFT BOX · 05', metaAr:'هدية · ٠٥', origin:'COMPOSED IN CAIRO', weight:'7 VARIETIES',
    desc:'Seven date varieties + a small honey, in a wooden box meant for Ramadan and Eid. Refillable, reusable, gifted forward.',
    descAr:'سبعةُ أصنافٍ من التمر + عسلٌ صغير، في صندوقٍ خشبيٍّ لرمضانَ والعيد. قابلٌ لإعادةِ الملءِ والإهداءِ مجدّداً.',
    price:2400, ribbon:'RAMADAN' },

  { id:'corporate', cat:'gifts', shape:'box', name:'Corporate Gift Box · Custom', nameAr:'صندوقُ الشركاتِ · حسب الطلب', nameShort:'CORPORATE GIFT · CUSTOM',
    meta:'GIFT BOX · 06', metaAr:'هدية · ٠٦', origin:'B2B · CAIRO', weight:'FROM 25 PCS',
    desc:'Fully customised with company logo, printed dedication, and co-branded Certificate of Authenticity. Minimum 25 pieces, 14-day lead.',
    descAr:'مخصَّصٌ كاملاً بشعارِ الشركة، إهداءٍ مطبوع، وشهادةِ أصالةٍ مشتركة. الحدُّ الأدنى ٢٥ قطعة، مدّةُ التحضيرِ ١٤ يوماً.',
    price:2500, ribbon:'B2B' },
];

// Real product image overrides — paths relative to Shopify CDN
const CDN = (typeof window !== 'undefined' && window.SHOPIFY_CDN) ? window.SHOPIFY_CDN : '';
const REAL_IMGS = {
  'ajwa-400':              CDN + 'prod-dates-box.png',
  'medjool-500':           CDN + 'prod-dates-gift.png',
  'seven-dates-700':       CDN + 'prod-dates-gift.png',
  'sukkari-500':           CDN + 'prod-dates-box.png',
  'safawi-400':            CDN + 'prod-dates-box.png',
  'stuffed-medjool':       CDN + 'prod-dates-gift.png',
  'doani-sidr-250':        CDN + 'prod-sidr-honey.png',
  'hadrami-sidr-250':      CDN + 'prod-sidr-honey.png',
  'sidr-powder-200':       CDN + 'prod-dates-box.png',
  'yemeni-sidr-powder-200':CDN + 'prod-dates-box.png',
  'saffron-1':             CDN + 'prod-saffron.png',
  'black-seed-100':        CDN + 'prod-saffron.png',
  'madinah-mint-50':       CDN + 'prod-madinah-mint.png',
  'taif-rose-20':          CDN + 'col-fragrance.png',
  'rawdah-rug':            CDN + 'prod-prayer-rug.png',
  'travel-mat':            CDN + 'prod-prayer-rug.png',
  'quran-stand':           CDN + 'prod-prayer-rug.png',
  'reeh-small':            CDN + 'prod-dates-gift.png',
  'grand-box':             CDN + 'prod-dates-gift.png',
  'samr-300':              CDN + 'prod-sidr-honey.png',
  'talh-300':              CDN + 'prod-sidr-honey.png',
  'date-molasses':         CDN + 'prod-dates-box.png',
  'date-powder':           CDN + 'prod-dates-box.png',
  'daqqa-80':              CDN + 'prod-madinah-mint.png',
  'cardamom-50':           CDN + 'prod-madinah-mint.png',
  'ceylon-cinnamon-80':    CDN + 'prod-madinah-mint.png',
  'herbal-set':            CDN + 'prod-dates-gift.png',
  'cambodian-oud-3':       CDN + 'incense-burner.png',
  'taif-rose-water-100':   CDN + 'col-fragrance.png',
  'bakhoor-madinah-30':    CDN + 'incense-burner-2.png',
  'frankincense-30':       CDN + 'incense-burner-2.png',
  'white-musk-5':          CDN + 'incense-burner.png',
  'brass-burner':          CDN + 'incense-burner-2.png',
  'aqeeq-misbaha':         CDN + 'IRTH56789.png',
  'amber-misbaha':         CDN + 'IRTH56789.png',
  'crystal-misbaha':       CDN + 'IRTH56789.png',
  'siwak-set':             CDN + 'prod-madinah-mint.png',
  'zamzam-vessel':         CDN + 'prod-dates-gift.png',
  'karamah-medium':        CDN + 'prod-dates-gift.png',
  'diyafah':               CDN + 'prod-dates-gift.png',
  'royal-seven-dates':     CDN + 'prod-dates-gift.png',
  'corporate':             CDN + 'prod-dates-gift.png',
};
PRODUCTS.forEach(p => { if (REAL_IMGS[p.id]) p.img = REAL_IMGS[p.id]; });

// Attach generated SVG markup to every product still missing a real photo
PRODUCTS.forEach(p => { if (!p.img) p._svgFallback = productSVG(p); });

function fmtPrice(n){
  const lang = document.documentElement.getAttribute('lang') || 'en';
  if (lang === 'ar'){
    const arDigits = String(Math.round(n)).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]).replace(/(\d{3})(?=\d)/g, '$1٬');
    return arDigits + ' ج.م';
  }
  return n.toLocaleString('en-US') + ' EGP';
}

function certSerial(p){
  // deterministic serial per product
  let h = 0; for (let i=0;i<p.id.length;i++){ h = (h*33 + p.id.charCodeAt(i)) >>> 0; }
  return 'No. ' + String(1000 + (h % 8999)).padStart(4,'0');
}

function renderShop(filter){
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const filtered = (filter && filter !== 'all') ? PRODUCTS.filter(p => p.cat === filter) : PRODUCTS;
  // Update filter counts
  document.querySelectorAll('.shop-filters .filter').forEach(b => {
    const f = b.dataset.filter;
    const n = f === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === f).length;
    const el = b.querySelector('.filter-count');
    if (el) el.textContent = String(n);
  });
  if (filtered.length === 0){
    grid.innerHTML = `<div class="shop-empty">${lang === 'ar' ? 'لا توجد قطعٌ ضمنَ هذا التصنيفِ بعد.' : 'No pieces in this category yet.'}</div>`;
    return;
  }
  filtered.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'shop-card';
    card.dataset.id = p.id;
    card.style.animationDelay = (i * 50) + 'ms';
    const ribbonHtml = p.ribbon ? `<div class="ribbon">${p.ribbon}</div>` : '';
    const grade = p.grade ? `<div class="grade">${lang === 'ar' ? (p.gradeAr || p.grade) : p.grade}</div>` : '';
    card.innerHTML = `
      ${ribbonHtml}
      <div class="img">
        ${p.img ? `<img src="${p.img}" alt="${p.name}" loading="lazy">` : `<div class="svg-label">${p._svgFallback||''}</div>`}
        <div class="cert"><span>${lang === 'ar' ? 'شهادة أصالة' : 'CERTIFIED'} · ${certSerial(p)}</span></div>
        <button class="quick-view" data-view="${p.id}" type="button" aria-label="${lang === 'ar' ? 'عرض' : 'View'}">
          <span>${lang === 'ar' ? 'عرضُ القطعة' : 'VIEW PIECE'}</span>
        </button>
      </div>
      <div class="body">
        <div class="meta-row">
          <div class="meta">${lang === 'ar' ? p.metaAr : p.meta}</div>
          ${grade}
        </div>
        <div class="name">${lang === 'ar' ? p.nameAr : p.name}</div>
        ${lang === 'en' ? `<div class="ar-name">${p.nameAr}</div>` : ''}
        <div class="desc">${lang === 'ar' ? p.descAr : p.desc}</div>
        ${p.hadith ? `<div class="hadith-tag">${lang === 'ar' ? '◆ ' + (p.hadithAr || p.hadith) : '◆ ' + p.hadith}</div>` : ''}
        <div class="foot">
          <div class="price">${fmtPrice(p.price)}${p.cat==='gifts' && p.id==='corporate' ? `<small>${lang === 'ar' ? '/ يبدأ من' : '/ FROM'}</small>` : ''}</div>
          <button class="add-btn" data-add="${p.id}" type="button">
            <span class="plus"></span>
            <span>${lang === 'ar' ? 'أضف' : 'ADD'}</span>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* Filter buttons */
function bindShopFilters(){
  document.querySelectorAll('.shop-filters .filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.shop-filters .filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderShop(btn.dataset.filter);
    });
  });
}

/* ——— Cart state ——— */
let CART = (() => {
  try { return JSON.parse(localStorage.getItem('irth.cart') || '[]'); } catch(e){ return []; }
})();
function saveCart(){ try { localStorage.setItem('irth.cart', JSON.stringify(CART)); } catch(e){} }

function addToCart(id){
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const found = CART.find(c => c.id === id);
  if (found) found.qty += 1;
  else CART.push({id, qty:1});
  saveCart();
  renderCart();
  showToast();
  const btn = document.querySelector(`[data-add="${id}"]`);
  if (btn){
    btn.classList.add('added');
    const label = btn.querySelector('[data-i18n]');
    const lang = document.documentElement.getAttribute('lang') || 'en';
    const orig = lang === 'ar' ? 'أضف' : 'ADD';
    if (label) label.textContent = lang === 'ar' ? 'أُضيف ✓' : 'ADDED ✓';
    setTimeout(() => {
      btn.classList.remove('added');
      if (label) label.textContent = orig;
    }, 1800);
  }
}

function changeQty(id, delta){
  const c = CART.find(x => x.id === id);
  if (!c) return;
  c.qty += delta;
  if (c.qty <= 0) CART = CART.filter(x => x.id !== id);
  saveCart();
  renderCart();
}
function removeFromCart(id){
  CART = CART.filter(x => x.id !== id);
  saveCart();
  renderCart();
}

function renderCart(){
  const count = CART.reduce((s,c)=>s+c.qty,0);
  const countEl = document.getElementById('basketCount');
  if (countEl) countEl.textContent = count;
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  const lang = document.documentElement.getAttribute('lang') || 'en';
  if (!items) return;
  items.innerHTML = '';
  if (CART.length === 0){
    items.innerHTML = `<div class="cart-empty" data-i18n="cart.empty">${lang === 'ar' ? 'سلّتُك هادئةٌ بعد.' : 'Your basket is quiet, for now.'}</div>`;
    if (foot) foot.hidden = true;
    return;
  }
  let subtotal = 0;
  CART.forEach(c => {
    const p = PRODUCTS.find(x => x.id === c.id);
    if (!p) return;
    subtotal += p.price * c.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt=""></div>
      <div class="info">
        <div class="ti-name">${lang === 'ar' ? p.nameAr : p.name}</div>
        <div class="ti-meta">${lang === 'ar' ? p.metaAr : p.meta}</div>
        <div class="qty">
          <button type="button" data-dec="${p.id}">−</button>
          <span class="q">${c.qty}</span>
          <button type="button" data-inc="${p.id}">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
        <div class="ti-price">${fmtPrice(p.price * c.qty)}</div>
        <button class="remove" data-rm="${p.id}" type="button">${lang === 'ar' ? 'إزالة' : 'REMOVE'}</button>
      </div>
    `;
    items.appendChild(row);
  });
  document.getElementById('cartSub').textContent = fmtPrice(subtotal);
  document.getElementById('cartTotal').textContent = fmtPrice(subtotal);
  if (foot) foot.hidden = false;

  // Bind qty/remove
  items.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => changeQty(b.dataset.inc, 1));
  items.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => changeQty(b.dataset.dec, -1));
  items.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => removeFromCart(b.dataset.rm));
}

function openCart(){
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').setAttribute('aria-hidden','false');
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').setAttribute('aria-hidden','true');
}
document.getElementById('basketBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

document.getElementById('cartCheckout').addEventListener('click', () => {
  if (CART.length === 0) return;
  const lang = document.documentElement.getAttribute('lang') || 'en';
  let lines = (lang === 'ar' ? 'السلام عليكم، أودّ طلب:\n' : 'Hello IRTH, I would like to order:\n');
  let total = 0;
  CART.forEach(c => {
    const p = PRODUCTS.find(x => x.id === c.id);
    if (!p) return;
    total += p.price * c.qty;
    lines += `• ${lang === 'ar' ? p.nameAr : p.name} × ${c.qty} — ${fmtPrice(p.price * c.qty)}\n`;
  });
  lines += (lang === 'ar' ? `\nالمجموع: ${fmtPrice(total)}` : `\nTotal: ${fmtPrice(total)}`);
  // Opens a WhatsApp link
  const url = 'https://wa.me/201000000000?text=' + encodeURIComponent(lines);
  window.open(url, '_blank');
});
/* SHOPIFY Cart & Checkout Integration */
const shopifyCartLines = {};

async function shopifyAddToCart(productId, variantId, quantity) {
  quantity = quantity || 1;
  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: quantity })
    });
    if (res.ok) return await res.json();
  } catch(e) {}
  shopifyCartLines[productId] = (shopifyCartLines[productId] || 0) + quantity;
}

async function shopifyCheckout() {
  const lines = Object.entries(shopifyCartLines).map(function(entry) {
    return { merchandiseId: 'gid://shopify/ProductVariant/' + entry[0], quantity: entry[1] };
  });
  try {
    const res = await fetch('https://irth-13.myshopify.com/api/2024-01/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': window.SHOPIFY_STOREFRONT_TOKEN },
      body: JSON.stringify({ query: 'mutation { cartCreate(input: { lines: [] }) { cart { checkoutUrl } } }' })
    });
    const data = await res.json();
    const url = data && data.data && data.data.cartCreate && data.data.cartCreate.cart && data.data.cartCreate.cart.checkoutUrl;
    if (url) { window.location.href = url; return; }
  } catch(e) {}
  alert('Checkout unavailable. Contact us on WhatsApp.');
}


/* Toast */
let toastTimer;
function showToast(){
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const el = document.getElementById('toast');
  el.textContent = lang === 'ar' ? 'أُضيف للسلّة ✓' : 'ADDED TO BASKET ✓';
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* Delegate ADD clicks via event delegation since cards are dynamic */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (btn) { e.stopPropagation(); addToCart(btn.dataset.add); return; }
  const view = e.target.closest('[data-view]');
  if (view) { e.stopPropagation(); openProductDetail(view.dataset.view); return; }
});

/* ——— Product Detail Modal ——— */
let pdState = { id: null, qty: 1 };

function openProductDetail(id){
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  pdState = { id, qty: 1 };
  renderProductDetail();
  document.getElementById('pdOverlay').classList.add('open');
  document.getElementById('pdOverlay').setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeProductDetail(){
  document.getElementById('pdOverlay').classList.remove('open');
  document.getElementById('pdOverlay').setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

function renderProductDetail(){
  const p = PRODUCTS.find(x => x.id === pdState.id);
  if (!p) return;
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const imgEl = document.getElementById('pdImg');
  const bodyEl = document.getElementById('pdBody');
  const ribbon = p.ribbon ? `<div class="ribbon">${p.ribbon}</div>` : '';
  imgEl.innerHTML = `${ribbon}<img src="${p.img}" alt="${p.name}"><div class="serial">${lang === 'ar' ? 'شهادة أصالة' : 'CERTIFIED'} · ${certSerial(p)}</div>`;
  const inStock = lang === 'ar' ? 'متوفر · شحن خلال ٤٨ ساعة' : 'IN STOCK · SHIPS IN 48H';
  const fromTag = (p.cat==='gifts' && p.id==='corporate') ? `<small>${lang === 'ar' ? '/ يبدأ من' : '/ FROM'}</small>` : '';
  const hadithBlock = p.hadith ? `
    <div class="hadith-block">
      ${p.hadithAr || p.hadith}
      <div class="src">${lang === 'ar' ? 'الأثر النبوي' : 'PROPHETIC REFERENCE'}</div>
    </div>` : '';
  const specs = `
    <div class="specs">
      <div class="cell"><div class="k">${lang === 'ar' ? 'المنشأ' : 'ORIGIN'}</div><div class="v">${p.origin || '—'}</div></div>
      <div class="cell"><div class="k">${lang === 'ar' ? 'الوزن / الكميّة' : 'WEIGHT / QTY'}</div><div class="v">${p.weight || '—'}</div></div>
      <div class="cell"><div class="k">${lang === 'ar' ? 'الدرجة' : 'GRADE'}</div><div class="v">${p.grade || (lang === 'ar' ? 'منتقاة' : 'CURATED')}</div></div>
      <div class="cell"><div class="k">${lang === 'ar' ? 'التصنيف' : 'CATEGORY'}</div><div class="v">${lang === 'ar' ? p.metaAr : p.meta}</div></div>
    </div>`;
  const features = `
    <div class="features">
      <div>${lang === 'ar' ? 'شهادة أصالة مرقّمة' : 'NUMBERED CERTIFICATE OF AUTHENTICITY'}</div>
      <div>${lang === 'ar' ? 'تقديم في علبة سوداء مطفيّة' : 'MATTE BLACK PRESENTATION BOX'}</div>
      <div>${lang === 'ar' ? 'توصيل فاخر مجاني داخل مصر' : 'FREE WHITE-GLOVE DELIVERY IN EGYPT'}</div>
      <div>${lang === 'ar' ? 'شحن دولي عبر DHL' : 'INTERNATIONAL SHIPPING VIA DHL'}</div>
    </div>`;
  bodyEl.innerHTML = `
    <div class="meta">${lang === 'ar' ? p.metaAr : p.meta}</div>
    <h2>${lang === 'ar' ? p.nameAr : p.name}</h2>
    ${lang === 'en' ? `<div class="ar-name">${p.nameAr}</div>` : ''}
    <div class="price-row">
      <div class="price">${fmtPrice(p.price)}${fromTag}</div>
      <div class="stock">${inStock}</div>
    </div>
    <p class="desc">${lang === 'ar' ? p.descAr : p.desc}</p>
    ${hadithBlock}
    ${specs}
    <div class="qty-row">
      <div class="qty-control">
        <button type="button" id="pdDec" aria-label="−">−</button>
        <span class="qv" id="pdQty">${pdState.qty}</span>
        <button type="button" id="pdInc" aria-label="+">+</button>
      </div>
      <button class="pd-add" id="pdAdd" type="button">${lang === 'ar' ? 'أضف إلى السلة' : 'ADD TO BASKET'}</button>
    </div>
    ${features}
  `;
  document.getElementById('pdDec').onclick = () => { pdState.qty = Math.max(1, pdState.qty - 1); document.getElementById('pdQty').textContent = pdState.qty; };
  document.getElementById('pdInc').onclick = () => { pdState.qty = Math.min(20, pdState.qty + 1); document.getElementById('pdQty').textContent = pdState.qty; };
  document.getElementById('pdAdd').onclick = () => {
    for (let i = 0; i < pdState.qty; i++) addToCart(pdState.id);
    closeProductDetail();
    setTimeout(openCart, 200);
  };
}

document.getElementById('pdClose').addEventListener('click', closeProductDetail);
document.getElementById('pdOverlay').addEventListener('click', (e) => { if (e.target.id === 'pdOverlay') closeProductDetail(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeProductDetail(); closeCart(); } });


/* Form fake-submits */
document.querySelectorAll('[data-form-submit]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const form = btn.closest('form');
    if (!form || !form.checkValidity()){ if (form) form.reportValidity(); return; }
    const success = form.querySelector('.custom-form-success, .nl-success');
    if (success){ success.hidden = false; }
    form.querySelectorAll('input, textarea').forEach(f => { if (f.type !== 'submit') f.value = ''; });
  });
});

/* ——— Featured Products (landing page 4×2 grid) ——— */
const FEATURED_IDS = [
  'ajwa-400',
  'seven-dates-700',
  'doani-sidr-250',
  'saffron-1',
  'bakhoor-madinah-30',
  'rawdah-rug',
  'aqeeq-misbaha',
  'madinah-mint-50'
];

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const lang = document.documentElement.getAttribute('lang') || 'en';
  const featured = FEATURED_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  grid.innerHTML = '';
  featured.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'shop-card';
    card.dataset.id = p.id;
    card.style.animationDelay = (i * 60) + 'ms';
    const ribbonHtml = p.ribbon ? `<div class="ribbon">${p.ribbon}</div>` : '';
    const grade = p.grade ? `<div class="grade">${lang === 'ar' ? (p.gradeAr || p.grade) : p.grade}</div>` : '';
    const imgHtml = p.img
      ? `<img src="${p.img}" alt="${p.name}" loading="lazy">`
      : `<div class="svg-label">${productSVG(p)}</div>`;
    card.innerHTML = `
      ${ribbonHtml}
      <div class="card-img">${imgHtml}</div>
      <div class="card-info">
        <div class="card-meta">${lang === 'ar' ? p.metaAr : p.meta}</div>
        <h3 class="card-name">${lang === 'ar' ? p.nameAr : p.name}</h3>
        <div class="card-origin">${p.origin}</div>
        ${grade}
        <div class="card-price">${p.price.toLocaleString()} <span>EGP</span></div>
        <button class="card-cta" onclick="addToBasket('${p.id}')">ADD TO BASKET</button>
      </div>
      <div class="card-shine"></div>`;
    grid.appendChild(card);
  });
}

/* Init */
renderFeatured();
renderShop('all');
bindShopFilters();
renderCart();

/* ——— i18n / Language toggle ——— */
const translations = {
  en: {
    'loader.word':'A HERITAGE UNFOLDS',
    'nav.shop':'Shop','nav.collections':'Collections','nav.philosophy':'Heritage','nav.gift':'Gifting','nav.journal':'Journal','nav.basket':'Basket',
    'hero.title':'HERITAGE & LUXURY','hero.tag':'IRTHMADINA.COM · CAIRO · MMXXVI','hero.cta':'Enter the Shop','hero.scroll':'SCROLL',
    'phil.eyebrow':'— I · The House',
    'phil.title':'A piece of <em>Madinah,</em><br/>composed in <em>Cairo.</em>',
    'phil.p1':'IRTH (إرث) is the Arabic word for what is inherited — passed down through hands, through generations, through a quiet act of remembering. We are an Egyptian house carrying the spiritual stillness of Madinah into objects made for the home.',
    'phil.p2':'Every prayer rug is woven, every misbaha is strung, every box of dates is sealed with the same intention: that what is given should be remembered. Each piece arrives with a Certificate of Authenticity — a quiet record that it was made by a single pair of hands.',
    'phil.sig':'— IRTH House · Cairo · MMXXVI',
    'phil.metaA':'THE PRAYER RUG · NO. 01',
    'col.eyebrow':'— II · Curated Collections',
    'col.title':'Four <em>chapters,</em><br/>one quiet <em>language.</em>',
    'col.chapter':'CHAPTER 01 / 04',
    'col.n1':'Dates & Confections','col.n2':'Honey & Sidr','col.n3':'Incense & Fragrance','col.n4':'Spiritual Heirlooms',
    'sh.eyebrow':'— III · The Shop',
    'sh.title':'Composed slowly. <em>Sent with care.</em>',
    'sh.sub':'Each piece arrives boxed in matte black, sealed with a satin ribbon, and accompanied by a hand-numbered Certificate of Authenticity. Free white-glove delivery across Egypt — international shipping via DHL.',
    'sh.f0':'All','sh.f1':'Dates','sh.f2':'Honey & Sidr','sh.f3':'Spices & Herbs','sh.f4':'Incense & Fragrance','sh.f5':'Spiritual','sh.f6':'Gift Boxes',
    'strip.s1':'FREE WHITE-GLOVE DELIVERY · EGYPT','strip.s2':'DHL EXPRESS · WORLDWIDE','strip.s3':'PAYMOB · INSTAPAY · VISA · COD','strip.s4':'WHATSAPP CHECKOUT · 24H REPLY',
    'auth.eyebrow':'— IV · No claims without proof',
    'auth.title':'Four <em>quiet documents,</em><br/>folded into <em>every box.</em>',
    'auth.sub':'Every IRTH order arrives with a hand-numbered Certificate of Authenticity, a Certificate of Origin from source, an ISO-accredited Certificate of Analysis where applicable, and a QR code that links to the lab report — no claims without proof.',
    'auth.t1':'Certificate of Origin','auth.p1':'Every Madinah date, every gram of Yemeni sidr honey, every Taif rose — sealed with a signed Certificate of Origin from the source farm or apiary.',
    'auth.t2':'Certificate of Analysis','auth.p2':'Honey, dates, herbs and oils are batch-tested in an ISO 17025 accredited lab. The COA travels with the jar — never the other way around.',
    'auth.t3':'QR Authenticity Code','auth.p3':'A unique QR pressed onto every box opens the batch record: source, lab report, packing date, and the artisan who closed the seal.',
    'auth.t4':'Heirloom Packaging','auth.p4':'Charcoal-black presentation, hand-pressed 24-carat gold emblem, Madinah-green ribbon. Made to be reused, kept, remembered.',
    'sh.add':'ADD','sh.cert':'CERTIFIED · NUMBERED',
    'gift.eyebrow':'— IV · Bespoke Gifting',
    'gift.title':'A gift, <em>composed</em><br/>for one recipient.',
    'gift.body':'Choose the pieces, the ribbon, and the dedication. Each bespoke gift is hand-assembled in our Cairo atelier, presented in matte-black with a satin ribbon and a hand-numbered Certificate of Authenticity addressed to the recipient by name.',
    'gift.c1':'HAND-NUMBERED CERTIFICATE','gift.c2':'NASKH-CALLIGRAPHED DEDICATION','gift.c3':'MATTE BLACK PRESENTATION BOX','gift.c4':'FREE WHITE-GLOVE DELIVERY','gift.cta':'Compose a Bespoke Gift',
    'journal.eyebrow':'— V · The Journal',
    'journal.title':'Letters from <em>the road,</em><br/>told <em>slowly.</em>',
    'journal.meta':'DISPATCH 01 / 03',
    'journal.k1':'CHRONICLE · 01','journal.d1':'SPRING · MMXXVI','journal.t1':'The Date Palms of Madinah','journal.ar1':'من نخيل المدينة','journal.e1':'A morning walked between the rows of palms at Quba — counting the slow harvest of Ajwa, Sukkari, and Anbara.','journal.r1':'Read the dispatch →',
    'journal.k2':'CHRONICLE · 02','journal.d2':'WINTER · MMXXVI','journal.t2':'A Letter on Slowness','journal.ar2':'رسالةٌ في التأنّي','journal.e2':'We do not measure our parcels by speed. They are measured by the steadiness of the hand that folds the linen.','journal.r2':'Read the dispatch →',
    'journal.k3':'CHRONICLE · 03','journal.d3':'AUTUMN · MMXXVI','journal.t3':'On the Weaving of Akhmim','journal.ar3':'في نسجِ أخميم','journal.e3':'A morning at the looms of Akhmim, where the prayer rugs are woven thread by thread — one rug, two months.','journal.r3':'Read the dispatch →',
    'cr.eyebrow':'— VI · Craft & Material',
    'cr.title':'Four <em>materials.</em><br/>One slow <em>discipline.</em>',
    'cr.t1':'Akhmim Velvet','cr.p1':'Heavyweight velvet woven on traditional looms in Akhmim — the same town that has woven prayer rugs for nine centuries.',
    'cr.t2':'Uncoated Paper','cr.p2':'Cotton-stock wrapping, made to age. The grain catches light the way old letters do.',
    'cr.t3':'24-Carat Gold Foil','cr.p3':'Each emblem hand-pressed by a single artisan in Cairo — never machine-stamped.',
    'cr.t4':'Royal-Green Linen','cr.p4':'Dyed in iron-mordant tradition. The colour deepens with light, never fades against it.',
    'cu.eyebrow':'— VII · Custom Orders',
    'cu.title':'Tell us <em>who it is for.</em><br/>We will compose <em>the rest.</em>',
    'cu.sub':'For weddings, Ramadan, Eid, or a quiet personal gesture — we hand-assemble bespoke heritage boxes around a single intention. Send us a brief and we will reply within one working day.',
    'cu.s1t':'Send a brief','cu.s1p':'Tell us the occasion, the recipient, your budget, and any pieces you have in mind. WhatsApp, email, or the form below — whichever is easiest.',
    'cu.s2t':'We compose a proposal','cu.s2p':'Within one working day you receive a styled mood-board with the proposed pieces, the dedication card mock-up, and the final EGP price.',
    'cu.s3t':'We hand-assemble & deliver','cu.s3p':'Once approved, your gift is composed, sealed with a numbered Certificate of Authenticity, and delivered by white-glove courier anywhere in Egypt.',
    'cu.fn':'Your name','cu.fp':'Phone or WhatsApp','cu.fo':'Occasion',
    'cu.fo1':'Wedding','cu.fo2':'Ramadan','cu.fo3':'Eid','cu.fo4':'Corporate gifting','cu.fo5':'Personal','cu.fo6':'Other',
    'cu.fb':'Budget (EGP)','cu.fm':'Tell us a little about who it is for','cu.fcta':'Send the brief','cu.fok':'Thank you. We have your brief — expect a reply within one working day.',
    'te.eyebrow':'— VIII · Voices',
    'te.title':'A few <em>letters</em><br/>from those who remembered.',
    'te.q1':'The prayer rug arrived in the most beautiful matte black box I have ever held. My father wept when he unrolled it. We will pass it down.',
    'te.n1':'Yasmin El-Sayed','te.l1':'Heliopolis, Cairo',
    'te.q2':'We ordered eighty bespoke Ramadan boxes for our team. Each one arrived with the recipient\u2019s name written in Naskh. Not a single corner was rushed.',
    'te.n2':'Omar Hosny','te.l2':'Founder · Beit Cairo',
    'te.q3':'The misbaha is heavier than I expected — in the best way. The green agate catches the light like still water. I haven\u2019t put it down since.',
    'te.n3':'Mahmoud Fawzy','te.l3':'Alexandria',
    'te.s1':'pieces composed by hand','te.s2':'customer return rate','te.s3':'cities delivered to',
    'fq.eyebrow':'— IX · Questions',
    'fq.title':'A few <em>asked,</em><br/>quietly <em>answered.</em>',
    'fq.sub':'If yours is not here, write to us at hello@irthmadina.com — we reply personally, within one working day.',
    'fq.q1':'Where are IRTH products made?','fq.a1':'Every piece is hand-assembled in our atelier in Cairo. The prayer rugs are woven in collaboration with weavers from Akhmim, the misbahas are strung in-house, and the dates are sourced from Madinah and Siwa.',
    'fq.q2':'How long does delivery take?','fq.a2':'Stock pieces ship within 48 hours. Bespoke gifts take 5–7 working days. All deliveries inside Egypt are free and white-glove. International is available on request.',
    'fq.q3':'Can I add a dedication card?','fq.a3':'Yes — every order includes a folded card written in Naskh script by our in-house calligrapher, addressed to the recipient by name. Dedications up to 40 words are complimentary.',
    'fq.q4':'Do you offer corporate gifting?','fq.a4':'Yes. We compose bespoke corporate boxes from 25 pieces upward, with co-branded Certificates of Authenticity and dedications for each recipient. Minimum 14 days lead time.',
    'fq.q5':'What is your return policy?','fq.a5':'Stock pieces may be returned, unopened, within 7 days for a full refund. Bespoke and personalised pieces are final sale. We replace any damaged piece, no questions asked.',
    'fq.q6':'How do I care for the prayer rug?','fq.a6':'Shake gently, do not machine-wash. Spot clean with a damp cloth. Once a year, air it for an afternoon in indirect sun — never direct. With this, it will outlast you.',
    'nl.eyebrow':'— X · Letters from the House',
    'nl.title':'A <em>quiet letter,</em><br/>once a month.',
    'nl.sub':'New pieces, limited drops, the occasional essay from the atelier. No noise, no discount codes — only what is worth reading.',
    'nl.cta':'Subscribe','nl.ok':'Thank you. Your first letter arrives at the next new moon.',
    'cart.title':'YOUR BASKET','cart.sub':'SUBTOTAL','cart.ship':'DELIVERY','cart.free':'FREE','cart.total':'TOTAL',
    'cart.note':'Each piece arrives in matte-black presentation with a numbered Certificate of Authenticity.','cart.checkout':'CHECKOUT VIA WHATSAPP','cart.empty':'Your basket is quiet, for now.',
    'fin.title':'A <em>legacy</em><br/>told in <em>whispers.</em>',
    'fin.body':'Step into the heritage universe of IRTH — where every object is composed slowly, given carefully, remembered always.',
    'fin.cta1':'Enter the Shop','fin.cta2':'Receive Letters',
    'ft.tag':'An Egyptian heritage house carrying the spiritual stillness of Madinah into objects made for the home.',
    'ft.h1':'HOUSE','ft.h2':'SHOP','ft.h3':'CONTACT',
    'ft.l11':'Heritage','ft.l12':'Journal','ft.l13':'Bespoke','ft.l14':'FAQ',
    'ft.l21':'Dates','ft.l22':'Honey & Sidr','ft.l23':'Fragrance','ft.l24':'Spiritual',
    'ft.legal1':'© MMXXVI · IRTH HOUSE · ALL RIGHTS RESERVED','ft.legal2':'HAND-CRAFTED IN CAIRO · EGYPT',
    'audio.on':'AMBIENT · ON','audio.off':'AMBIENT · OFF',
    'lang.toggle':'العربية',
  },
  ar: {
    'loader.word':'يَنكشِفُ الإرث',
    'nav.shop':'المتجر','nav.collections':'المجموعات','nav.philosophy':'الإرث','nav.gift':'الإهداء','nav.journal':'اليوميات','nav.basket':'السلّة',
    'hero.title':'إرثٌ وفخامة','hero.tag':'IRTHMADINA.COM · القاهرة · ٢٠٢٦','hero.cta':'ادخل المتجر','hero.scroll':'اسحب',
    'phil.eyebrow':'— ١ · البيت',
    'phil.title':'قطعةٌ من <em>المدينة،</em><br/>تُصاغُ في <em>القاهرة.</em>',
    'phil.p1':'إرث هي الكلمةُ التي تُحملُ عبر الأيادي والأجيال، وعبر فعلِ تذكُّرٍ هادئ. نحنُ بيتٌ مصريٌّ يحملُ سكينةَ المدينةِ المنورةِ الروحيّةَ في قطعٍ صُنعت للبيت.',
    'phil.p2':'كلُّ سجادةٍ تُنسَج، وكلُّ مسبحةٍ تُنظَّم، وكلُّ علبةِ تمرٍ تُختَم — بنفسِ النيّة: أنَّ ما يُهدى يجبُ أن يُذكَر. كلُّ قطعةٍ تصلُ بشهادةِ أصالةٍ مرقَّمة — سجلٌّ هادئٌ بأنّها صُنعت بيدٍ واحدة.',
    'phil.sig':'— بيت إرث · القاهرة · ٢٠٢٦',
    'phil.metaA':'سجادة الصلاة · رقم ٠١',
    'col.eyebrow':'— ٢ · مجموعاتٌ منتقاة',
    'col.title':'أربعةُ <em>فصول،</em><br/>لغةٌ <em>هادئةٌ</em> واحدة.',
    'col.chapter':'الفصل ٠١ / ٠٤',
    'col.n1':'التمور والحلوى','col.n2':'العسل والسدر','col.n3':'البخور والعطور','col.n4':'الأكسسوارات الروحية',
    'sh.eyebrow':'— ٣ · المتجر',
    'sh.title':'تُصاغُ بهدوء. <em>تُرسَلُ بعناية.</em>',
    'sh.sub':'كلُّ قطعةٍ تصلُ في علبةٍ سوداءَ مطفيّة، مختومةً بشريطٍ من الساتان، مرفقٌ بها شهادةُ أصالةٍ مرقَّمة. توصيلٌ مجانيٌّ فاخرٌ داخل مصر — شحنٌ دوليٌّ عبر DHL.',
    'sh.f0':'الكل','sh.f1':'تمور','sh.f2':'عسل وسدر','sh.f3':'توابل وأعشاب','sh.f4':'بخور وعطور','sh.f5':'روحانيات','sh.f6':'صناديق هدايا',
    'strip.s1':'توصيلٌ فاخرٌ مجاني · مصر','strip.s2':'DHL · شحنٌ دوليّ','strip.s3':'بايموب · إنستاباي · فيزا · COD','strip.s4':'إتمامٌ عبر واتساب · ردٌّ خلال ٢٤ ساعة',
    'auth.eyebrow':'— ٤ · لا ادّعاءَ بلا دليل',
    'auth.title':'أربعةُ <em>مستنداتٍ هادئة،</em><br/>مطويّةٌ في <em>كلِّ صندوق.</em>',
    'auth.sub':'كلُّ طلبٍ من إرث يصلُ بشهادةِ أصالةٍ مرقَّمةٍ يدوياً، وشهادةِ منشأٍ من المصدر، وشهادةِ تحليلٍ مختبريّةٍ بمعيارِ ISO حيثما يلزم، وكودٍ QR يَفتحُ تقريرَ المختبر — لا ادّعاءَ بلا دليل.',
    'auth.t1':'شهادةُ المنشأ','auth.p1':'كلُّ تمرةِ مدينة، وكلُّ غرامٍ من سدرٍ يمنيّ، وكلُّ وردةِ طائف — مختومةٌ بشهادةِ منشأٍ موقَّعةٍ من المزرعةِ أو المنحلِ نفسه.',
    'auth.t2':'شهادةُ التحليل','auth.p2':'العسلُ والتمرُ والأعشابُ والزيوت تُختبَرُ دفعةً دفعة في مختبرٍ معتمدٍ بمعيار ISO 17025. الشهادةُ تسافرُ مع البرطمان — لا العكس.',
    'auth.t3':'كود QR للأصالة','auth.p3':'رمزٌ فريدٌ مطبوعٌ على كلِّ صندوق يَفتحُ سجلَّ الدفعة: المصدر، تقرير المختبر، تاريخ التعبئة، والحرفيُّ الذي ختم الغطاء.',
    'auth.t4':'تغليفٌ يُورَّث','auth.p4':'تقديمٌ فحميٌّ، شعارٌ ذهبيٌّ بعيارِ ٢٤ مضغوطٌ باليد، شريطٌ بأخضرِ المدينة. صُنعَ ليُستعمَلَ مرّةً تلوَ الأخرى، ويُذكَر.',
    'sh.add':'أضف','sh.cert':'شهادة أصالة',
    'gift.eyebrow':'— ٤ · الإهداء الخاص',
    'gift.title':'هديةٌ <em>تُصاغ</em><br/>لشخصٍ واحد.',
    'gift.body':'اختر القطع، والشريط، والإهداء. كلُّ هديةٍ خاصةٍ تُجمَّعُ يدوياً في أتيليه القاهرة، تُقدَّمُ في علبةٍ سوداءَ مطفيّةٍ بشريطِ ساتانٍ وشهادةِ أصالةٍ مرقَّمةٍ موجَّهةٍ للمستلِم باسمِه.',
    'gift.c1':'شهادة أصالة مرقَّمة','gift.c2':'إهداء بخطِّ النسخ','gift.c3':'علبة تقديم سوداء مطفيّة','gift.c4':'توصيل مجاني فاخر','gift.cta':'صَمِّم هديةً خاصّة',
    'journal.eyebrow':'— ٥ · اليوميات',
    'journal.title':'رسائلُ من <em>الطريق،</em><br/>تُروى <em>بهدوءٍ.</em>',
    'journal.meta':'بريد ٠١ / ٠٣',
    'journal.k1':'حكاية · ٠١','journal.d1':'ربيع · ٢٠٢٦','journal.t1':'نخيل المدينة','journal.ar1':'','journal.e1':'صباحٌ مشى بين صفوفِ النخيلِ في قُباء — يُحصي حصادَ العَجوة والسُّكَّري والعَنبَرة.','journal.r1':'اقرأ الرسالة →',
    'journal.k2':'حكاية · ٠٢','journal.d2':'شتاء · ٢٠٢٦','journal.t2':'رسالةٌ في التأنّي','journal.ar2':'','journal.e2':'لا نَقيسُ علبَنا بالسرعة. تُقاسُ بثباتِ اليدِ التي تَطوي الكتّان.','journal.r2':'اقرأ الرسالة →',
    'journal.k3':'حكاية · ٠٣','journal.d3':'خريف · ٢٠٢٦','journal.t3':'في نسجِ أخميم','journal.ar3':'','journal.e3':'صباحٌ على أنوالِ أخميم، حيثُ تُنسَجُ سجاداتُ الصلاةِ خيطاً خيطاً — سجادةٌ واحدة، شهران.','journal.r3':'اقرأ الرسالة →',
    'cr.eyebrow':'— ٦ · الحرفة والمادة',
    'cr.title':'أربعُ <em>مواد.</em><br/>انضباطٌ <em>هادئٌ</em> واحد.',
    'cr.t1':'مخمل أخميم','cr.p1':'مخملٌ ثقيلٌ يُنسَجُ على أنوالٍ تقليديةٍ في أخميم — نفسُ البلدةِ التي نسجت سجاداتِ الصلاةِ منذ تسعةِ قرون.',
    'cr.t2':'الورق غير المطلي','cr.p2':'غلافٌ من القطن، صُنع ليكبَر. خيوطُه تلتقطُ الضوءَ كما تفعلُ الرسائلُ القديمة.',
    'cr.t3':'ذهب عيار ٢٤','cr.p3':'كلُّ شعارٍ يُضغط باليدِ على يدِ حِرفيٍّ واحدٍ في القاهرة — لا يُختَم بآلة.',
    'cr.t4':'كتان أخضر ملكي','cr.p4':'يُصبغ بطريقةِ الحديدِ التقليدية. لونُه يَعمَقُ مع النور، ولا يَبهُتُ أبداً.',
    'cu.eyebrow':'— ٧ · الطلبات الخاصة',
    'cu.title':'أخبرنا <em>لمن هي.</em><br/>ونحنُ نُكمل <em>التركيبة.</em>',
    'cu.sub':'للأعراس، ورمضان، والعيد، أو لِفتةٍ شخصيةٍ هادئة — نُجمِّعُ صناديقَ الإرثَ بيدنا حولَ نيّةٍ واحدة. أرسل لنا فكرتَك ونردُّ خلال يومِ عملٍ واحد.',
    'cu.s1t':'أرسل الفكرة','cu.s1p':'أخبرنا بالمناسبة، والمستلِم، والميزانية، وأي قِطَعٍ في بالك. واتساب، إيميل، أو النموذجُ بالأسفل — أيُّ طريقةٍ أيسر.',
    'cu.s2t':'نُكوِّن لك مقترحاً','cu.s2p':'خلالَ يومِ عملٍ تستلمُ لوحةَ مزاجٍ منسَّقةً بالقِطَعِ المقترَحة، نموذجَ بطاقةِ الإهداء، والسعرَ النهائيَّ بالجنيه المصري.',
    'cu.s3t':'نجمِّعُها بيدنا ونوصِّلها','cu.s3p':'بعد موافقتِك، تُصاغُ الهدية، تُختمُ بشهادةِ أصالةٍ مرقَّمة، وتُوصَّلُ بساعي توصيلٍ فاخرٍ في أي مكانٍ بمصر.',
    'cu.fn':'اسمك','cu.fp':'هاتف أو واتساب','cu.fo':'المناسبة',
    'cu.fo1':'زفاف','cu.fo2':'رمضان','cu.fo3':'عيد','cu.fo4':'إهداء مؤسسي','cu.fo5':'شخصي','cu.fo6':'أخرى',
    'cu.fb':'الميزانية (جنيه)','cu.fm':'أخبرنا قليلاً عن المستلِم','cu.fcta':'أرسل الفكرة','cu.fok':'شكراً لك. وصلتنا فكرتُك — ننتظرك بردٍّ خلالَ يومِ عملٍ واحد.',
    'te.eyebrow':'— ٨ · أصوات',
    'te.title':'بضعُ <em>رسائل</em><br/>ممَّن تذكَّروا.',
    'te.q1':'وصلت سجادةُ الصلاةِ في أجملِ علبةٍ سوداءَ حملتُها يوماً. أبي بكى حين فردَها. سنُورِّثُها.',
    'te.n1':'ياسمين السيد','te.l1':'مصر الجديدة، القاهرة',
    'te.q2':'طلبنا ثمانينَ علبةَ رمضانٍ خاصةً لفريقِنا. كلُّ علبةٍ وصلت باسمِ صاحبِها بخطِّ النسخ. ولا زاويةٌ كانت مستعجَلة.',
    'te.n2':'عمر حسني','te.l2':'مؤسس · بيت القاهرة',
    'te.q3':'المسبحةُ أثقلُ ممّا توقّعت — بأجملِ معنى. العقيقُ الأخضرُ يلتقطُ الضوءَ كماءٍ ساكن. لم أتركها منذ وصلت.',
    'te.n3':'محمود فوزي','te.l3':'الإسكندرية',
    'te.s1':'قطعة صُنعت باليد','te.s2':'نسبة العودة','te.s3':'مدينة وصلنا إليها',
    'fq.eyebrow':'— ٩ · أسئلة',
    'fq.title':'بضعةُ <em>أسئلة،</em><br/>أُجيبت <em>بهدوءٍ.</em>',
    'fq.sub':'لو سؤالك ليس هنا، اكتب لنا على hello@irthmadina.com — نردُّ بأنفسنا، خلالَ يومِ عملٍ واحد.',
    'fq.q1':'أين تُصنع منتجات IRTH؟','fq.a1':'كلُّ قطعةٍ تُجمَّعُ يدوياً في أتيليه القاهرة. سجادات الصلاة تُنسَجُ بالتعاون مع نسّاجين من أخميم، المسابحُ تُنظَّمُ في الأتيليه، والتمور تُجلب من المدينة والسيوة.',
    'fq.q2':'كم يستغرق التوصيل؟','fq.a2':'القطع المتوفرة تُشحَن خلال ٤٨ ساعة. الهدايا الخاصة تأخذ ٥–٧ أيام عمل. كل التوصيلات داخل مصر مجانية وفاخرة. التوصيل الدولي متاحٌ عند الطلب.',
    'fq.q3':'هل أستطيع إضافة بطاقة إهداء؟','fq.a3':'نعم — كلُّ طلبٍ يتضمَّنُ بطاقةً مطويةً بخطِّ النسخ من خطّاطنا، موجَّهةً للمستلِم باسمه. الإهداءات حتى ٤٠ كلمة مجانية.',
    'fq.q4':'هل تقدِّمون إهداءات مؤسسية؟','fq.a4':'نعم. نُجمِّعُ صناديقَ مؤسسيةً خاصةً من ٢٥ قطعةً فما فوق، بشهاداتِ أصالةٍ مشتركةِ العلامة وإهداءاتٍ لكلِّ مستلِم. الحدُّ الأدنى ١٤ يومَ عمل.',
    'fq.q5':'ما سياسة الإرجاع؟','fq.a5':'القطع المتوفرة يمكنُ إرجاعُها، غيرَ مفتوحة، خلالَ ٧ أيامٍ لاستردادٍ كامل. القطع الخاصة والمخصَّصة بيعٌ نهائي. نستبدلُ أي قطعةٍ تالفةٍ بلا أسئلة.',
    'fq.q6':'كيف أعتني بسجادة الصلاة؟','fq.a6':'انفُضها بلطف، لا تغسلها في الغسالة. نظِّف البقعَ بقطعةِ قماشٍ مبلَّلة. مرةً في السنة، اعرضها لظهيرةٍ في الشمسِ غير المباشرة — لا المباشرة. وبهذا، ستعيشُ بعدك.',
    'nl.eyebrow':'— ١٠ · رسائل من البيت',
    'nl.title':'رسالةٌ <em>هادئة،</em><br/>مرّةً في الشهر.',
    'nl.sub':'قطعٌ جديدة، إصداراتٌ محدودة، ومقالةٌ بين الحينِ والآخر من الأتيليه. لا ضجيج، لا أكوادَ خصم — فقط ما يستحقُّ القراءة.',
    'nl.cta':'اشترك','nl.ok':'شكراً لك. أوّلُ رسالةٍ تصلُك مع الهلالِ القادم.',
    'cart.title':'سلَّتُك','cart.sub':'المجموع الفرعي','cart.ship':'التوصيل','cart.free':'مجاني','cart.total':'الإجمالي',
    'cart.note':'كلُّ قطعةٍ تصلُ في تقديمٍ أسودَ مطفيٍّ بشهادةِ أصالةٍ مرقَّمة.','cart.checkout':'إتمام الطلب عبر واتساب','cart.empty':'سلَّتُكَ هادئةٌ بعد.',
    'fin.title':'<em>إرثٌ</em><br/>يُحكى <em>همساً.</em>',
    'fin.body':'ادخل عالمَ IRTH — حيث تُصاغُ كلُّ قطعةٍ بهدوءٍ، وتُهدى بعنايةٍ، وتُذكَرُ دائماً.',
    'fin.cta1':'ادخل المتجر','fin.cta2':'اشترك في الرسائل',
    'ft.tag':'بيتُ إرثٍ مصريٌّ يَحملُ سكينةَ المدينةِ المنورةِ الروحيّةَ في قطعٍ صُنعت للبيت.',
    'ft.h1':'البيت','ft.h2':'المتجر','ft.h3':'التواصل',
    'ft.l11':'الإرث','ft.l12':'اليوميات','ft.l13':'الإهداء الخاص','ft.l14':'الأسئلة',
    'ft.l21':'تمور','ft.l22':'عسل وسدر','ft.l23':'بخور وعطور','ft.l24':'روحانيات',
    'ft.legal1':'© ٢٠٢٦ · بيت إرث · جميع الحقوق محفوظة','ft.legal2':'صُنع يدوياً في القاهرة · مصر',
    'audio.on':'موسيقى · فعّال','audio.off':'موسيقى · مغلق',
    'lang.toggle':'English',
  }
};

function applyLang(lang){
  const dict = translations[lang];
  if (!dict) return;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (dict[k] !== undefined) el.textContent = dict[k];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const k = el.getAttribute('data-i18n-html');
    if (dict[k] !== undefined) el.innerHTML = dict[k];
  });
  const tog = document.getElementById('langToggle');
  if (tog) tog.textContent = dict['lang.toggle'];

  // re-render shop in new language (keep active filter)
  const activeFilter = (document.querySelector('.shop-filters .filter.active') || {}).dataset?.filter || 'all';
  renderShop(activeFilter);
  renderCart();

  // collections active item — refresh name/price label
  const active = document.querySelector('.col-item.active');
  if (active) {
    setActiveCollection(+active.dataset.idx);
  }
  const muted = document.getElementById('audio').classList.contains('muted');
  if (audioLabel) audioLabel.textContent = dict[muted ? 'audio.off' : 'audio.on'];
  try { localStorage.setItem('irth.lang', lang); } catch(e){}
}

// Lang toggle binding
const langToggle = document.getElementById('langToggle');
if (langToggle){
  langToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('lang') || 'en';
    applyLang(cur === 'en' ? 'ar' : 'en');
  });
}
// Restore saved preference
try {
  const saved = localStorage.getItem('irth.lang');
  if (saved === 'ar') applyLang('ar');
} catch(e){}

/* ═══════════════════════════════════════
   ENHANCEMENTS — Lenis · GSAP · SplitType · Three.js
   ═══════════════════════════════════════ */

(function initEnhancements() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ——— Lenis smooth scroll ——— */
  const lenis = (typeof Lenis !== 'undefined') ? new Lenis({
    duration: 1.35,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true
  }) : null;

  if (lenis) {
    function rafLoop(time) { lenis.raf(time); requestAnimationFrame(rafLoop); }
    requestAnimationFrame(rafLoop);

    /* ——— Scroll progress bar ——— */
    lenis.on('scroll', ({ scroll, limit }) => {
      const bar = document.getElementById('scrollBar');
      if (bar && limit > 0) bar.style.width = ((scroll / limit) * 100) + '%';
    });
  }

  /* ——— GSAP + ScrollTrigger ——— */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(v) { if (arguments.length) lenis.scrollTo(v); return lenis.scroll; },
        getBoundingClientRect() { return { top:0, left:0, width:window.innerWidth, height:window.innerHeight }; }
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
    }

    /* Dune parallax */
    if (!prefersReduced) {
      document.querySelectorAll('.dune').forEach(dune => {
        const spd = parseFloat(dune.dataset.parallax || 0.25);
        gsap.to(dune, {
          y: () => window.innerHeight * spd * -0.5,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
      });
    }

    /* Ritual bg parallax */
    const ritualBgEl = document.querySelector('.ritual-bg');
    if (ritualBgEl && !prefersReduced) {
      gsap.to(ritualBgEl, {
        y: '18%', ease: 'none',
        scrollTrigger: { trigger: '.ritual', start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }

    /* Stats counter animation */
    document.querySelectorAll('.t-stat .n').forEach(el => {
      const raw = el.textContent.trim();
      const num = parseInt(raw.replace(/[^0-9]/g, '')) || 0;
      const suffix = raw.replace(/[0-9,٬]/g, '').trim();
      if (!num) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: num, duration: 1.9, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(obj.val).toLocaleString() + suffix; },
        scrollTrigger: { trigger: el.closest('.t-stats') || el, start: 'top 82%', once: true }
      });
    });

    /* Auth cells stagger */
    gsap.from('.auth-cell', {
      x: -28, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: '.auth-grid', start: 'top 80%' }
    });

    /* Craft cells stagger */
    gsap.from('.craft-cell', {
      y: 38, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: '.craft .grid', start: 'top 80%' }
    });
  }

  /* ——— SplitType text reveals ——— */
  if (typeof SplitType !== 'undefined' && !prefersReduced) {
    setTimeout(() => {
      document.querySelectorAll('h2.display, h1.eng').forEach(el => {
        try {
          const lang = document.documentElement.getAttribute('lang') || 'en';
          const types = lang === 'ar' ? 'words' : 'words,chars';
          const split = new SplitType(el, { types });
          const targets = split.chars || split.words;
          if (!targets || !targets.length) return;
          gsap.from(targets, {
            y: '60%', opacity: 0, duration: 0.75, stagger: 0.025, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
          });
        } catch(e) {}
      });
    }, 1800);
  }

  /* geo-canvas replaced by #geo-pattern CSS SVG tile (Fix 1) */

  /* ——— Hamburger menu ——— */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenuBtn = document.getElementById('closeMenu');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
    mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) closeMobileMenu(); });
  }

})(); // end initEnhancements

/* ═══════════════════════════════════════════════════════════
   A · GLSL SAND SHADER — WebGL procedural desert dunes
   ═══════════════════════════════════════════════════════════ */
(function initSandShader() {
  const canvas = document.getElementById('hero-shader');
  if (!canvas) return;
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  const VS = `attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0,1);}`;
  const FS = `
    precision mediump float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec2 u_mouse;

    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){
      vec2 i=floor(p),f=fract(p);
      vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                 mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
    }
    float fbm(vec2 p){
      float v=0.0,a=0.5;
      for(int i=0;i<5;i++){v+=a*noise(p);p*=2.1;a*=0.5;}
      return v;
    }

    void main(){
      vec2 uv=gl_FragCoord.xy/u_res;
      vec2 mouse=u_mouse/u_res;

      // Parallax from mouse
      vec2 par=uv+mouse*vec2(0.04,-0.02);

      // Dune field — slow undulation
      float t=u_time*0.18;
      float dune=fbm(par*vec2(2.5,1.8)+vec2(t*0.3,0.0));
      dune+=0.4*fbm(par*vec2(5.0,3.5)-vec2(t*0.2,t*0.1));

      // Dune silhouette height — rises from bottom 60% of screen
      float horizon=0.42+dune*0.18;
      float above=smoothstep(horizon-0.012,horizon+0.012,uv.y);

      // Sky: deep Madinah green-black
      vec3 sky=mix(vec3(0.012,0.038,0.028),vec3(0.022,0.072,0.055),uv.y*0.8);

      // Sand: dark warm sand base
      vec3 sandBase=mix(vec3(0.055,0.038,0.018),vec3(0.09,0.065,0.03),dune);

      // Gold crest: specular highlight at dune ridge
      float ridge=1.0-smoothstep(0.0,0.025,abs(uv.y-horizon));
      float windRipple=sin((par.x*18.0+t)*3.14)*0.5+0.5;
      float crestGold=ridge*windRipple*0.85;
      vec3 gold=vec3(0.788,0.643,0.361); // #C9A45C
      vec3 sandColor=mix(sandBase,gold,crestGold);

      // Subtle wind ripples on sand surface
      float ripple=sin(par.x*42.0-t*4.0)*0.012+sin(par.x*28.0+t*2.5)*0.008;
      sandColor+=vec3(ripple*0.6,ripple*0.45,ripple*0.1);

      // Blend sky / sand
      vec3 col=mix(sandColor,sky,above);

      // Vignette
      vec2 vig=uv*2.0-1.0;
      col*=1.0-dot(vig,vig)*0.38;

      // Very subtle — site layers on top; keep opacity low
      gl_FragColor=vec4(col,0.72);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes   = gl.getUniformLocation(prog, 'u_res');
  const uTime  = gl.getUniformLocation(prog, 'u_time');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, {passive:true});

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize, {passive:true});

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const start = performance.now();

  function draw() {
    requestAnimationFrame(draw);
    const t = prefersReduced ? 0 : (performance.now() - start) / 1000;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, prefersReduced ? 0 : mx, prefersReduced ? 0 : my);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  draw();
})();

/* ═══════════════════════════════════════════════════════════
   C1 · MAGNETIC CURSOR + GOLD PARTICLE TRAIL
   ═══════════════════════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const trail = document.getElementById('cursor-trail');
  if (!dot || !ring || !trail) return;

  // Size trail canvas
  trail.width  = window.innerWidth;
  trail.height = window.innerHeight;
  window.addEventListener('resize', () => {
    trail.width  = window.innerWidth;
    trail.height = window.innerHeight;
  }, {passive:true});
  const ctx = trail.getContext('2d');

  let rx = 0, ry = 0, mx = 0, my = 0;
  const particles = [];

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;

    // Spawn trail particle
    if (particles.length < 18) {
      particles.push({ x: mx, y: my, life: 1, vx: (Math.random()-0.5)*0.8, vy: -Math.random()*1.2-0.4, r: Math.random()*2+1 });
    }
  }, {passive:true});

  // Hover detection
  const hoverTargets = 'a,button,[data-cursor="hover"],.shop-card,.col-item,.faq-item summary,.gm-item';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovered');
  });

  function animate() {
    requestAnimationFrame(animate);
    // Lerp ring
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;

    // Draw trail particles
    ctx.clearRect(0, 0, trail.width, trail.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.life -= 0.028;
      if (p.life <= 0) { particles.splice(i,1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,164,92,${p.life * 0.55})`;
      ctx.fill();
    }
  }
  animate();
})();

/* ═══════════════════════════════════════════════════════════
   C2 · SCROLL-SCRUBBED CAMEL VIDEO
   ═══════════════════════════════════════════════════════════ */
(function initVideoScrub() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const vid = document.querySelector('.hero video');
  if (!vid) return;
  vid.removeAttribute('autoplay');
  vid.setAttribute('preload','auto');
  vid.setAttribute('muted','');
  vid.setAttribute('playsinline','');
  vid.muted = true;
  vid.pause();

  ScrollTrigger.create({
    trigger: '#hero', start: 'top top', end: 'bottom top',
    onUpdate(self) {
      if (vid.readyState >= 2 && vid.duration) {
        vid.currentTime = self.progress * vid.duration;
      }
    }
  });
})();

/* ═══════════════════════════════════════════════════════════
   C3 · HORIZONTAL SCROLL SHOP (GSAP PIN)
   ═══════════════════════════════════════════════════════════ */
(function initHorizShop() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.innerWidth < 900) return; // mobile: stay vertical

  const wrap  = document.getElementById('shopHWrap');
  const track = document.getElementById('shopGrid');
  if (!wrap || !track) return;

  // Wait for shop cards to render
  setTimeout(() => {
    const trackW = track.scrollWidth;
    const viewW  = window.innerWidth;
    if (trackW <= viewW) return;

    gsap.to(track, {
      x: () => -(trackW - viewW + 80) + 'px',
      ease: 'none',
      scrollTrigger: {
        trigger: '.shop',
        pin: true,
        scrub: 1.2,
        end: () => '+=' + (trackW - viewW + 80),
        invalidateOnRefresh: true
      }
    });
  }, 800);
})();

/* ═══════════════════════════════════════════════════════════
   C5 · GALLERY LIGHTBOX
   ═══════════════════════════════════════════════════════════ */
(function initLightbox() {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  const lbPrev  = document.getElementById('lb-prev');
  const lbNext  = document.getElementById('lb-next');
  const lbCount = document.getElementById('lb-counter');
  if (!lb || !lbImg) return;

  const items = Array.from(document.querySelectorAll('.gm-item img'));
  let current = 0;

  function show(idx) {
    current = (idx + items.length) % items.length;
    lbImg.src = items[current].src;
    lbImg.alt = items[current].alt;
    if (lbCount) lbCount.textContent = (current + 1) + ' / ' + items.length;
  }

  function open(idx) {
    show(idx);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gm-item').forEach((el, i) => {
    el.addEventListener('click', () => open(i));
  });

  if (lbClose) lbClose.addEventListener('click', close);
  if (lbPrev)  lbPrev.addEventListener('click', () => show(current - 1));
  if (lbNext)  lbNext.addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

/* ═══════════════════════════════════════════════════════════
   C6 · ENHANCED SECTION ENTRANCE ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
(function initEntranceAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (prefersReduced) return;

  // Philosophy image: clip-path reveal
  const philImg = document.querySelector('.philosophy .vignette');
  if (philImg) {
    gsap.fromTo(philImg,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.2, ease: 'power3.inOut',
        scrollTrigger: { trigger: philImg, start: 'top 80%' } }
    );
  }

  // Collection list items: cascade
  gsap.from('.col-item', {
    y: 28, opacity: 0, duration: 0.65, stagger: 0.09, ease: 'power2.out',
    scrollTrigger: { trigger: '.col-list', start: 'top 78%' }
  });

  // Testimonial cards: fan-in
  gsap.from('.t-card', {
    rotation: -2.5, y: 28, opacity: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.t-grid', start: 'top 80%' }
  });

  // Final arch: scale reveal
  const finalArch = document.querySelector('.final .arch');
  if (finalArch) {
    gsap.from(finalArch, {
      scaleY: 0, transformOrigin: 'bottom center', duration: 1.4, ease: 'power4.out',
      scrollTrigger: { trigger: '.final', start: 'top 75%' }
    });
  }

  // Journal cards: stagger slide
  gsap.from('.journal-card', {
    y: 50, opacity: 0, duration: 0.8, stagger: 0.14, ease: 'power2.out',
    scrollTrigger: { trigger: '.journal', start: 'top 78%' }
  });
})();

/* ═══════════════════════════════════════════════════════════
   B · 3D PRODUCT VIEWER (Three.js per-card mini renderer)
   ═══════════════════════════════════════════════════════════ */
(function initProduct3D() {
  if (typeof THREE === 'undefined') return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (prefersReduced) return;

  // Single shared renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
  camera.position.z = 2.2;

  const goldLight = new THREE.PointLight(0xC9A45C, 2.5, 8);
  goldLight.position.set(1.5, 2, 1.5);
  scene.add(goldLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const loader   = new THREE.TextureLoader();
  let   mesh     = null;
  let   targetRX = 0, targetRY = 0;
  let   animId   = null;
  let   activeCard = null;

  function buildMesh(imgSrc, callback) {
    loader.load(imgSrc, tex => {
      if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); }
      const aspect = tex.image.width / tex.image.height || 1;
      const geo = new THREE.PlaneGeometry(aspect > 1 ? 1.4 : 1.0, aspect > 1 ? 1.0 : 1.4);
      const mat = new THREE.MeshLambertMaterial({ map: tex, transparent: true });
      mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      if (callback) callback();
    }, undefined, () => { if (callback) callback(); });
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    if (mesh) {
      mesh.rotation.y += (targetRY - mesh.rotation.y) * 0.08;
      mesh.rotation.x += (targetRX - mesh.rotation.x) * 0.08;
      mesh.rotation.y += 0.004; // slow auto-spin
    }
    if (activeCard) {
      const size = activeCard.getBoundingClientRect();
      renderer.setSize(size.width, size.height);
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }
  }

  function attachTo(card) {
    const imgEl = card.querySelector('.img img');
    if (!imgEl) return;
    activeCard = card.querySelector('.img');

    // Insert renderer canvas
    let cvs = card.querySelector('.prod-3d-canvas');
    if (!cvs) {
      cvs = renderer.domElement;
      cvs.classList.add('prod-3d-canvas');
      activeCard.appendChild(cvs);
    }

    buildMesh(imgEl.src, () => {
      if (animId) cancelAnimationFrame(animId);
      animate();
    });

    card.addEventListener('mousemove', e => {
      const r = activeCard.getBoundingClientRect();
      targetRY = ((e.clientX - r.left) / r.width  - 0.5) *  0.5;
      targetRX = ((e.clientY - r.top)  / r.height - 0.5) * -0.5;
    });
  }

  function detachFrom(card) {
    targetRX = 0; targetRY = 0;
    cancelAnimationFrame(animId);
    activeCard = null;
    const cvs = card.querySelector('.prod-3d-canvas');
    if (cvs) cvs.remove();
  }

  // Observe shop grid for dynamically rendered cards
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.shop-card').forEach(card => {
      if (card._3dBound) return;
      card._3dBound = true;
      card.addEventListener('mouseenter', () => attachTo(card));
      card.addEventListener('mouseleave', () => detachFrom(card));
    });
  });

  const shopGrid = document.getElementById('shopGrid');
  if (shopGrid) observer.observe(shopGrid, { childList: true });
})();

/* ═══════════════════════════════════════════════════════════
   C9 · AUDIO VISUALIZER (Web Audio API)
   ═══════════════════════════════════════════════════════════ */
(function initAudioViz() {
  const audioBtn = document.getElementById('audio');
  if (!audioBtn) return;

  // Inject viz container next to bars
  const vizEl = document.createElement('span');
  vizEl.id = 'audioViz';
  for (let i = 0; i < 5; i++) { const b = document.createElement('span'); b.style.height='2px'; vizEl.appendChild(b); }
  audioBtn.prepend(vizEl);
  const bars = Array.from(vizEl.children);

  let audioCtx, analyser, source, dataArr;
  let vizRunning = false;

  function startViz(mediaEl) {
    if (vizRunning || !mediaEl) return;
    try {
      audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
      analyser   = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      dataArr    = new Uint8Array(analyser.frequencyBinCount);
      source     = audioCtx.createMediaElementSource(mediaEl);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      vizRunning = true;
      drawViz();
    } catch(e) {}
  }

  function drawViz() {
    if (!vizRunning) return;
    requestAnimationFrame(drawViz);
    analyser.getByteFrequencyData(dataArr);
    bars.forEach((b, i) => {
      const v = dataArr[i + 1] || 0;
      b.style.height = Math.max(2, (v / 255) * 14) + 'px';
    });
  }

  // Hook into existing audio toggle
  audioBtn.addEventListener('click', () => {
    const ambientAudio = document.querySelector('audio');
    if (ambientAudio && !vizRunning) startViz(ambientAudio);
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  });
})();

/* ═══════════════════════════════════════════════════════════
   GOLD DIVIDERS — inject between sections
   ═══════════════════════════════════════════════════════════ */
(function injectGoldDividers() {
  const insertAfter = ['#philosophy','#collections','#authenticity','#ritual','#gift','#gallery','#testimonials'];
  insertAfter.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) { const hr = document.createElement('hr'); hr.className = 'gold-divider'; el.after(hr); }
  });
})();

/* ═══════════════════════════════════════════════════════════
   V4·A — LOADER WAX SEAL STAMP
   ═══════════════════════════════════════════════════════════ */
(function initLoaderStamp() {
  const mark = document.getElementById('loaderMark');
  if (!mark) return;
  // Trigger stamp animation after tiny delay so browser paints first
  requestAnimationFrame(() => requestAnimationFrame(() => {
    mark.classList.add('stamped');
  }));
})();

/* ═══════════════════════════════════════════════════════════
   V4·B — TEXT SCRAMBLE (Hero titles)
   ═══════════════════════════════════════════════════════════ */
(function initTextScramble() {
  const AR = 'إرثبتثجحخدذرزسشصضطظعغفقكلمنهوي';
  const EN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function scramble(el, isAr, ms) {
    const chars = isAr ? AR : EN;
    const orig  = el.textContent;
    let   frame = 0;
    const total = Math.max(40, Math.floor(ms / 16));
    const id = setInterval(() => {
      frame++;
      const prog = frame / total;
      el.textContent = orig.split('').map((c, i) => {
        if (c === ' ' || c === ' ') return c;
        if (i / orig.length < prog * 1.1) return orig[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (frame >= total) { clearInterval(id); el.textContent = orig; }
    }, 16);
  }

  function runScramble() {
    const eng = document.querySelector('.hero h1.eng');
    const ar  = document.querySelector('.hero .ar');
    if (ar)  setTimeout(() => scramble(ar,  true,  2000), 200);
    if (eng) setTimeout(() => scramble(eng, false, 1600), 500);
  }

  // Fire when loader disappears
  const loader = document.getElementById('loader');
  if (!loader) { runScramble(); return; }
  const obs = new MutationObserver(() => {
    if (loader.classList.contains('gone')) { obs.disconnect(); runScramble(); }
  });
  obs.observe(loader, { attributes: true, attributeFilter: ['class'] });
})();

/* ═══════════════════════════════════════════════════════════
   V4·C — 3D CARD TILT (shop cards)
   ═══════════════════════════════════════════════════════════ */
(function initCardTilt() {
  if (window.matchMedia('(max-width:900px)').matches) return;
  const MAX = 10;

  function bind(card) {
    if (card._tiltBound) return;
    card._tiltBound = true;
    const shine = document.createElement('div');
    shine.className = 'card-shine';
    card.appendChild(shine);

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transition = 'transform .08s linear,border-color .9s';
      card.style.transform  = `perspective(700px) rotateY(${x*MAX}deg) rotateX(${-y*MAX}deg) scale(1.025)`;
      shine.style.background = `radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%, rgba(231,201,138,.22) 0%, transparent 65%)`;
    }, {passive:true});

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1),border-color .9s';
      card.style.transform  = '';
      shine.style.background = '';
    });
  }

  const obs = new MutationObserver(() => {
    document.querySelectorAll('.shop-card').forEach(bind);
  });
  const grid = document.getElementById('shopGrid');
  if (grid) obs.observe(grid, {childList:true});
  document.querySelectorAll('.shop-card').forEach(bind);
})();

/* ═══════════════════════════════════════════════════════════
   V4·D — ARABIC CHAR TRAIL
   ═══════════════════════════════════════════════════════════ */
(function initArTrail() {
  if (window.matchMedia('(max-width:900px)').matches) return;
  const cv  = document.getElementById('ar-trail');
  if (!cv) return;
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
  window.addEventListener('resize', () => { cv.width = window.innerWidth; cv.height = window.innerHeight; }, {passive:true});
  const ctx  = cv.getContext('2d');
  const CHARS = ['إ','ر','ث','و','ر','ا','ث'];
  const sparks = [];
  let   mx = 0, my = 0, lastSpawn = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    const now = Date.now();
    if (now - lastSpawn > 120) {          // spawn every ~120ms
      lastSpawn = now;
      sparks.push({
        x: mx, y: my,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        life: 1,
        vx: (Math.random() - .5) * 1.2,
        vy: -Math.random() * 1.4 - .6,
        size: Math.random() * 6 + 9
      });
    }
  }, {passive:true});

  function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.textAlign = 'center';
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.life -= 0.022;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.font = `${s.size * s.life + 6}px Cairo,sans-serif`;
      ctx.fillStyle = `rgba(201,164,92,${s.life * .55})`;
      ctx.fillText(s.char, s.x, s.y);
    }
  }
  loop();
})();

/* ═══════════════════════════════════════════════════════════
   V4·E — VIEW TRANSITIONS for lightbox
   ═══════════════════════════════════════════════════════════ */
(function patchLightboxTransitions() {
  if (!document.startViewTransition) return;
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  // Override click-open to use View Transition
  document.querySelectorAll('.gm-item').forEach((el, i) => {
    el.addEventListener('click', () => {
      document.startViewTransition(() => {
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   V4·F — HORIZONTAL SHOP PARALLAX DEPTH
   ═══════════════════════════════════════════════════════════ */
(function initShopParallax() {
  if (window.matchMedia('(max-width:900px)').matches) return;
  const track = document.getElementById('shopGrid');
  if (!track) return;

  function applyDepth() {
    const cards = Array.from(track.querySelectorAll('.shop-card'));
    const scrollX = track._gsapX || 0;   // GSAP sets via transform, so read via matrix
    cards.forEach((c, i) => {
      const depth = (i % 3 === 1) ? 0.06 : (i % 3 === 2) ? -0.04 : 0.02;
      // Slight vertical offset based on horizontal scroll position
      const rect  = c.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2 - window.innerWidth / 2;
      if (!c._tiltBound) return; // don't conflict if tilt active
      // Subtle Y parallax only when not hovering
      if (!c.matches(':hover')) {
        const yOff = cx * depth;
        c.style.transform = `translateY(${yOff}px)`;
      }
    });
    requestAnimationFrame(applyDepth);
  }
  // Start after shop is built
  setTimeout(applyDepth, 1200);
})();

/* ═══════════════════════════════════════════════════════════
   V4·G — SECTION CLIP-PATH REVEALS
   ═══════════════════════════════════════════════════════════ */
(function initClipReveal() {
  if (typeof IntersectionObserver === 'undefined') return;
  // Apply to large display headings
  // Only clip-reveal on elements WITHOUT existing .reveal class (avoid transition conflict)
  document.querySelectorAll('h2.display, .ritual .copy h2').forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('section-clipreveal');
    }
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-clipreveal').forEach(el => obs.observe(el));
})();

