'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const pg_client_1 = require('../src/pg-client')
const src_1 = require('../src')
const sql_template_strings_1 = require('sql-template-strings')
const connectionString = 'postgresql://postgres:password@localhost:5433/db?currentSchema=public'
const pg = new pg_client_1.Postgres(connectionString)
const account = sql_template_strings_1.SQL`
  DROP TABLE IF EXISTS account;
  CREATE TABLE account (
    username VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR (50) NOT NULL,
    email VARCHAR (355) UNIQUE NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP
  )
`
const requests = sql_template_strings_1.SQL`
  DROP TYPE IF EXISTS integration_type_enum CASCADE;
  CREATE TYPE integration_type_enum AS ENUM (
      'source',
      'destination'
  );

  DROP TABLE IF EXISTS requests;
  CREATE TABLE requests (
    name varchar(255) NOT NULL,
    url varchar(255) NOT NULL,
    integration_type integration_type_enum NOT NULL
  );
`
const complex = sql_template_strings_1.SQL`
  DROP TABLE IF EXISTS complex;
  CREATE TABLE complex (
    id json NOT NULL,
    name varchar(255) NOT NULL,
    nullable varchar(255),
    created_at timestamp,
    created_on date NOT NULL
  )
`
beforeAll(async () => {
  await pg.query(account)
  await pg.query(requests)
  await pg.query(complex)
})
describe('inferTable', () => {
  it('infers a table', async () => {
    const code = await src_1.inferTable(connectionString, 'account')
    expect(code).toMatchInlineSnapshot(`
      "export interface account {
        username: string
        password: string
        email: string
        created_on: Date
        last_login: Date | null
      }
      "
    `)
  })
  it('works with enums', async () => {
    const code = await src_1.inferTable(connectionString, 'requests')
    expect(code).toMatchInlineSnapshot(`
      "export interface requests {
        name: string
        url: string
        integration_type: 'destination' | 'source'
      }
      "
    `)
  })
  it('works with complex types', async () => {
    const code = await src_1.inferTable(connectionString, 'complex')
    expect(code).toMatchInlineSnapshot(`
      "export type JSONPrimitive = string | number | boolean | null
      export type JSONValue = JSONPrimitive | JSONObject | JSONArray
      export type JSONObject = { [member: string]: JSONValue }
      export type JSONArray = Array<JSONValue>

      export interface complex {
        id: JSONValue
        name: string
        nullable: string | null
        created_at: Date | null
        created_on: Date
      }
      "
    `)
  })
})
describe('inferSchema', () => {
  it('infers all tables at once', async () => {
    const code = await src_1.inferSchema(connectionString)
    expect(code).toMatchInlineSnapshot(`
      "export type JSONPrimitive = string | number | boolean | null
      export type JSONValue = JSONPrimitive | JSONObject | JSONArray
      export type JSONObject = { [member: string]: JSONValue }
      export type JSONArray = Array<JSONValue>

      export interface account {
        username: string
        password: string
        email: string
        created_on: Date
        last_login: Date | null
      }
      export interface complex {
        id: JSONValue
        name: string
        nullable: string | null
        created_at: Date | null
        created_on: Date
      }
      export interface requests {
        name: string
        url: string
        integration_type: 'destination' | 'source'
      }
      "
    `)
  })
})
//# sourceMappingURL=index.test.js.map
