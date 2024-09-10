#!/usr/bin/env node
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const src_1 = require('../src')
const [...args] = process.argv
async function main() {
  const db = args[2] || ''
  const table = args[3]
  if (table) {
    return src_1.inferTable(db, table)
  }
  return src_1.inferSchema(db)
}
main()
  .then(code => {
    console.log(code)
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
//# sourceMappingURL=index.js.map
