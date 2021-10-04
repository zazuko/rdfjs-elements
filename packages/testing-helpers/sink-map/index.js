export class FakeSinkMap {
  constructor(...args) {
    this._mocks = new Map(...args)
    this.lastImport = {}
  }

  import(format, stream, options) {
    this.lastImport = {
      format,
      options,
    }

    const result = this._mocks.get(format)
    this._mocks.delete(format)

    if (result instanceof Error) {
      throw result
    }

    return result
  }

  set(format, results, prefixes = {}) {
    if (results instanceof Error) {
      this._mocks.set(format, results)
    } else {
      const fakeSink = {
        import() {
          return results
        },
        on(ev, handler) {
          if (ev === 'prefix') {
            Object.entries(prefixes).forEach(pair => handler(...pair))
          }
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
