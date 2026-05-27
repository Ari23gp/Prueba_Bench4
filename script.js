import { getPosts } from './storage.js';

const competitors = ['Hilton','Wyndham','Sheraton'];
const allBrands = ['Hilton','Wyndham','Sheraton','Oro Verde'];
const months = ['Febrero','Marzo','Abril','Mayo','Junio'];
const weekdays = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
let charts = {};

function n(v){return +v||0}
function fmt(v){return new Intl.NumberFormat('es-EC').format(Math.round(v||0))}
function interactions(p){return n(p.likes)+n(p.comments)+n(p.reposts)+n(p.shares)+n(p.saves)}
function score(p){return n(p.views)*0.2+n(p.likes)*1+n(p.comments)*3+n(p.reposts)*4+n(p.shares)*4+n(p.saves)*5}
function byCount(posts,key){return posts.reduce((a,p)=>{const k=p[key]||'Sin dato';a[k]=(a[k]||0)+1;return a},{})}
function bySum(posts,key,fn){return posts.reduce((a,p)=>{const k=p[key]||'Sin dato';a[k]=(a[k]||0)+fn(p);return a},{})}
function topKey(obj){return Object.entries(obj).sort((a,b)=>b[1]-a[1])[0]?.[0]||'—'}
function destroy(id){if(charts[id]) charts[id].destroy()}
function makeChart(id,type,labels,datasets){destroy(id);charts[id]=new Chart(document.getElementById(id),{type,data:{labels,datasets},options:{responsive:true,plugins:{legend:{labels:{color:'#f5f7fb'}}},scales:{x:{ticks:{color:'#9aa4b2'},grid:{color:'rgba(255,255,255,.08)'}},y:{ticks:{color:'#9aa4b2'},grid:{color:'rgba(255,255,255,.08)'}}}}})}

function kpis(posts,prefix=''){
  document.getElementById(prefix+'totalPosts').textContent=posts.length;
  document.getElementById(prefix+'totalViews').textContent=fmt(posts.reduce((s,p)=>s+n(p.views),0));
  document.getElementById(prefix+'topCategory').textContent=topKey(byCount(posts,'category'));
  document.getElementById(prefix+'topFormat').textContent=topKey(byCount(posts,'format'));
}

function renderWeekdayTable(posts, brands, el){
  let html='<table><thead><tr><th>Día</th>'+brands.map(b=>`<th>${b}</th>`).join('')+'<th>Total</th></tr></thead><tbody>';
  weekdays.forEach(day=>{
    const nums=brands.map(b=>posts.filter(p=>p.brand===b && p.weekday===day).length);
    html+=`<tr><td>${day}</td>${nums.map(x=>`<td>${x}</td>`).join('')}<td><strong>${nums.reduce((a,b)=>a+b,0)}</strong></td></tr>`;
  });
  html+='</tbody></table>'; document.getElementById(el).innerHTML=html;
}

function renderTop(posts, tbodyId, brandMode=false){
  const top=[...posts].sort((a,b)=>score(b)-score(a)).slice(0,10);
  document.getElementById(tbodyId).innerHTML=top.map(p=>`<tr>${brandMode?'':`<td>${p.brand}</td>`}<td>${p.title}</td>${brandMode?`<td>${p.date}</td>`:''}<td>${p.format}</td><td>${p.category}</td><td>${fmt(p.views)}</td><td>${fmt(interactions(p))}</td><td>${fmt(score(p))}</td></tr>`).join('');
}

function renderGeneral(posts){
  const comp=posts.filter(p=>competitors.includes(p.brand));
  document.getElementById('totalPosts').textContent=comp.length;
  document.getElementById('totalViews').textContent=fmt(comp.reduce((s,p)=>s+n(p.views),0));
  document.getElementById('topCategory').textContent=topKey(byCount(comp,'category'));
  document.getElementById('topFormat').textContent=topKey(byCount(comp,'format'));
  const impactByBrand=bySum(comp,'brand',score); const tb=Object.entries(impactByBrand).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('topBrand').textContent=tb?tb[0]:'—'; document.getElementById('topBrandDetail').textContent=tb?`${fmt(tb[1])} puntos de impacto`:'—';
  makeChart('frequencyChart','bar',months,competitors.map(b=>({label:b,data:months.map(m=>comp.filter(p=>p.brand===b&&p.month===m).length),borderWidth:1})));
  makeChart('impactChart','bar',competitors,[{label:'Score de impacto',data:competitors.map(b=>impactByBrand[b]||0),borderWidth:1}]);
  renderWeekdayTable(comp,competitors,'weekdayTable');
  renderTop(comp,'topPostsTable');
}

function renderBrand(posts, brand){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.brand===brand));
  const bp=posts.filter(p=>p.brand===brand);
  document.getElementById('brandTotal').textContent=bp.length;
  document.getElementById('brandViews').textContent=fmt(bp.reduce((s,p)=>s+n(p.views),0));
  document.getElementById('brandCategory').textContent=topKey(byCount(bp,'category'));
  document.getElementById('brandFormat').textContent=topKey(byCount(bp,'format'));
  makeChart('brandFrequencyChart','bar',months,[{label:brand,data:months.map(m=>bp.filter(p=>p.month===m).length),borderWidth:1}]);
  const cats=byCount(bp,'category'); makeChart('brandCategoryChart','bar',Object.keys(cats),[{label:'Cantidad',data:Object.values(cats),borderWidth:1}]);
  renderWeekdayTable(bp,[brand],'brandWeekdayTable');
  renderTop(bp,'brandTopPosts',true);
}

async function init(){
  const posts=await getPosts();
  renderGeneral(posts);
  const tabs=document.getElementById('brandTabs');
  tabs.innerHTML=allBrands.map((b,i)=>`<button class="tab-btn ${i===0?'active':''}" data-brand="${b}">${b}</button>`).join('');
  tabs.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>renderBrand(posts,btn.dataset.brand)));
  renderBrand(posts,'Hilton');
}
init();
