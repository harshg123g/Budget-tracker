let ChartRef = null;

export function initChartsLib(){
  ChartRef = window.Chart || null;
}

export function renderDonut(canvas, labels, data, colors){
  if(!ChartRef || !canvas) return null;
  return new ChartRef(canvas, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors }] },
    options: { plugins: { legend: { position: 'bottom', labels: { color: getCss('--text') } } } }
  });
}

export function renderLine(canvas, labels, data, color){
  if(!ChartRef || !canvas) return null;
  return new ChartRef(canvas, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Spending', data, borderColor: color, tension: .35 }] },
    options: { scales: { x: { ticks: { color: getCss('--muted') } }, y: { ticks: { color: getCss('--muted') } } }, plugins: { legend: { labels: { color: getCss('--text') } } } }
  });
}

function getCss(varName){
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}


