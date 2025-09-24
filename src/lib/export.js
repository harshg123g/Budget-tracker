import { storage } from './storage.js';

export function initExport(){
  function exportCSV(){
    const tx = storage.get('transactions', []);
    console.log(tx);
    const rows = tx.map(t=>{
      const d = new Date(t.ts||Date.now());
      return {
        amount: t.amount,
        category: t.category,
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString(),
        note: t.note || '',
        method: t.method || ''
      };
    });
    const csv = window.Papa.unparse({
      fields: ['amount','category','date','time','note','method'],
      data: rows.map(r=>[r.amount,r.category,r.date,r.time,r.note,r.method])
    });
    downloadFile('transactions.csv', 'text/csv', csv);
  }

  function exportBudgetsCSV(){
    const budgets = storage.get('budgets', []);
    const csv = window.Papa.unparse(budgets);
    downloadFile('budgets.csv', 'text/csv', csv);
  }

  async function exportPDF(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Budget Report', 14, 18);
    doc.setFontSize(11);
    const tx = storage.get('transactions', []);
    let y = 28;
    doc.text(`Transactions: ${tx.length}`, 14, y);
    y += 8;
    // Header
    doc.setFont(undefined, 'bold');
    doc.text('Amount', 14, y);
    doc.text('Category', 42, y);
    doc.text('Date', 86, y);
    doc.text('Time', 112, y);
    doc.text('Method', 138, y);
    doc.text('Note', 166, y);
    doc.setFont(undefined, 'normal');
    y += 6;
    tx.forEach(t=>{
      const d = new Date(t.ts||Date.now());
      const amount = String(t.amount);
      const category = String(t.category||'');
      const date = d.toLocaleDateString();
      const time = d.toLocaleTimeString();
      const method = String(t.method||'');
      const note = String(t.note||'');
      doc.text(truncate(amount, 10), 14, y);
      doc.text(truncate(category, 18), 42, y);
      doc.text(truncate(date, 12), 86, y);
      doc.text(truncate(time, 12), 112, y);
      doc.text(truncate(method, 12), 138, y);
      doc.text(truncate(note, 30), 166, y, { maxWidth: 40 });
      y += 6;
      if(y > 280){ doc.addPage(); y = 20; }
    });
    doc.save('report.pdf');
  }

  function downloadFile(name, type, content){
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  }

  function openExportMenu(){
    const choice = window.prompt('Export: 1) CSV Transactions  2) CSV Budgets  3) PDF Report');
    if(choice === '1') exportCSV();
    else if(choice === '2') exportBudgetsCSV();
    else if(choice === '3') exportPDF();
  }

  return { openExportMenu };
}

function truncate(str, max){
  if(typeof str !== 'string') str = String(str||'');
  return str.length > max ? str.slice(0, max-1) + '…' : str;
}


