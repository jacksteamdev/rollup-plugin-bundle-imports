// This will be a string of code
// to execute as a content script
import codeAsString1 from './content.code'
import codeAsString2 from './injected.code'

chrome.tabs.executeScript({
  code: codeAsString1,
})

chrome.tabs.executeScript({
  code: codeAsString2,
})
