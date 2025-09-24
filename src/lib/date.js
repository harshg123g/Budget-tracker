export function formatMonthKey(monthKey){
  // monthKey: 'YYYY-MM'
  if(!monthKey || typeof monthKey !== 'string' || monthKey.length < 7) return String(monthKey||'');
  const [y,m] = monthKey.split('-').map(x=>parseInt(x,10));
  const d = new Date(y, (m||1)-1, 1);
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function monthKeyFromDate(date){
  const d = new Date(date);
  return d.toISOString().slice(0,7);
}

