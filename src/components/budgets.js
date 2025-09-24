import { formatMonthKey } from '../lib/date.js';

// export function renderBudgets(ctx){
//   const { root, storage, currency } = ctx;
//   const cur = storage.get('currency','USD');
//   const month = new Date().toISOString().slice(0,7);

//   root.innerHTML = `
//     <div class="card">
//       <h3>Set Monthly Budget</h3>
//       <form id="b-form" class="grid cols-3" style="align-items:end">
//         <div>
//           <label>Category</label>
//           <select id="b-category" class="select" style="width:100%">
//             ${['Groceries','Rent','Transport','Shopping','Entertainment','Utilities','Health','Other'].map(c=>`<option>${c}</option>`).join('')}
//           </select>
//         </div>
//         <div>
//           <label>Limit</label>
//           <input type="number" step="0.01" id="b-limit" class="select" style="width:100%" required />
//         </div>
//         <div>
//           <button class="primary" type="submit">Save</button>
//         </div>
//       </form>
//     </div>
//     <div class="card">
//       <h3>Budgets This Month (${formatMonthKey(month)})</h3>
//       <div id="b-list" class="grid cols-2"></div>
//     </div>
//   `;

//   renderList();

//   root.querySelector('#b-form').addEventListener('submit', (e)=>{
//     e.preventDefault();
//     const category = root.querySelector('#b-category').value;
//     const limit = parseFloat(root.querySelector('#b-limit').value);
//     const list = storage.get('budgets', []);
//     const existing = list.find(b=>b.month===month && b.category===category);
//     if(existing){ existing.limit = limit; }
//     else{ list.push({ id: crypto.randomUUID(), month, category, limit }); }
//     storage.set('budgets', list);
//     renderList();
//     e.target.reset();
//   });

//   function renderList(){
//     const container = root.querySelector('#b-list');
//     const budgets = storage.get('budgets', []).filter(b=>b.month===month);
//     const tx = storage.get('transactions', []);
//     container.innerHTML = budgets.map(b=>{
//       const spent = tx.filter(t=>t.category===b.category && new Date(t.ts).toISOString().slice(0,7)===month).reduce((s,t)=>s+t.amount,0);
//       const pct = Math.min(100, Math.round(spent/b.limit*100));
//       const warn = pct>=90 ? 'color:var(--danger)' : pct>=75 ? 'color:var(--warning)' : '';
//       return `<div class="card">
//         <div style="display:flex;justify-content:space-between;align-items:center">
//           <strong>${b.category}</strong>
//           <span style="${warn}">${pct}%</span>
//         </div>
//         <div class="progress" style="margin-top:8px"><div class="bar" style="width:${pct}%"></div></div>
//         <div style="margin-top:6px">${currency.format(spent, cur)} / ${currency.format(b.limit, cur)}</div>
//       </div>`;
//     }).join('') || '<div class="muted">No budgets set</div>';
//   }
// }

export function renderBudgets(ctx) {
  const { root, storage, currency } = ctx;
  const cur = storage.get('currency', 'USD');
  const month = new Date().toISOString().slice(0, 7);

  root.innerHTML = `
    <div class="card">
      <h3>Set Monthly Budget</h3>
      <form id="b-form" class="grid cols-3" style="align-items:end">
        <div>
          <label>Category</label>
          <select id="b-category" class="select" style="width:100%">
            ${['Groceries', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Health', 'Other']
              .map(c => `<option>${c}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>Limit</label>
          <input type="number" step="0.01" id="b-limit" class="select" style="width:100%" required />
        </div>
        <div>
          <button class="primary" type="submit">Save</button>
        </div>
      </form>
    </div>
    <div class="card">
      <h3>Budgets This Month (${formatMonthKey(month)})</h3>
      <div id="b-list" class="grid cols-2"></div>
    </div>
  `;

  renderList();

  root.querySelector('#b-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const category = root.querySelector('#b-category').value;
    const limit = parseFloat(root.querySelector('#b-limit').value);
    const list = storage.get('budgets', []);
    const existing = list.find(b => b.month === month && b.category === category);
    if (existing) { 
      existing.limit = limit; 
    } else {
      list.push({ id: crypto.randomUUID(), month, category, limit }); 
    }
    storage.set('budgets', list);
    renderList();
    e.target.reset();
  });

  function renderList() {
    const container = root.querySelector('#b-list');
    const budgets = storage.get('budgets', []).filter(b => b.month === month);
    const tx = storage.get('transactions', []);
    container.innerHTML = budgets.map(b => {
      const spent = tx.filter(t => t.category === b.category && new Date(t.ts).toISOString().slice(0, 7) === month)
        .reduce((s, t) => s + t.amount, 0);
      const pct = Math.min(100, Math.round(spent / b.limit * 100));
      const warn = pct >= 90 ? 'color:var(--danger)' : pct >= 75 ? 'color:var(--warning)' : '';
      return `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <strong>${b.category}</strong>
            <span style="${warn}">${pct}%</span>
            <button class="delete-btn" data-id="${b.id}">Delete</button>
          </div>
          <div class="progress" style="margin-top:8px"><div class="bar" style="width:${pct}%"></div></div>
          <div style="margin-top:6px">${currency.format(spent, cur)} / ${currency.format(b.limit, cur)}</div>
        </div>
      `;
    }).join('') || '<div class="muted">No budgets set</div>';

    // Add delete functionality
    const deleteButtons = container.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const budgetId = e.target.dataset.id;
        deleteBudget(budgetId);
      });
    });
  }

  function deleteBudget(budgetId) {
    const budgets = storage.get('budgets', []);
    const updatedBudgets = budgets.filter(b => b.id !== budgetId);
    storage.set('budgets', updatedBudgets);
    renderList();
  }
}
