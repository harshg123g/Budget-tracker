import { storage } from './lib/storage.js';
import { initChartsLib } from './lib/charts.js';
import { initExport } from './lib/export.js';
import { currency } from './lib/currency.js';
import { renderDashboard } from './components/dashboard.js';
import { renderTransactions } from './components/transactions.js';
import { renderBudgets } from './components/budgets.js';
import { renderBills } from './components/bills.js';
import { renderGoals } from './components/goals.js';
import { renderReports } from './components/reports.js';

const routes = {
  dashboard: renderDashboard,
  transactions: renderTransactions,
  budgets: renderBudgets,
  bills: renderBills,
  goals: renderGoals,
  reports: renderReports,
};

function setTheme(isDark){
  if(isDark){
    document.documentElement.classList.remove('light');
  }else{
    document.documentElement.classList.add('light');
  }
}

function initTheme(){
  const saved = storage.get('theme', 'dark');
  const isDark = saved === 'dark';
  const toggle = document.getElementById('theme-toggle');
  if(toggle){
    toggle.checked = isDark;
    toggle.addEventListener('change',()=>{
      const mode = toggle.checked ? 'dark' : 'light';
      storage.set('theme', mode);
      setTheme(toggle.checked);
    });
  }
  setTheme(isDark);
}

// function initSidebar(){
//   const btn = document.getElementById('menu-toggle');
//   const sidebar = document.querySelector('.sidebar');
//   if(btn && sidebar){
//     btn.addEventListener('click', ()=> sidebar.classList.toggle('open'));
//   }
// }

function initSidebar() {
  const btn = document.getElementById('menu-toggle'); // Button to open the sidebar
  const sidebar = document.querySelector('.sidebar');
  const closeBtn = document.getElementById('sidebar-close-btn'); // Close button inside sidebar

  if (!btn || !sidebar) return; // Check if both button and sidebar exist

  // Open sidebar on button click
  btn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    toggleBackdrop(); // Show or hide the backdrop based on sidebar's state
  });

  // Close sidebar on close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      toggleBackdrop(); // Hide the backdrop
    });
  }

  // Add a backdrop element to the page dynamically
  let backdrop = document.querySelector('.sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.classList.add('sidebar-backdrop');
    document.body.appendChild(backdrop);
  }

  // Close sidebar when clicking on the backdrop (outside the sidebar)
  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('open');
    toggleBackdrop(); // Hide the backdrop when sidebar is closed
  });

  // Helper function to toggle backdrop visibility
  function toggleBackdrop() {
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (sidebar.classList.contains('open')) {
      backdrop.style.display = 'block'; // Show the backdrop
    } else {
      backdrop.style.display = 'none'; // Hide the backdrop
    }
  }
}





function openModal(title, html){
  const root = document.getElementById('modal-root');
  if(!root) return;
  root.style.display = 'flex';
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-content').innerHTML = html;
  const close = document.getElementById('modal-close');
  const onClose = ()=>{ root.style.display = 'none'; close.removeEventListener('click', onClose); root.removeEventListener('click', onBackdrop); };
  const onBackdrop = (e)=>{ if(e.target===root) onClose(); };
  close.addEventListener('click', onClose);
  root.addEventListener('click', onBackdrop);
}

function initCurrency(){
  const select = document.getElementById('currency-select');
  if(!select) return;
  const options = currency.getSupportedCurrencies();
  options.forEach(opt=>{
    const o = document.createElement('option');
    o.value = opt.code;
    o.textContent = `${opt.code} — ${opt.label}`;
    select.appendChild(o);
  });
  const saved = storage.get('currency', 'USD');
  select.value = saved;
  select.addEventListener('change', ()=>{
    storage.set('currency', select.value);
    navigate(currentRoute);
  });
}

let currentRoute = 'dashboard';

function bindNavigation(){
  document.querySelectorAll('.nav-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const route = btn.dataset.route;
      navigate(route);
    });
  });
}

function setActiveNav(route){
  document.querySelectorAll('.nav-item').forEach(b=> b.classList.toggle('active', b.dataset.route===route));
}

function navigate(route){
  currentRoute = route;
  setActiveNav(route);
  const titleMap = {dashboard:'Dashboard',transactions:'Transactions',budgets:'Budgets',bills:'Bills',goals:'Goals',reports:'Reports'};
  const titleEl = document.getElementById('page-title');
  if(titleEl) titleEl.textContent = titleMap[route] || 'Budget';
  const content = document.getElementById('content');
  if(!content) return;
  content.innerHTML = '';
  routes[route]({root: content, storage, currency});
}

function seedIfEmpty(){
  const seeded = storage.get('seeded', false);
  if(seeded) return;
  const now = Date.now();
  const tx = [
    { id: crypto.randomUUID(), amount: 45.2, category: 'Groceries', method: 'Card', ts: now-86400000*1, note: 'Supermarket' },
    { id: crypto.randomUUID(), amount: 1200, category: 'Rent', method: 'Bank', ts: now-86400000*5, note: 'September' },
    { id: crypto.randomUUID(), amount: 18.5, category: 'Transport', method: 'Cash', ts: now-86400000*2, note: 'Metro' },
  ];
  const budgets = [
    { id: crypto.randomUUID(), month: new Date().toISOString().slice(0,7), category: 'Groceries', limit: 300 },
    { id: crypto.randomUUID(), month: new Date().toISOString().slice(0,7), category: 'Transport', limit: 100 },
  ];
  const bills = [
    { id: crypto.randomUUID(), name: 'Rent', amount: 1200, dueDay: 1, paid: false },
    { id: crypto.randomUUID(), name: 'Internet', amount: 40, dueDay: 10, paid: false },
  ];
  const goals = [
    { id: crypto.randomUUID(), name: 'Emergency Fund', target: 1000, saved: 200 },
  ];
  storage.set('transactions', tx);
  storage.set('budgets', budgets);
  storage.set('bills', bills);
  storage.set('goals', goals);
  storage.set('seeded', true);
}

function initExportButton(){
  const btn = document.getElementById('export-btn');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    initExport().openExportMenu();
  });
}

window.addEventListener('DOMContentLoaded', ()=>{
  initTheme();
  initSidebar();
  initChartsLib();
  initCurrency();
  bindNavigation();
  seedIfEmpty();
  navigate('dashboard');
  initExportButton();
  const qa = document.getElementById('quick-add');
  if(qa){ qa.addEventListener('click', ()=>{ navigate('transactions'); setTimeout(()=>{ document.getElementById('tx-amount')?.focus(); }, 0); }); }
  // Expose modal for components
  window.__openModal = openModal;
});


