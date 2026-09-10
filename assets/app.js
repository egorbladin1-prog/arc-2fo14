const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const titles={home:'Обзор',bots:'Мои боты',templates:'Шаблоны',builder:'Конструктор',users:'Пользователи',broadcasts:'Рассылки',shop:'Магазин',analytics:'Аналитика',modules:'Модули',settings:'Настройки'};
const state={page:localStorage.getItem('buba_page')||'home',zoom:100,theme:localStorage.getItem('buba_theme')||'dark'};
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function toast(text){const t=$('#toast');t.textContent='✓ '+text;t.classList.remove('hidden');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.add('hidden'),2300)}
function page(id){
  if(!titles[id]) id='home';
  $$('.page').forEach(p=>p.classList.toggle('active',p.id===id));
  $$('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
  $('#pageTitle').textContent=titles[id];state.page=id;localStorage.setItem('buba_page',id);
  document.querySelector('.app').classList.remove('menu-open');
  if(id!=='builder'){ $('#palette')?.classList.remove('mobile-open'); $('#inspector')?.classList.remove('mobile-open');}
  requestAnimationFrame(()=>$$('.reveal').forEach((el,i)=>{el.style.animationDelay=Math.min(i*25,250)+'ms'}));
}
function openModal(html){$('#modalCard').innerHTML=html;$('#modal').classList.remove('hidden')}
function closeModal(){$('#modal').classList.add('hidden');$('#modalCard').innerHTML=''}
function createBot(){
  openModal(`<button class="modal-close" data-action="close-modal">×</button><h2>Создать нового бота</h2><p>Выбери основу. После создания ты попадёшь прямо в конструктор.</p>
  <div class="type-grid">
    <button data-create-type="Магазин"><b>🛒 Магазин</b><small>Каталог, корзина, заказы и оплата</small></button>
    <button data-create-type="AI-бот"><b>🤖 AI-бот</b><small>Диалог, AI и обработка сообщений</small></button>
    <button data-create-type="Поддержка"><b>🎫 Поддержка</b><small>Тикеты и операторы</small></button>
    <button data-create-type="Автоворонка"><b>📢 Автоворонка</b><small>Приветствие, прогрев, CTA</small></button>
    <button data-create-type="Заявки"><b>📝 Заявки</b><small>Анкета и уведомления менеджеру</small></button>
    <button data-create-type="С нуля"><b>✦ С нуля</b><small>Чистый сценарий без ограничений</small></button>
  </div>`)
}
function selectNode(node){
  $$('.node').forEach(n=>n.classList.remove('selected'));node.classList.add('selected');
  const name=node.dataset.name||'Старт';$('#nodeName').value=name;$('#nodeId').textContent=(node.dataset.node||'node')+'_01';
  const text=node.querySelector('p')?.innerText||'';
  $('#nodeText').value=text;
  if(innerWidth<=760){$('#inspector').classList.add('mobile-open');$('#palette').classList.remove('mobile-open')}
}
function addBlock(type){
  const canvas=$('#canvas'), n=document.createElement('article');n.className='node';n.dataset.node='new_'+Date.now();n.dataset.name=type;
  n.style.left=(18+Math.random()*55)+'%';n.style.top=(130+Math.random()*520)+'px';
  n.innerHTML=`<header>✦ <b>${type}</b><button>•••</button></header><p>Новый блок. Нажмите для настройки.</p>`;
  canvas.appendChild(n);n.addEventListener('click',()=>selectNode(n));selectNode(n);toast('Блок добавлен');save('builder_changed',Date.now())
}
document.addEventListener('click',e=>{
  const pageBtn=e.target.closest('[data-page]'); if(pageBtn){page(pageBtn.dataset.page);return}
  const act=e.target.closest('[data-action]')?.dataset.action;
  if(act==='create-bot'){createBot();return}
  if(act==='close-modal'){closeModal();return}
  if(act==='test'){toast('Тестер открыт — сценарий готов к проверке');return}
  if(act==='publish'){toast('Сценарий опубликован');return}
  if(act==='save-settings'){localStorage.setItem('buba_bot_name',$('#botName').value);toast('Настройки сохранены');return}
  if(act==='plan'){toast('Управление тарифом');return}
  if(act==='new-broadcast'){openModal(`<button class="modal-close" data-action="close-modal">×</button><h2>Новая рассылка</h2><p>Создай сообщение, выбери аудиторию и запусти сразу или по расписанию.</p><label class="field">Текст<textarea style="width:100%;min-height:120px;background:#070b18;color:#fff;border:1px solid var(--line);border-radius:9px;padding:10px;margin-top:6px"></textarea></label><button class="btn primary full" data-action="broadcast-created">Создать рассылку</button>`);return}
  if(act==='broadcast-created'){closeModal();toast('Рассылка создана');return}
  if(act==='add-product'||act==='edit-product'){openModal(`<button class="modal-close" data-action="close-modal">×</button><h2>${act==='add-product'?'Добавить товар':'Редактировать товар'}</h2><p>Карточка товара сохраняется локально до подключения backend.</p><label class="field">Название<input style="width:100%;background:#070b18;color:#fff;border:1px solid var(--line);border-radius:9px;padding:10px;margin-top:6px" value="Новый товар"></label><br><button class="btn primary full" data-action="product-saved">Сохранить</button>`);return}
  if(act==='product-saved'){closeModal();toast('Товар сохранён');return}
  if(act==='module'){toast('Модуль выбран для настройки');return}
  if(act==='new-scenario'){toast('Новый сценарий создан');return}
  if(act==='add-button'){const list=$('#buttonList');const d=document.createElement('div');d.textContent='🔘 Новая кнопка ';const s=document.createElement('span');s.textContent='→';d.appendChild(s);list.appendChild(d);toast('Кнопка добавлена');return}
  if(act==='delete-node'){const n=$('.node.selected:not(.start)');if(n){n.remove();toast('Блок удалён');save('builder_changed',Date.now())}return}
  if(act==='zoom-in'){state.zoom=Math.min(130,state.zoom+10);$('#zoom').textContent=state.zoom+'%';$('#canvas').style.zoom=state.zoom/100;return}
  if(act==='zoom-out'){state.zoom=Math.max(70,state.zoom-10);$('#zoom').textContent=state.zoom+'%';$('#canvas').style.zoom=state.zoom/100;return}
  if(act==='center-canvas'){$('#canvas').scrollTo({left:0,top:0,behavior:'smooth'});return}
  if(act==='close-mobile'){$('#palette').classList.remove('mobile-open');$('#inspector').classList.remove('mobile-open');return}
  const mob=e.target.closest('[data-mobile]')?.dataset.mobile;
  if(mob==='palette'){$('#palette').classList.add('mobile-open');$('#inspector').classList.remove('mobile-open')}
  if(mob==='inspector'){$('#inspector').classList.add('mobile-open');$('#palette').classList.remove('mobile-open')}
  if(mob==='canvas'){$('#palette').classList.remove('mobile-open');$('#inspector').classList.remove('mobile-open')}
});
document.addEventListener('click',e=>{
  const type=e.target.closest('[data-create-type]')?.dataset.createType;
  if(type){closeModal();page('builder');toast(`Бот «${type}» создан — открой сценарий`);save('last_bot_type',type);return}
  const template=e.target.closest('[data-template]')?.dataset.template;
  if(template){page('builder');toast(`Шаблон «${template}» добавлен в сценарий`);save('last_template',template)}
});
$('#menuBtn').addEventListener('click',()=>document.querySelector('.app').classList.toggle('menu-open'));
$('#backdrop').addEventListener('click',()=>document.querySelector('.app').classList.remove('menu-open'));
$('#themeBtn').addEventListener('click',()=>toast('BUBAVERSE использует фирменную тёмную тему'));
$$('.node').forEach(n=>n.addEventListener('click',()=>selectNode(n)));
$('#nodeText').addEventListener('input',e=>{const n=$('.node.selected p');if(n){n.innerHTML=e.target.value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\\n','<br>');save('builder_text',e.target.value)}});
$('#nodeName').addEventListener('input',e=>{const n=$('.node.selected');if(n){n.dataset.name=e.target.value;const b=n.querySelector('header b');if(b)b.textContent=e.target.value;save('builder_name',e.target.value)}});
$('#blockSearch').addEventListener('input',e=>$$('.block').forEach(b=>b.style.display=b.innerText.toLowerCase().includes(e.target.value.toLowerCase())?'flex':'none'));
$$('.block').forEach(b=>{b.addEventListener('click',()=>addBlock(b.dataset.block));b.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',b.dataset.block))});
$('#canvas').addEventListener('dragover',e=>e.preventDefault());
$('#canvas').addEventListener('drop',e=>{e.preventDefault();const type=e.dataTransfer.getData('text/plain');if(type)addBlock(type)});
$$('[data-toggle]').forEach(t=>t.addEventListener('click',()=>{t.classList.toggle('on');toast(t.classList.contains('on')?'Опция включена':'Опция выключена')}));
$('#botSearch')?.addEventListener('input',e=>$$('.bot-row').forEach(r=>r.style.display=r.innerText.toLowerCase().includes(e.target.value.toLowerCase())?'grid':'none'));
page(state.page);
