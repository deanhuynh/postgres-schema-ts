'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const lodash_1 = require('lodash')
function mapColumn(table, enumTypes) {
  return lodash_1.mapValues(table, column => {
    var _a
    switch (column.udtName) {
      case 'bpchar':
      case 'char':
      case 'varchar':
      case 'text':
      case 'citext':
      case 'uuid':
      case 'bytea':
      case 'inet':
      case 'time':
      case 'timetz':
      case 'interval':
      case 'name':
        column.tsType = 'string'
        return column
      case 'int2':
      case 'int4':
      case 'int8':
      case 'float4':
      case 'float8':
      case 'numeric':
      case 'money':
      case 'oid':
        column.tsType = 'number'
        return column
      case 'bool':
        column.tsType = 'boolean'
        return column
      case 'json':
      case 'jsonb':
        column.tsType = 'JSONValue'
        return column
      case 'date':
      case 'timestamp':
      case 'timestamptz':
        column.tsType = 'Date'
        return column
      case '_int2':
      case '_int4':
      case '_int8':
      case '_float4':
      case '_float8':
      case '_numeric':
      case '_money':
        column.tsType = 'Array<number>'
        return column
      case '_bool':
        column.tsType = 'Array<boolean>'
        return column
      case '_varchar':
      case '_text':
      case '_citext':
      case '_uuid':
      case '_bytea':
        column.tsType = 'Array<string>'
        return column
      case '_json':
      case '_jsonb':
        column.tsType = 'JSONArray'
        return column
      case '_timestamptz':
        column.tsType = 'Array<Date>'
        return column
      default: {
        const name = column.udtName
        const enumType = enumTypes[name]
        column.tsType =
          ((_a = enumType) === null || _a === void 0 ? void 0 : _a.map(s => `'${s}'`).join(' | ')) || 'any'
        return column
      }
    }
  })
}
exports.mapColumn = mapColumn
//# sourceMappingURL=column-map.js.map
