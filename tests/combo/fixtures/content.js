// CONTENT SCRIPT
import codeAsString2 from './injected'

const script = document.createElement('script')
script.innerHTML = codeAsString2
document.head.append(script)
