const fs = require('fs')
const mongoose = require('mongoose')

function readEnv(path){
  try{
    const txt = fs.readFileSync(path,'utf8')
    const m = txt.match(/^MONGODB_URI=(.*)$/m)
    if(m) return m[1].trim()
  }catch(e){/* ignore */}
  return process.env.MONGODB_URI
}

;(async()=>{
  const uri = readEnv('.env.local')
  if(!uri){
    console.error('MONGODB_URI not found in .env.local or env')
    process.exit(1)
  }
  try{
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  }catch(e){
    console.error('Connect error', e.message)
    process.exit(1)
  }
  try{
    const Dev = mongoose.model('Devotional', new mongoose.Schema({}, { strict: false }), 'devotionals')
    const total = await Dev.countDocuments()
    const approved = await Dev.countDocuments({ status: 'approved' })
    console.log('TOTAL:', total)
    console.log('APPROVED:', approved)
    const sample = await Dev.find({ status: 'approved' }).limit(5).select('title').lean()
    console.log('SAMPLE TITLES:')
    sample.forEach(s=>console.log('-', s.title || s.name || '‹no title›'))
    process.exit(0)
  }catch(e){
    console.error('Query error', e.message)
    process.exit(1)
  }
})()
