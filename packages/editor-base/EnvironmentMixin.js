export default function (Base, environment) {
  return class extends Base {
    constructor() {
      super()
      this.$rdf = environment
    }
  }
}
