'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
function normalize(name) {
  const reservedKeywords = ['string', 'number', 'package']
  if (reservedKeywords.includes(name)) {
    return name + '_'
  } else {
    return name
  }
}
function tableToTS(name, table) {
  const members = Object.keys(table).map(column => {
    const type = table[column].tsType
    const nullable = table[column].nullable ? '| null' : ''
    return `${normalize(column)}: ${type}${nullable}\n`
  })
  return `
    export interface ${normalize(name)} {
    ${members}
    }
  `.trim()
}
exports.tableToTS = tableToTS
//# sourceMappingURL=typescript.js.map
