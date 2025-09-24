import { renderDonut, renderLine } from '../lib/charts.js';
import { formatMonthKey } from '../lib/date.js';

export function renderReports(ctx){
  const { root, storage } = ctx;
  const tx = storage.get('transactions', []);

  root.innerHTML = `
    <div class="card">
      <h3>Filters</h3>
      <div class="grid cols-3">
        <div>
          <label>From</label>
          <input type="date" id="f-from" class="select" style="width:100%" />
        </div>
        <div>
          <label>To</label>
          <input type="date" id="f-to" class="select" style="width:100%" />
        </div>
        <div>
          <label>Category</label>
          <select id="f-cat" class="select" style="width:100%">
            <option value="">All</option>
            ${['Groceries','Rent','Transport','Shopping','Entertainment','Utilities','Health','Other'].map(c=>`<option>${c}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
    <div class="grid cols-2">
      <div class="card"><h3>Category Breakdown</h3><div style="overflow:auto"><canvas id="r-donut" height="200"></canvas></div></div>
      <div class="card"><h3>Spending Trend</h3><div style="overflow:auto"><canvas id="r-line" height="200"></canvas></div></div>
    </div>
  `;

  const fromEl = root.querySelector('#f-from');
  const toEl = root.querySelector('#f-to');
  const catEl = root.querySelector('#f-cat');
  [fromEl,toEl,catEl].forEach(el=> el.addEventListener('change', update));
  update();

  function update(){
    let rows = tx;
    const from = fromEl.value ? new Date(fromEl.value).getTime() : null;
    const to = toEl.value ? new Date(toEl.value).getTime() + 86400000 - 1 : null;
    const cat = catEl.value;
    if(from) rows = rows.filter(r=>r.ts>=from);
    if(to) rows = rows.filter(r=>r.ts<=to);
    if(cat) rows = rows.filter(r=>r.category===cat);
    const donut = aggregateByCategory(rows);
    renderDonut(root.querySelector('#r-donut'), donut.labels, donut.values, palette(donut.labels.length));
    const line = aggregateByMonth(rows, 6);
    renderLine(root.querySelector('#r-line'), line.labels, line.values, getCss('--primary'));
  }
}

function aggregateByCategory(tx){
  const map = new Map();
  tx.forEach(t=>{ map.set(t.category, (map.get(t.category)||0)+t.amount); });
  const labels = [...map.keys()];
  const values = [...map.values()];
  return { labels, values };
}

function aggregateByMonth(tx, months){
  const arr = [];
  const now = new Date();
  for(let i=months-1;i>=0;i--){
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const key = d.toISOString().slice(0,7);
    const sum = tx.filter(t=> new Date(t.ts).toISOString().slice(0,7)===key).reduce((s,t)=>s+t.amount,0);
    arr.push({ key, sum });
  }
  return { labels: arr.map(a=>formatMonthKey(a.key)), values: arr.map(a=>a.sum) };
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


