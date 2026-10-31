/* Tropicaña · lógica del sitio (idioma, restaurante, horario, galería y reservas) */
let L="es",LOC="sombreiro";
const tr=k=>{if(k.startsWith("="))return k.slice(1);if(LOC==="mallos"&&M[L][k]!=null)return M[L][k];return T[L][k]??""};
const fmt=h=>String(Math.floor(h)%24).padStart(2,"0")+":"+(h%1?"30":"00");
const fill=(s,o)=>s.replace(/\{(\w)\}/g,(_,k)=>o[k]);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const $=id=>document.getElementById(id);

function madridNow(){
  const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());
  const g=t=>p.find(x=>x.type===t).value;
  return {wd:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(g("weekday")),h:(parseInt(g("hour"),10)%24)+parseInt(g("minute"),10)/60};
}
function renderTime(){
  const t=T[L],H=LOCS[LOC].hours,now=madridNow();
  $("hours").innerHTML=[1,2,3,4,5,6,0].map(d=>{const h=H[d];return `<tr class="${d===now.wd?"today":""} ${h?"":"off"}"><td>${t.days[d]}</td><td>${h?fmt(h[0])+" – "+fmt(h[1]):t.closed}</td></tr>`}).join("");
  const h=H[now.wd];
  $("todayHours").textContent=h?fill(t.todayH,{a:fmt(h[0]),b:fmt(h[1])}):t.todayC;
  const open=h&&now.h>=h[0]&&now.h<h[1];
  $("status").classList.toggle("open",!!open);$("status").classList.toggle("closed",!open);
  let txt="";
  if(open)txt=fill(t.open,{t:fmt(h[1])});
  else for(let i=0;i<8;i++){const d=(now.wd+i)%7,x=H[d];if(x&&(i>0||now.h<x[0])){const dn=i===0?t.today:i===1?t.tomorrow:(t.lower?t.days[d].toLowerCase():t.days[d]);txt=fill(t.closedNext,{d:dn,t:fmt(x[0])});break}}
  $("statusText").textContent=txt;
}
function renderLists(){
  const c=LOCS[LOC];
  $("feats").innerHTML=c.feats.map(([b,s])=>`<div class="feat"><b>${esc(tr(b))}</b><span>${esc(tr(s))}</span></div>`).join("");
  $("cats").innerHTML=c.cats.map(([h,items])=>`<div class="cat"><h3>${esc(tr(h))}</h3><ul>${items.map(i=>`<li>${esc(tr(i))}</li>`).join("")}</ul></div>`).join("");
  $("gallery").innerHTML=c.gallery.map(([img,cap],i)=>`<button class="g${i+1}" type="button"><img src="${IMG[img]}" alt="${esc(tr(cap))}"><span class="cap">${esc(tr(cap))}</span></button>`).join("");
  $("evList").innerHTML=c.evList.map(k=>`<li>${esc(tr(k))}</li>`).join("");
  $("reviews").innerHTML=c.reviews.map(([n,m,r,tags])=>`<article class="review"><div class="who"><div class="av">${esc(n[0])}</div><div><b>${esc(n)}</b><span>${esc(tr(m))}</span></div></div><p>${esc(tr(r))}</p><div class="topics">${tags.map(x=>`<span>${esc(tr(x))}</span>`).join("")}</div></article>`).join("")+
    `<article class="review review-cta"><p class="rc-h">${esc(tr("o_ch"))}</p><p style="color:var(--muted)">${esc(tr("o_cp"))}</p><a class="btn btn-dark" href="${c.gmaps}" target="_blank" rel="noopener" style="align-self:flex-start">${esc(tr("o_cb"))}</a></article>`;
  const keep=$("fRoom").selectedIndex;
  $("fRoom").innerHTML=c.rooms.map(k=>`<option>${esc(tr(k))}</option>`).join("");
  if(keep>=0&&keep<c.rooms.length)$("fRoom").selectedIndex=keep;
}
function renderEvMedia(){
  const c=LOCS[LOC],box=$("evMedia");
  if(c.ev.video){box.className="phone-vid";box.innerHTML=`<video src="${VIDEO}" poster="${POSTER}" autoplay muted loop playsinline preload="metadata"></video>`;const v=box.querySelector("video");v.muted=true;v.play&&v.play().catch(()=>{});}
  else{box.className="phone-vid is-photo";box.innerHTML=`<img src="${IMG[c.ev.img]}" alt="">`;}
}
function render(){
  const c=LOCS[LOC];
  document.documentElement.lang=L;
  document.querySelectorAll("[data-t]").forEach(el=>{el.textContent=tr(el.dataset.t)});
  document.querySelectorAll("[data-tp]").forEach(el=>{el.placeholder=tr(el.dataset.tp)});
  document.querySelectorAll("[data-ta]").forEach(el=>{el.setAttribute("aria-label",tr(el.dataset.ta))});
  document.querySelectorAll("[data-v]").forEach(el=>{el.textContent=c[el.dataset.v]});
  document.querySelectorAll("[data-img]").forEach(el=>{const k=c.img[el.dataset.img];if(el.dataset.cur!==k){el.src=IMG[k];el.dataset.cur=k}});
  document.querySelectorAll("[data-href]").forEach(el=>{const k=el.dataset.href;el.href=k==="wa"?"https://wa.me/"+c.wa:c[k]});
  $("pin").hidden=!c.pin;$("promo").hidden=!c.promo;$("cartaLink").hidden=!c.carta;
  $("curLang").textContent=L.toUpperCase();
  document.querySelectorAll("[data-lang]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lang===L));
  document.querySelectorAll("[data-loc]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.loc===LOC));
  fPeople.options[fPeople.options.length-1].textContent=T[L].more;
  renderLists();renderTime();fillTimes();
  if(!$("result").hidden)buildMsg();
  $("err").hidden=true;
}
function setLang(l){L=l;try{localStorage.setItem("tropi_lang",l)}catch(e){}render()}
function setLoc(l,scroll){
  if(l===LOC)return;LOC=l;try{localStorage.setItem("tropi_loc",l)}catch(e){}
  document.body.classList.add("swap");
  render();renderEvMedia();
  setTimeout(()=>document.body.classList.remove("swap"),350);
  if(scroll)$("inicio").scrollIntoView({behavior:"smooth"});
}

/* Menu */
const burger=$("burger"),panel=$("menuPanel");
function setMenu(open){panel.hidden=!open;burger.setAttribute("aria-expanded",open);burger.setAttribute("aria-label",tr(open?"m_close":"m_open"));burger.classList.toggle("is-open",open)}
burger.addEventListener("click",e=>{e.stopPropagation();setMenu(panel.hidden)});
$("locChip").addEventListener("click",e=>{e.stopPropagation();setMenu(panel.hidden)});
panel.addEventListener("click",e=>{
  const b=e.target.closest("[data-lang]");if(b){setLang(b.dataset.lang);setMenu(false);return}
  const lc=e.target.closest("[data-loc]");if(lc){setLoc(lc.dataset.loc);setMenu(false);return}
  if(e.target.closest("a"))setMenu(false);
});
document.addEventListener("click",e=>{
  if(!panel.hidden&&!panel.contains(e.target))setMenu(false);
  const lc=e.target.closest("[data-loc]");if(lc&&!panel.contains(lc))setLoc(lc.dataset.loc,lc.classList.contains("foot-switch"));
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!panel.hidden){setMenu(false);burger.focus()}if(!lb.hidden)closeLb()}});
addEventListener("scroll",()=>$("nav").classList.toggle("scrolled",scrollY>20),{passive:true});

/* Gallery */
const lb=$("lb"),lbImg=$("lbImg"),lbCap=$("lbCap");let lastBtn=null;
$("gallery").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;lastBtn=b;lbImg.src=b.querySelector("img").src;lbImg.alt=lbCap.textContent=b.querySelector(".cap").textContent;lb.hidden=false;$("lbClose").focus()});
function closeLb(){lb.hidden=true;if(lastBtn)lastBtn.focus()}
$("lbClose").onclick=closeLb;lb.addEventListener("click",e=>{if(e.target===lb)closeLb()});

/* Booking */
const fTime=$("fTime"),fPeople=$("fPeople"),fDate=$("fDate");
for(let i=1;i<=20;i++){const o=document.createElement("option");o.textContent=i;if(i===2)o.selected=true;fPeople.appendChild(o)}
const pad=n=>String(n).padStart(2,"0"),iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
function fillTimes(){
  const keep=fTime.value,d=fDate.value?new Date(fDate.value+"T12:00").getDay():6,h=LOCS[LOC].hours[d];
  fTime.innerHTML="";
  if(!h){const o=document.createElement("option");o.textContent=T[L].closedDay;fTime.appendChild(o);return}
  const sl=[];for(let x=13;x<=15.5;x+=.5)if(x>=h[0]&&x<=h[1]-1)sl.push(x);for(let x=20.5;x<=22.5;x+=.5)if(x>=h[0]&&x<=h[1]-1)sl.push(x);
  sl.forEach(x=>{const o=document.createElement("option");o.textContent=o.value=fmt(x);fTime.appendChild(o)});
  if([...fTime.options].some(o=>o.value===keep))fTime.value=keep;
}
const t0=new Date();t0.setDate(t0.getDate()+1);fDate.value=iso(t0);fDate.min=iso(new Date());
fDate.addEventListener("change",fillTimes);
function buildMsg(){
  const t=T[L],c=LOCS[LOC],d=new Date(fDate.value+"T12:00"),notes=$("fNotes").value.trim(),room=$("fRoom");
  const fecha=d.toLocaleDateString(t.locale,{weekday:"long",day:"numeric",month:"long"});
  const msg=`${fill(t.hello,{l:c.short})}\n· ${fecha}, ${t.at} ${fTime.value}\n· ${fPeople.value} ${t.ppl} · ${room.options[room.selectedIndex].textContent}\n· ${t.by} ${$("fName").value.trim()} (${$("fPhone").value.trim()})`+(notes?`\n· ${t.note}: ${notes}`:"");
  $("resultText").textContent=msg;
  $("sendWa").href="https://wa.me/"+c.wa+"?text="+encodeURIComponent(msg);
}
$("bookForm").addEventListener("submit",e=>{
  e.preventDefault();
  const t=T[L],name=$("fName").value.trim(),phone=$("fPhone").value.trim(),d=fDate.value?new Date(fDate.value+"T12:00"):null;let m="";
  if(!name)m=t.e1;else if(phone.replace(/\D/g,"").length<9)m=t.e2;else if(!d)m=t.e3;else if(!LOCS[LOC].hours[d.getDay()])m=t.e4;
  if(m){$("err").textContent=m;$("err").hidden=false;$("result").hidden=true;return}
  $("err").hidden=true;buildMsg();$("result").hidden=false;
});
function copyText(text,btn,selEl){
  const label=btn.textContent,done=()=>{btn.textContent=T[L].copied;setTimeout(()=>btn.textContent=label,1800)};
  const sel=()=>{if(!selEl)return;const r=document.createRange();r.selectNodeContents(selEl);const s=getSelection();s.removeAllRanges();s.addRange(r)};
  try{navigator.clipboard.writeText(text).then(done).catch(sel)}catch(e){sel()}
}
$("copyRes").onclick=e=>copyText($("resultText").textContent,e.currentTarget,$("resultText"));
$("copyAddr").onclick=e=>copyText(LOCS[LOC].copy,e.currentTarget,document.querySelector(".addr"));
$("copyTel").onclick=e=>copyText(LOCS[LOC].phoneIntl,e.currentTarget,document.querySelector(".tel"));

/* Start: #sombreiro / #mallos link > saved choice > O Sombreiro */
(function(){
  const h=(location.hash||"").slice(1);
  let sl=null,sg=null;try{sl=localStorage.getItem("tropi_loc");sg=localStorage.getItem("tropi_lang")}catch(e){}
  LOC=LOCS[h]?h:(LOCS[sl]?sl:"sombreiro");
  const n=(navigator.language||"es").slice(0,2).toLowerCase();
  L=T[sg]?sg:(T[n]?n:"es");
  render();renderEvMedia();
  setInterval(renderTime,60000);
})();
