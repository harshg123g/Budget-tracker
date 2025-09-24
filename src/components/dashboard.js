// import { renderDonut, renderLine } from '../lib/charts.js';

// export function renderDashboard(ctx){
//   const { root, storage, currency } = ctx;
//   const tx = storage.get('transactions', []);
//   const budgets = storage.get('budgets', []);
//   const bills = storage.get('bills', []);
//   const goals = storage.get('goals', []);
//   const cur = storage.get('currency', 'USD');

//   const recent = [...tx].sort((a,b)=>b.ts-a.ts).slice(0,5);
//   const upcomingBills = bills.slice().sort((a,b)=>a.dueDay-b.dueDay).slice(0,5);
//   const goal = goals[0];

  

//   root.innerHTML = `
//     <div class="grid cols-3">
//       <div class="card">
//         <h3>Recent Transactions</h3>
//         <div class="table-wrap">
//         <table class="table">
//           <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th></th></tr></thead>
//           <tbody>
//             ${recent.map(r=>`<tr>
//               <td>${new Date(r.ts).toLocaleDateString()}</td>
//               <td>${r.category}</td>
//               <td>${currency.format(r.amount, cur)}</td>
//               <td><button class="secondary" data-id="${r.id}">See details</button></td>
//             </tr>`).join('') || '<tr><td colspan="4" class="muted">No transactions</td></tr>'}
//           </tbody>
//         </table>
//         </div>
//       </div>
//       <div class="card">
//         <h3>Upcoming Bills</h3>
//         <ul style="margin:0;padding-left:16px">
//           ${upcomingBills.map(b=>`<li>${b.name} • Due ${b.dueDay} • ${currency.format(b.amount, cur)}</li>`).join('') || '<li class="muted">No bills</li>'}
//         </ul>
//       </div>
//       <div class="card">
//         <h3>Goal Progress</h3>
//         ${goal ? `
//           <div class="muted">${goal.name}</div>
//           <div class="progress" style="margin-top:8px"><div class="bar" style="width:${Math.min(100, Math.round(goal.saved/goal.target*100))}%"></div></div>
//           <div style="margin-top:6px">${currency.format(goal.saved, cur)} / ${currency.format(goal.target, cur)}</div>
//         ` : '<div class="muted">No goals yet</div>'}
//       </div>
//     </div>
//     <div class="grid cols-2">
//       <div class="card">
//         <h3>Spending by Category</h3>
//         <canvas id="cat-donut" height="180"></canvas>
//       </div>
//       <div class="card">
//         <h3>Spending Trend</h3>
//         <canvas id="trend-line" height="180"></canvas>
//       </div>
//     </div>
//   `;

//   // Charts
//   const byCat = aggregateByCategory(tx);
//   const donut = root.querySelector('#cat-donut');
//   renderDonut(donut, byCat.labels, byCat.values, palette(byCat.labels.length));

//   const trend = aggregateByDay(tx, 14);
//   const line = root.querySelector('#trend-line');
//   renderLine(line, trend.labels, trend.values, getCss('--accent'));

//   // Bind details modal
//   const table = root.querySelector('table');
//   table?.querySelectorAll('button[data-id]')?.forEach(btn=>{
//     btn.addEventListener('click', ()=>{
//       const id = btn.getAttribute('data-id');
//       const item = tx.find(t=>t.id===id);
//       if(!item) return;
//       const d = new Date(item.ts||Date.now());
//       const html = `
//         <div class="grid-info">
//           <div class="muted">Amount</div><div>${currency.format(item.amount, cur)}</div>
//           <div class="muted">Category</div><div>${item.category||''}</div>
//           <div class="muted">Date</div><div>${d.toLocaleDateString()}</div>
//           <div class="muted">Time</div><div>${d.toLocaleTimeString()}</div>
//           <div class="muted">Method</div><div>${item.method||''}</div>
//           <div class="muted">Notes</div><div>${item.note||''}</div>
//           </div>`;
//           window.__openModal?.('Transaction Details', html);
//         });
//       });
//       // <div class="muted">ID</div><div style="word-break:break-all">${item.id}</div>
// }

// function aggregateByCategory(tx){
//   const map = new Map();
//   tx.forEach(t=>{ map.set(t.category, (map.get(t.category)||0)+t.amount); });
//   const labels = [...map.keys()];
//   const values = [...map.values()];
//   return { labels, values };
// }

// function aggregateByDay(tx, days){
//   const arr = [];
//   for(let i=days-1;i>=0;i--){
//     const d = new Date(); d.setDate(d.getDate()-i);
//     const key = d.toISOString().slice(0,10);
//     const sum = tx.filter(t=> new Date(t.ts).toISOString().slice(0,10)===key).reduce((s,t)=>s+t.amount,0);
//     arr.push({ key, sum });
//   }
//   return { labels: arr.map(a=>a.key.slice(5)), values: arr.map(a=>a.sum) };
// }

// function palette(n){
//   const base = ['#60a5fa','#34d399','#f472b6','#f59e0b','#a78bfa','#38bdf8','#f43f5e','#22d3ee'];
//   const out = [];
//   for(let i=0;i<n;i++) out.push(base[i%base.length]);
//   return out;
// }

// function getCss(varName){
//   return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
// }


import { renderDonut, renderLine } from '../lib/charts.js';

export function renderDashboard(ctx){


  const { root, storage, currency } = ctx;
  const tx = storage.get('transactions', []);
  const budgets = storage.get('budgets', []);
  const bills = storage.get('bills', []);
  const goals = storage.get('goals', []);
  const cur = storage.get('currency', 'USD');

  const recent = [...tx].sort((a,b)=>b.ts-a.ts).slice(0,5);
  const upcomingBills = bills.slice().sort((a,b)=>a.dueDay-b.dueDay).slice(0,5);
  const goal = goals[0];

  function formatDate(date) {
  const day = date.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


  

  root.innerHTML = `
    <div class="grid cols-3">
      <div class="card">
        <h3>Recent Transactions</h3>
        <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            ${recent.map(r=>`<tr>
              <td>${formatDate(new Date(r.ts))}</td>
              <td>${r.category}</td>
              <td>${currency.format(r.amount, cur)}</td>
              <td><button class="secondary" data-id="${r.id}">See details</button></td>
            </tr>`).join('') || '<tr><td colspan="4" class="muted">No transactions</td></tr>'}
          </tbody>
        </table>
        </div>
      </div>
      <div class="card">
        <h3>Upcoming Bills</h3>
        <ul style="margin:0;padding-left:16px">
          ${upcomingBills.map(b=>`<li>${b.name} • Due ${b.dueDay} • ${currency.format(b.amount, cur)}</li>`).join('') || '<li class="muted">No bills</li>'}
        </ul>
      </div>
      <div class="card">
        <h3>Goal Progress</h3>
        ${goal ? `
          <div class="muted">${goal.name}</div>
          <div class="progress" style="margin-top:8px"><div class="bar" style="width:${Math.min(100, Math.round(goal.saved/goal.target*100))}%"></div></div>
          <div style="margin-top:6px">${currency.format(goal.saved, cur)} / ${currency.format(goal.target, cur)}</div>
        ` : '<div class="muted">No goals yet</div>'}
      </div>
    </div>
    <div class="grid cols-2">
      <div class="card">
        <h3>Spending by Category</h3>
        <canvas id="cat-donut" height="180"></canvas>
      </div>
      <div class="card">
        <h3>Spending Trend</h3>
        <canvas id="trend-line" height="180"></canvas>
      </div>
    </div>
  `;

  // Charts
  const byCat = aggregateByCategory(tx);
  const donut = root.querySelector('#cat-donut');
  renderDonut(donut, byCat.labels, byCat.values, palette(byCat.labels.length));

  const trend = aggregateByDay(tx, 14);
  const line = root.querySelector('#trend-line');
  renderLine(line, trend.labels, trend.values, getCss('--accent'));

  // Bind details modal
  const table = root.querySelector('table');
  table?.querySelectorAll('button[data-id]')?.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-id');
      const item = tx.find(t=>t.id===id);
      if(!item) return;
      const d = new Date(item.ts||Date.now());
      const html = `
        <div class="grid-info">
          <div class="muted">Amount</div><div>${currency.format(item.amount, cur)}</div>
          <div class="muted">Category</div><div>${item.category||''}</div>
          <div class="muted">Date</div><div>${formatDate(new Date(item.ts || Date.now()))}</div>
          <div class="muted">Time</div><div>${d.toLocaleTimeString()}</div>
          <div class="muted">Method</div><div>${item.method||''}</div>
          <div class="muted">Notes</div><div>${item.note||''}</div>
          </div>`;
          window.__openModal?.('Transaction Details', html);
        });
      });
      // <div class="muted">ID</div><div style="word-break:break-all">${item.id}</div>
}

function aggregateByCategory(tx){
  const map = new Map();
  tx.forEach(t=>{ map.set(t.category, (map.get(t.category)||0)+t.amount); });
  const labels = [...map.keys()];
  const values = [...map.values()];
  return { labels, values };
}

function aggregateByDay(tx, days){
  const arr = [];
  for(let i=days-1;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10);
    const sum = tx.filter(t=> new Date(t.ts).toISOString().slice(0,10)===key).reduce((s,t)=>s+t.amount,0);
    arr.push({ key, sum });
  }
  return { labels: arr.map(a=>a.key.slice(5)), values: arr.map(a=>a.sum) };
}

function palette(n){
  const base = ['#60a5fa','#34d399','#f472b6','#f59e0b','#a78bfa','#38bdf8','#f43f5e','#22d3ee'];
  const out = [];
  for(let i=0;i<n;i++) out.push(base[i%base.length]);
  return out;
}

function getCss(varName){
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}
