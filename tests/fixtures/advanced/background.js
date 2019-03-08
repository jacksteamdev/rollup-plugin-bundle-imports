// This will be a string of code
// to execute as a content script
import codeAsString1 from './content.code'

chrome.tabs.executeScript({
  code: codeAsString1,
})
