(async()=>{
  try{
    const fetchFn = typeof fetch === 'function' ? fetch : (await import('node-fetch')).default
    const get = async (url)=>{
      const res = await fetchFn(url, { method: 'GET' });
      if (!res.ok) throw new Error(url + ' -> ' + res.status)
      return res.json()
    }

    const live = await get('https://sarvdev-temple-live.vercel.app/api/devotionals')
    console.log('---LIVE---')
    console.log('COUNT:', Array.isArray(live)?live.length:Object.keys(live).length)
    ;(Array.isArray(live)?live.slice(0,5):Object.values(live).slice(0,5)).forEach(x=>console.log('TITLE:', x.title||x.name||'‹no title›'))

    const local = await get('http://localhost:3000/api/devotionals')
    console.log('---LOCAL---')
    console.log('COUNT:', Array.isArray(local)?local.length:Object.keys(local).length)
    ;(Array.isArray(local)?local.slice(0,5):Object.values(local).slice(0,5)).forEach(x=>console.log('TITLE:', x.title||x.name||'‹no title›'))
  }catch(e){
    console.error('ERROR', e.message)
    process.exit(1)
  }
})()
