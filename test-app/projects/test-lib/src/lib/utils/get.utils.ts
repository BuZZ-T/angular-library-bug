export interface IData {
  name: string
  value: number
}

export const getData = (): IData => ({
  name: 'foo',
  value: 3
})
