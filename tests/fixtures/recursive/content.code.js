// CONTENT SCRIPT
import dedupe from 'dedupe'

const dups = [1, 2, 2, 3]
const dedupped = dedupe(dups)
console.log('dedupped', dedupped)

const script = document.createElement('script')
script.innerHTML = '%injected%'
document.head.append(script)
