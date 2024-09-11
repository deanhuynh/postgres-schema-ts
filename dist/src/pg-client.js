'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const pg_promise_1 = __importDefault(require('pg-promise'))
const url_1 = require('url')
const column_map_1 = require('./column-map')
const pgp = pg_promise_1.default()
class Postgres {
  constructor(connectionString) {
    this.connection = pgp(connectionString)
    const database = url_1.parse(connectionString, true).query['currentSchema'] || 'public'
    this.defaultSchema = database
  }
  async table(tableName) {
    const enumTypes = await this.enums(tableName)
    const table = await this.getTable(tableName, this.schema())
    return column_map_1.mapColumn(table, enumTypes)
  }
  async allTables() {
    const names = await this.tableNames()
    const nameMapping = names.map(async name => ({
      name,
      table: await this.table(name)
    }))
    return Promise.all(nameMapping)
  }
  async query(query) {
    return this.connection.query(query.text, query.values)
  }
  async tableNames() {
    return await this.connection.map(
      `SELECT table_name 
      FROM information_schema.columns 
      WHERE table_schema = $1 
      GROUP BY table_name 
      ORDER BY table_name`,
      [this.schema()],
      schemaItem => schemaItem.table_name
    )
  }
  schema() {
    return this.defaultSchema
  }
  async enums(_tableName) {
    const enums = {}
    await this.connection.each(
      `SELECT n.nspname AS schema, t.typname AS name, e.enumlabel AS value
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = $1
        ORDER BY t.typname ASC, e.enumlabel ASC;`,
      [this.schema()],
      item => {
        if (!enums[item.name]) {
          enums[item.name] = []
        }
        enums[item.name].push(item.value)
      }
    )
    return enums
  }
  async getTable(tableName, tableSchema) {
    const tableDefinition = {}
    await this.connection.each(
      `SELECT column_name, udt_name, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1 and table_schema = $2
        ORDER BY ordinal_position
      `,
      [tableName, tableSchema],
      schemaItem => {
        tableDefinition[schemaItem.column_name] = {
          udtName: schemaItem.udt_name,
          nullable: schemaItem.is_nullable === 'YES'
        }
      }
    )
    return tableDefinition
  }
}
exports.Postgres = Postgres
//# sourceMappingURL=pg-client.js.map
