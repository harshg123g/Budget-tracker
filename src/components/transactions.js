export function renderTransactions(ctx){
  const { root, storage, currency } = ctx;
  const cur = storage.get('currency','USD');

  root.innerHTML = `
   <div class="card">
  <h3>Add Expense</h3>
  <form id="tx-form" class="grid cols-3" style="align-items:end">
    <div>
      <label for="tx-amount">Amount</label>
      <input type="number" step="0.01" id="tx-amount" class="select" required />
    </div>
    <div>
      <label for="tx-category">Category</label>
      <select id="tx-category" class="select">
        ${['Groceries','Rent','Transport','Shopping','Entertainment','Utilities','Health','Other'].map(c => `<option>${c}</option>`).join('')}
      </select>
    </div>
    <div>
      <label for="tx-method">Method</label>
      <select id="tx-method" class="select">
        ${['Card','Cash','Bank','UPI','Other'].map(m => `<option>${m}</option>`).join('')}
      </select>
    </div>
    <div>
      <label for="tx-date">Date</label>
      <input type="datetime-local" id="tx-date" class="select" />
    </div>
    <div>
      <label for="tx-note">Notes</label>
      <input type="text" id="tx-note" class="select" placeholder="Optional" />
    </div>
    <div>
      <button class="primary" type="submit">Add</button>
    </div>
  </form>
</div>

<div class="card">
  <h3>All Transactions</h3>
  <div class="table-wrap">
    <table class="table" id="tx-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Method</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</div>

  `;

  renderTable();

  const form = root.querySelector('#tx-form');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const amount = parseFloat(root.querySelector('#tx-amount').value);
    const category = root.querySelector('#tx-category').value;
    const method = root.querySelector('#tx-method').value;
    const dt = root.querySelector('#tx-date').value;
    const note = root.querySelector('#tx-note').value.trim();
    const ts = dt ? new Date(dt).getTime() : Date.now();
    const list = storage.get('transactions', []);
    list.push({ id: crypto.randomUUID(), amount, category, method, ts, note });
    storage.set('transactions', list);
    form.reset();
    renderTable();
  });

  function renderTable(){
    const tbody = root.querySelector('#tx-table tbody');
    const rows = storage.get('transactions', []).sort((a,b)=>b.ts-a.ts)
      .map(t=>`<tr>
        <td>${new Date(t.ts).toLocaleString()}</td>
        <td>${t.category}</td>
        <td>${t.method}</td>
        <td>${currency.format(t.amount, cur)}</td>
        <td><button data-id="${t.id}" class="secondary small">Delete</button></td>
      </tr>`).join('');
    tbody.innerHTML = rows || `<tr><td colspan="5" class="muted">No transactions</td></tr>`;
    tbody.querySelectorAll('button[data-id]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        const list = storage.get('transactions', []).filter(t=>t.id!==id);
        storage.set('transactions', list);
        renderTable();
      });
    });
  }
}


