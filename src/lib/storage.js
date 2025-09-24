const memory = new Map();

function getStore(){
  try{ return window.localStorage; }catch{ return null; }
}

export const storage = {
  get(key, fallback){
    const store = getStore();
    if(!store){ return memory.has(key) ? memory.get(key) : fallback; }
    const raw = store.getItem(key);
    if(raw == null) return fallback;
    try{ return JSON.parse(raw); }catch{ return raw; }
  },
  set(key, value){
    const store = getStore();
    const raw = typeof value === 'string' ? value : JSON.stringify(value);
    if(!store){ memory.set(key, value); return; }
    store.setItem(key, raw);
  },
  remove(key){
    const store = getStore();
    if(!store){ memory.delete(key); return; }
    store.removeItem(key);
  }
};


