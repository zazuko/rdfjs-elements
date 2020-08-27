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
    if (results instanceof Error) {
      this._mocks.set(format, results)
    } else {
      const fakeSink = {
        import() {
          return results
        },
        [Symbol.iterator]() {
          return results[Symbol.iterator]()
        },
      }

      this._mocks.set(format, fakeSink)
    }
  }

  [Symbol.iterator]() {
    return this._mocks[Symbol.iterator]()
  }
}

export const serializers = new FakeSinkMap()
export const parsers = new FakeSinkMap()
