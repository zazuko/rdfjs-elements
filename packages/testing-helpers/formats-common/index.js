class FakeSinkMap {
  constructor() {
    this._mocks = new Map()
  }

  import(format) {
    const result = this._mocks.get(format)
    this._mocks.delete(format)

    if (result instanceof Error) {
      throw result
    }

    return result
  }

  set(format, results) {
    this._mocks.set(format, results)
  }
}

export const serializers = new FakeSinkMap()
export const parsers = new FakeSinkMap()
