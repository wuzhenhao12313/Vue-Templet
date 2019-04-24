import { isArray } from './util'

class _linq {
  constructor (array) {
    array = isArray(array) ? array : []
    this.array = [...array]
  }

  where (expression) {
    this.array = this.array.filter(expression)
    return this
  }

  select (expression) {
    this.array = this.array.map(expression)
    return this
  }

  orderBy (orderColumn) {
    if (this.array.length === 0) {
      return this
    }
    this.array = this.array.sort(function (a, b) {
      return a[orderColumn] - b[orderColumn]
    })
    return this
  }

  orderByDescending (orderColumn) {
    if (this.array.length === 0) {
      return this
    }
    this.array = this.array.sort(function (a, b) {
      return b[orderColumn] - a[orderColumn]
    })
    return this
  }

  first () {
    if (this.array.length === 0) {
      return null
    }
    return this.array[0]
  }

  last () {
    const _array = [...this.array]
    return _array.reverse()[0]
  }

  toList () {
    return this.array
  }

  count () {
    return this.array.length
  }
}

const linq = (array) => {
  return new _linq(array)
}

export default linq
