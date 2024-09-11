'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const typescript_1 = require('./typescript')
const pg_client_1 = require('./pg-client')
const prettier_1 = __importDefault(require('prettier'))
const package_json_1 = __importDefault(require('../package.json'))
const JSONHeader = `
export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export type JSONArray = Array<JSONValue>;

`
const header = includesJSON => (includesJSON ? JSONHeader : '')
function pretty(code) {
  return prettier_1.default.format(code, {
    parser: 'typescript',
    ...package_json_1.default.prettier
  })
}
async function inferTable(connectionString, table) {
  const db = new pg_client_1.Postgres(connectionString)
  const code = typescript_1.tableToTS(table, await db.table(table))
  const fullCode = `
    ${header(code.includes('JSONValue'))}
    ${code}
  `
  return pretty(fullCode)
}
exports.inferTable = inferTable
async function inferSchema(connectionString) {
  const db = new pg_client_1.Postgres(connectionString)
  const tables = await db.allTables()
  const interfaces = tables.map(table => typescript_1.tableToTS(table.name, table.table))
  const code = [header(interfaces.some(i => i.includes('JSONValue'))), ...interfaces].join('\n')
  return pretty(code)
}
exports.inferSchema = inferSchema
//# sourceMappingURL=index.js.map
