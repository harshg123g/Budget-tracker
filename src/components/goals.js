export function renderGoals(ctx){
  const { root, storage, currency } = ctx;
  const cur = storage.get('currency','USD');

  root.innerHTML = `
    <div class="card">
      <h3>Create Savings Goal</h3>
      <form id="g-form" class="grid cols-3" style="align-items:end">
        <div>
          <label>Name</label>
          <input id="g-name" class="select" style="width:100%" required />
        </div>
        <div>
          <label>Target</label>
          <input id="g-target" type="number" step="0.01" class="select" style="width:100%" required />
        </div>
        <div>
          <button class="primary" type="submit">Save</button>
        </div>
      </form>
    </div>
    <div class="card">
      <h3>Goals</h3>
      <div id="g-list" class="grid cols-2"></div>
    </div>
  `;

  renderList();

  root.querySelector('#g-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = root.querySelector('#g-name').value.trim();
    const target = parseFloat(root.querySelector('#g-target').value);
    const list = storage.get('goals', []);
    list.push({ id: crypto.randomUUID(), name, target, saved: 0 });
    storage.set('goals', list);
    e.target.reset();
    renderList();
  });

  function renderList(){
    const container = root.querySelector('#g-list');
    const list = storage.get('goals', []);
    container.innerHTML = list.map(g=>{
      const pct = Math.min(100, Math.round(g.saved/g.target*100));
      return `<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${g.name}</strong>
          <span>${pct}%</span>
        </div>
        <div class="progress" style="margin-top:8px"><div class="bar" style="width:${pct}%"></div></div>
        <div style="margin-top:6px">${currency.format(g.saved, cur)} / ${currency.format(g.target, cur)}</div>
        <div style="margin-top:8px;display:flex;gap:8px">
          <input type="number" step="0.01" placeholder="Add amount" class="select" data-id="${g.id}" style="flex:1" />
          <button class="secondary" data-action="add" data-id="${g.id}">Add</button>
          <button class="secondary" data-action="del" data-id="${g.id}">Delete</button>
        </div>
      </div>`;
    }).join('') || '<div class="muted">No goals</div>';

    container.querySelectorAll('button[data-action]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        let list = storage.get('goals', []);
        if(action==='add'){
          const input = container.querySelector(`input[data-id="${id}"]`);
          const val = parseFloat(input.value||'0');
          if(!isNaN(val) && val>0){ list = list.map(g=> g.id===id ? { ...g, saved: g.saved + val } : g); }
        }else{
          list = list.filter(g=>g.id!==id);
        }
        storage.set('goals', list);
        renderList();
      });
    });
  }
}


