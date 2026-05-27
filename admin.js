import { addPost } from './storage.js';

const PASSWORD='admin123';
const loginBox=document.getElementById('loginBox');
const adminContent=document.getElementById('adminContent');
const loginBtn=document.getElementById('loginBtn');
const passwordInput=document.getElementById('passwordInput');
const loginMsg=document.getElementById('loginMsg');
const formatSelect=document.getElementById('format');
const metricFields=document.getElementById('metricFields');

function tryLogin(){
  if(passwordInput.value===PASSWORD){loginBox.classList.add('hidden');adminContent.classList.remove('hidden');passwordInput.value='';}
  else{loginMsg.textContent='Contraseña incorrecta.'}
}
loginBtn.addEventListener('click',tryLogin);
passwordInput.addEventListener('keydown',e=>{if(e.key==='Enter')tryLogin()});

const fields={
  Reel:['views','likes','comments','reposts','shares','saves'],
  Post:['likes','comments','reposts','shares','saves'],
  Carrusel:['likes','comments','reposts','shares','saves'],
  Story:['views','comments','shares']
};
const labels={views:'Views / Alcance',likes:'Me gusta',comments:'Comentarios',reposts:'Reposteos',shares:'Compartidos',saves:'Guardados'};
function renderMetrics(){
  const f=formatSelect.value; const list=fields[f]||[];
  metricFields.innerHTML=list.map(k=>`<label>${labels[k]}<input id="${k}" type="number" min="0" value="0" /></label>`).join('');
}
formatSelect.addEventListener('change',renderMetrics);

function weekday(dateStr){return ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][new Date(dateStr+'T00:00:00').getDay()]}
function monthName(dateStr){return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][new Date(dateStr+'T00:00:00').getMonth()]}

document.getElementById('postForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const date=document.getElementById('date').value;
  const get=id=>document.getElementById(id)?.value||0;
  const post={brand:get('brand'),date,month:monthName(date),weekday:weekday(date),format:get('format'),category:get('category'),title:get('title'),scriptText:get('scriptText'),views:get('views'),likes:get('likes'),comments:get('comments'),reposts:get('reposts'),shares:get('shares'),saves:get('saves')};
  await addPost(post);
  document.getElementById('status').textContent='Publicación guardada. Si Firebase está activo, queda online; si no, queda en este navegador.';
  e.target.reset(); metricFields.innerHTML='';
});
