export type ColumnsProps = Array<ColumnItemProps>

export interface ColumnItemProps {
  key: string
  label: string
  span?: number
}
export interface RequestOptionsProps {
  url: string
  method: string
  params?: Object
}
