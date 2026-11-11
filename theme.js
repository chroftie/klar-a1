(() => {
  let preference='system';
  try {preference=JSON.parse(localStorage.getItem('klar-study-v1'))?.settings?.theme||'system';}
  catch { /* Use the device theme if storage is unavailable. */ }
  const dark=preference==='dark'||(preference==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme=dark?'dark':'light';
})();
