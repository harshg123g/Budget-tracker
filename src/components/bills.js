// export function renderBills(ctx){
//   const { root, storage, currency } = ctx;
//   const cur = storage.get('currency','USD');

//   root.innerHTML = `
//     <div class="card">
//       <h3>Add Recurring Bill</h3>
//       <form id="bill-form" class="grid cols-3" style="align-items:end">
//         <div>
//           <label>Name</label>
//           <input id="bill-name" class="select" style="width:100%" required />
//         </div>
//         <div>
//           <label>Amount</label>
//           <input id="bill-amount" type="number" step="0.01" class="select" style="width:100%" required />
//         </div>
//         <div>
//           <label>Due day</label>
//           <input id="bill-due" type="number" min="1" max="28" class="select" style="width:100%" required />
//         </div>
//         <div>
//           <button class="primary" type="submit">Save</button>
//         </div>
//       </form>
//     </div>
//     <div class="card">
//       <h3>Upcoming Bills</h3>
//       <div class="table-wrap">
//       <table class="table" id="bill-table"><thead><tr><th>Name</th><th>Due (day)</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody></tbody></table>
//       </div>
//     </div>
//   `;

//   renderTable();

//   root.querySelector('#bill-form').addEventListener('submit', (e)=>{
//     e.preventDefault();
//     const name = root.querySelector('#bill-name').value.trim();
//     const amount = parseFloat(root.querySelector('#bill-amount').value);
//     const dueDay = parseInt(root.querySelector('#bill-due').value, 10);
//     const list = storage.get('bills', []);
//     list.push({ id: crypto.randomUUID(), name, amount, dueDay, paid: false });
//     storage.set('bills', list);
//     e.target.reset();
//     renderTable();
//   });

//   function renderTable(){
//     const tbody = root.querySelector('#bill-table tbody');
//     const list = storage.get('bills', []).sort((a,b)=>a.dueDay-b.dueDay);
//     tbody.innerHTML = list.map(b=>`<tr>
//       <td>${b.name}</td>
//       <td>${b.dueDay}</td>
//       <td>${currency.format(b.amount, cur)}</td>
//       <td>${b.paid ? 'Paid' : 'Due'}</td>
//       <td>
//         <button class="secondary" data-action="toggle" data-id="${b.id}">${b.paid ? 'Mark Due' : 'Mark Paid'}</button>
//         <button class="secondary" data-action="del" data-id="${b.id}">Delete</button>
//       </td>
//     </tr>`).join('') || `<tr><td colspan="5" class="muted">No bills</td></tr>`;

//     tbody.querySelectorAll('button[data-action]').forEach(btn=>{
//       btn.addEventListener('click', ()=>{
//         const id = btn.getAttribute('data-id');
//         const action = btn.getAttribute('data-action');
//         let list = storage.get('bills', []);
//         if(action==='toggle'){
//           list = list.map(b=> b.id===id ? { ...b, paid: !b.paid } : b);
//         }else{
//           list = list.filter(b=>b.id!==id);
//         }
//         storage.set('bills', list);
//         renderTable();
//       });
//     });
//   }
// }

export function renderBills(ctx) {
  const { root, storage, currency } = ctx;
  const cur = storage.get('currency', 'USD');

  root.innerHTML = `
    <div class="card">
      <h3>Add Recurring Bill</h3>
      <form id="bill-form" class="grid cols-3" style="align-items:end">
        <div>
          <label>Name</label>
          <input id="bill-name" class="select" style="width:100%" required />
        </div>
        <div>
          <label>Amount</label>
          <input id="bill-amount" type="number" step="0.01" class="select" style="width:100%" required />
        </div>
        <div>
          <label>Due day</label>
          <input id="bill-due" type="number" min="1" max="28" class="select" style="width:100%" required />
        </div>
        <div>
          <button class="primary" type="submit">Save</button>
        </div>
      </form>
    </div>
    <div class="card">
      <h3>Upcoming Bills</h3>
      <div class="table-wrap">
        <table class="table" id="bill-table">
          <thead>
            <tr><th>Name</th><th>Due (day)</th><th>Amount</th><th>Status</th><th></th></tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;

  // Render the bills table initially
  renderTable();

  // Handle form submission to add a new bill
  root.querySelector('#bill-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = root.querySelector('#bill-name').value.trim();
    const amount = parseFloat(root.querySelector('#bill-amount').value);
    const dueDay = parseInt(root.querySelector('#bill-due').value, 10);
    const list = storage.get('bills', []);
    list.push({ id: crypto.randomUUID(), name, amount, dueDay, paid: false });
    storage.set('bills', list);
    e.target.reset();
    renderTable(); // Update the bill table
  });

  // Render the bills table
  function renderTable() {
    const tbody = root.querySelector('#bill-table tbody');
    const list = storage.get('bills', []).sort((a, b) => a.dueDay - b.dueDay);
    tbody.innerHTML = list.map(b => `
      <tr>
        <td>${b.name}</td>
        <td>${b.dueDay}</td>
        <td>${currency.format(b.amount, cur)}</td>
        <td>${b.paid ? 'Paid' : 'Due'}</td>
        <td>
          <button class="secondary" data-action="toggle" data-id="${b.id}">
            ${b.paid ? 'Mark Due' : 'Mark Paid'}
          </button>
          <button class="secondary" data-action="del" data-id="${b.id}">Delete</button>
        </td>
      </tr>
    `).join('') || `<tr><td colspan="5" class="muted">No bills</td></tr>`;

    // Add event listeners for "Mark Paid" and "Delete" buttons
    tbody.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        let list = storage.get('bills', []);
        if (action === 'toggle') {
          // Toggle the "paid" status
          list = list.map(b => b.id === id ? { ...b, paid: !b.paid } : b);
        } else if (action === 'del') {
          // Delete the bill
          list = list.filter(b => b.id !== id);
        }
        // Update the bills in storage
        storage.set('bills', list);

        // Re-render the bills table and the dashboard
        renderTable(); // Update the table
        renderDashboard(ctx); // Update the dashboard with new data
      });
    });
  }
}
