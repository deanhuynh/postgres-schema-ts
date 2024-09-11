import { Table } from './typescript'
import { SQLStatement } from 'sql-template-strings'
export declare type Enums = {
  [key: string]: string[]
}
export declare class Postgres {
  private connection
  private defaultSchema
  constructor(connectionString: string)
  table(tableName: string): Promise<Table>
  allTables(): Promise<
    {
      name: string
      table: Table
    }[]
  >
  query<T>(query: SQLStatement): Promise<T>
  private tableNames
  schema(): string
  private enums
  private getTable
}
