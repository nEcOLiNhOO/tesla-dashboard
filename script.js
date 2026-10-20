// Configuração por omissão (estilo links.json)
const L=(name,url,icon,cat,color)=>({name,url,icon,cat,color});
const DEFAULT_LINKS=[
  L("Teams","https://teams.microsoft.com","👥","Reuniões","#4b53bc"),
  L("Zoom","https://app.zoom.us/wc","🎥","Reuniões","#0b5cff"),
  L("Google Meet","https://meet.google.com","📹","Reuniões","#00897b"),
  L("Webex","https://web.webex.com","🌐","Reuniões","#07805c"),
  L("WhatsApp","https://web.whatsapp.com","💬","Mensagens","#128c7e"),
  L("Slack","https://app.slack.com","#️⃣","Mensagens","#4a154b"),
  L("Telegram","https://web.telegram.org","✈️","Mensagens","#229ed9"),
  L("Messenger","https://www.messenger.com","💭","Mensagens","#7b3ff2"),
  L("Gmail","https://mail.google.com","✉️","Mensagens","#c5221f"),
  L("LinkedIn","https://www.linkedin.com","💼","Mensagens","#0a66c2"),
  L("Outlook","https://outlook.office.com/mail","📧","Trabalho","#0a64ad"),
  L("Calendário Outlook","https://outlook.office.com/calendar","🗓️","Trabalho","#0f6cbd"),
  L("Google Calendar","https://calendar.google.com","📅","Trabalho","#1a73e8"),
  L("Google Drive","https://drive.google.com","📁","Trabalho","#188038"),
  L("OneDrive","https://onedrive.live.com","☁️","Trabalho","#0364b8"),
  L("Notion","https://www.notion.so","📝","Trabalho","#37352f"),
  L("ChatGPT","https://chatgpt.com","🤖","Trabalho","#10a37f"),
  L("YouTube","https://www.youtube.com","▶️","Entretenimento","#cc0000"),
  L("Netflix","https://www.netflix.com","🎬","Entretenimento","#8b0000"),
  L("Prime Video","https://www.primevideo.com","📺","Entretenimento","#00a8e1"),
  L("Twitch","https://www.twitch.tv","🎮","Entretenimento","#9146ff"),
  L("Spotify","https://open.spotify.com","🎵","Entretenimento","#1aa34a"),
  L("Google Maps","https://maps.google.com","🗺️","Navegação","#188038"),
  L("Waze","https://www.waze.com/live-map","🚗","Navegação","#0899c9")
];
const KEY="teslaDash.v2.links",FSKEY="teslaDash.fsMode",RKEY="teslaDash.recent",TKEY="teslaDash.tab";
let links=load(),editing=false,editIdx=-1,tab=localStorage.getItem(TKEY)||"Reuniões";
function load(){try{return JSON.parse(localStorage.getItem(KEY))||clone()}catch(e){return clone()}}
function clone(){return JSON.parse(JSON.stringify(DEFAULT_LINKS))}
function save(){localStorage.setItem(KEY,JSON.stringify(links))}
const $=s=>document.querySelector(s),grid=$("#grid");
const wrap=u=>$("#fsMode").checked?"https://www.youtube.com/redirect?q="+encodeURIComponent(u):u;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const recent=()=>{try{return JSON.parse(localStorage.getItem(RKEY))||[]}catch(e){return[]}};

// Converte link/código em URL de reunião
function meetingUrl(raw){
  let s=raw.trim();if(!s)return null;
  if(/^https?:\/\//i.test(s)){
    const z=s.match(/zoom\.us\/j\/(\d+)(?:\?pwd=([\w.-]+))?/i);
    if(z)return "https://app.zoom.us/wc/join/"+z[1]+(z[2]?"?pwd="+z[2]:"");
    return s;
  }
  if(/^(meet\.google\.com|teams\.|[\w-]+\.webex\.com|[\w-]*\.?zoom\.us)/i.test(s))return meetingUrl("https://"+s);
  const d=s.replace(/[\s-]/g,"");
  if(/^\d{9,11}$/.test(d))return "https://app.zoom.us/wc/join/"+d;
  const m=s.toLowerCase().replace(/\s/g,"");
  if(/^[a-z]{3}-?[a-z]{4}-?[a-z]{3}$/.test(m)){const c=m.replace(/-/g,"");return `https://meet.google.com/${c.slice(0,3)}-${c.slice(3,7)}-${c.slice(7)}`}
  return null;
}
function join(raw,url){
  url=url||meetingUrl(raw);
  if(!url){alert("Não reconheci o link/código. Cole o link completo, um ID Zoom (9–11 dígitos) ou um código Meet (abc-defg-hij).");return}
  const r=[{label:raw.trim()||url,url},...recent().filter(x=>x.url!==url)].slice(0,6);
  localStorage.setItem(RKEY,JSON.stringify(r));
  location.href=wrap(url);
}
function tile(l,i){return `<a class="tile" style="--c:${esc(l.color||"#222")}" href="${esc(wrap(l.url))}" data-i="${i}">
  <span class="ic">${esc(l.icon||"🔗")}</span><span>${esc(l.name)}</span>
  <span class="tools"><button data-a="up">◀</button><button data-a="ed">✎</button><button data-a="rm">🗑</button><button data-a="dn">▶</button></span></a>`}
function render(){
  const cats=[...new Set(["Reuniões",...links.map(l=>l.cat)])];
  if(!cats.includes(tab))tab=cats[0];
  $("#tabs").innerHTML=cats.map(c=>`<button class="${c===tab?"on":""}" data-t="${esc(c)}">${esc(c)}</button>`).join("");
  $("#cats").innerHTML=cats.map(c=>`<option value="${esc(c)}">`).join("");
  grid.className=editing?"edit":"";
  let h="";
  if(tab==="Reuniões"){
    h+=`<form class="join" id="joinF"><input id="joinIn" placeholder="Cole o link ou código (Zoom ID, Meet abc-defg-hij…)" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="primary">▶ Entrar em reunião</button></form>`;
    const r=recent();
    if(r.length)h+=`<div class="recent"><span class="sub" style="align-self:center">Recentes:</span>`+r.map((x,k)=>`<button data-r="${k}" title="${esc(x.url)}">🕘 ${esc(x.label)}</button>`).join("")+`<button data-a="clr">✕ Limpar</button></div>`;
  }
  h+=`<div class="tiles ${tab==="Reuniões"?"big":""}">`+links.map((l,i)=>l.cat===tab?tile(l,i):"").join("")+`</div>`;
  h+=`<div class="editbar"><button data-a="add" class="primary">＋ Adicionar</button><button data-a="reset">↺ Repor predefinições</button></div>`;
  grid.innerHTML=h;
  const f=$("#joinF");if(f)f.onsubmit=e=>{e.preventDefault();join($("#joinIn").value)};
}
$("#tabs").onclick=e=>{const b=e.target.closest("button");if(!b)return;tab=b.dataset.t;localStorage.setItem(TKEY,tab);render()};
grid.addEventListener("click",e=>{
  const b=e.target.closest("button"),t=e.target.closest(".tile");
  if(editing&&t&&!b){e.preventDefault();return}
  if(!b||b.closest("#joinF"))return;e.preventDefault();
  if(b.dataset.r!==undefined){const x=recent()[+b.dataset.r];return join(x.label,x.url)}
  const i=t?+t.dataset.i:-1,a=b.dataset.a;
  if(a==="clr")localStorage.removeItem(RKEY);
  else if(a==="rm"&&confirm(`Remover "${links[i].name}"?`))links.splice(i,1);
  else if(a==="up"||a==="dn"){const j=nb(i,a==="up"?-1:1);if(j>=0)[links[i],links[j]]=[links[j],links[i]]}
  else if(a==="ed")return openDlg(i);
  else if(a==="add")return openDlg(-1);
  else if(a==="reset"&&confirm("Repor as ligações predefinidas?"))links=clone();
  save();render();
});
function nb(i,d){for(let j=i+d;j>=0&&j<links.length;j+=d)if(links[j].cat===links[i].cat)return j;return -1}
function openDlg(i){editIdx=i;const f=$("#form"),l=links[i]||{name:"",url:"https://",icon:"🔗",cat:tab,color:"#333333"};
  $("#dlgTitle").textContent=i<0?"Nova ligação":"Editar ligação";
  for(const k of["name","url","icon","cat","color"])f[k].value=l[k]||"";$("#dlg").showModal()}
$("#dlg").addEventListener("close",()=>{if($("#dlg").returnValue!=="ok")return;const f=$("#form");
  const l={name:f.name.value,url:f.url.value,icon:f.icon.value,cat:f.cat.value,color:f.color.value};
  if(editIdx<0)links.push(l);else links[editIdx]=l;save();render()});
$("#editBtn").onclick=()=>{editing=!editing;$("#editBtn").textContent=editing?"✔ Concluir":"✎ Editar";render()};
$("#fsMode").checked=localStorage.getItem(FSKEY)==="1";
$("#fsMode").onchange=()=>{localStorage.setItem(FSKEY,$("#fsMode").checked?"1":"0");render()};
$("#fsBtn").onclick=()=>{const d=document,el=d.documentElement;
  if(d.fullscreenElement||d.webkitFullscreenElement)(d.exitFullscreen||d.webkitExitFullscreen).call(d);
  else{const r=el.requestFullscreen||el.webkitRequestFullscreen;if(r)r.call(el);else alert("Ecrã inteiro não suportado. Use o Modo ecrã inteiro Tesla.")}};
function tick(){const n=new Date();$("#clock").textContent=n.toLocaleTimeString("pt-PT",{hour:"2-digit",minute:"2-digit"});
  $("#date").textContent=n.toLocaleDateString("pt-PT",{weekday:"long",day:"numeric",month:"long"})}
tick();setInterval(tick,15000);render();
