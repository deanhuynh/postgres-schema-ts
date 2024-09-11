export interface Column {
  udtName: string
  nullable: boolean
  tsType?: string
}
export interface Table {
  [columnName: string]: Column
}
export declare function tableToTS(name: string, table: Table): string
